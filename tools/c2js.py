#!/usr/bin/env python3
"""
c2js.py -- translate the SOFA ANSI C library (release 2023-10-11) to
JavaScript (ES modules).

This is the tool that generated the files in astroframe/src.  It contains a small
tokenizer and parser for the C subset used by SOFA, a type tracker (needed to
get C integer division right), and a JavaScript emitter.

Calling convention of the generated functions
---------------------------------------------
* Arguments that SOFA only reads ("Given") are ordinary JS arguments.
* Arguments that SOFA only writes ("Returned") disappear from the argument list
  and are returned instead:
    - one output and a void C function  -> the output itself is returned
    - otherwise                         -> an object { out1, out2, ..., status }
      (the C return value is called `status`, or `value` for a double).
* Arguments that SOFA both reads and writes ("Given and returned") stay
  arguments and are updated in place.
* Vectors are arrays [x, y, z]; p-v pairs are [[x, y, z], [vx, vy, vz]];
  matrices are arrays of rows.
"""
import os
import re
import sys

# ----------------------------------------------------------------------------
# Lexer
# ----------------------------------------------------------------------------

TOKEN_RE = re.compile(r'''
    (?P<ws>\s+)
  | (?P<num>(?:\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)[fFlLuU]*)
  | (?P<id>[A-Za-z_]\w*)
  | (?P<str>"(?:\\.|[^"\\])*")
  | (?P<chr>'(?:\\.|[^'\\])+')
  | (?P<op>->|\+\+|--|<<=|>>=|<<|>>|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|/=|%=|&=|\|=|\^=|[-+*/%<>=!~&|^?:;,.(){}\[\]])
''', re.X)


def strip_comments(src):
    out = []
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if src.startswith('/*', i):
            j = src.index('*/', i + 2)
            out.append(' ')
            i = j + 2
        elif c == '"':
            j = i + 1
            while src[j] != '"':
                j += 2 if src[j] == '\\' else 1
            out.append(src[i:j + 1])
            i = j + 1
        elif c == "'":
            j = i + 1
            while src[j] != "'":
                j += 2 if src[j] == '\\' else 1
            out.append(src[i:j + 1])
            i = j + 1
        else:
            out.append(c)
            i += 1
    return ''.join(out)


def tokenize(src):
    src = strip_comments(src)
    # drop preprocessor lines and handle line continuations
    lines = [l for l in src.split('\n') if not l.lstrip().startswith('#')]
    src = '\n'.join(lines)
    toks = []
    pos = 0
    while pos < len(src):
        m = TOKEN_RE.match(src, pos)
        if not m:
            raise SyntaxError('bad char %r near %r' % (src[pos], src[pos:pos + 40]))
        pos = m.end()
        k = m.lastgroup
        if k == 'ws':
            continue
        toks.append((k, m.group(k)))
    return toks


# ----------------------------------------------------------------------------
# Types
# ----------------------------------------------------------------------------

class T:
    """A C type: base name, array dims (list of expr-or-None), pointer depth."""
    def __init__(self, base, dims=None, ptr=0):
        self.base = base
        self.dims = list(dims or [])
        self.ptr = ptr

    def elem(self):
        if self.dims:
            return T(self.base, self.dims[1:], self.ptr)
        if self.ptr:
            return T(self.base, [], self.ptr - 1)
        return self

    def is_int(self):
        return self.base in ('int', 'long') and not self.dims and not self.ptr or \
            (self.base in ('int', 'long') and self.ptr == 1 and not self.dims)

    def is_scalar_num(self):
        return not self.dims and self.base in ('int', 'long', 'double')

    def __repr__(self):
        return 'T(%s,%s,%d)' % (self.base, self.dims, self.ptr)


DOUBLE = T('double')
INT = T('int')
LONG = T('long')
CHAR = T('char')
VOID = T('void')

BASE_TYPES = {'double', 'int', 'long', 'char', 'void', 'unsigned', 'short', 'float'}

JS_RESERVED = set('''break case catch class const continue debugger default delete do else enum export
extends false finally for function if import in instanceof new null return super switch this throw true
try typeof var void while with yield let static implements interface package private protected public
await async of arguments eval undefined NaN Infinity Math Array Number Object String Map Set Date JSON'''.split())

MATH_FUNCS = {
    'sin': 'Math.sin', 'cos': 'Math.cos', 'tan': 'Math.tan', 'asin': 'Math.asin',
    'acos': 'Math.acos', 'atan': 'Math.atan', 'atan2': 'Math.atan2', 'sqrt': 'Math.sqrt',
    'exp': 'Math.exp', 'log': 'Math.log', 'log10': 'Math.log10', 'pow': 'Math.pow',
    'fabs': 'Math.abs', 'floor': 'Math.floor', 'ceil': 'Math.ceil', 'abs': 'Math.abs',
    'sinh': 'Math.sinh', 'cosh': 'Math.cosh', 'tanh': 'Math.tanh', 'hypot': 'Math.hypot',
}
# helper macros of sofam.h that become functions in util.js
HELPERS = {'dint', 'dnint', 'dsign', 'gmax', 'gmin', 'strcmp', 'zeros'}
HELPER_RET = {'dint': DOUBLE, 'dnint': DOUBLE, 'dsign': DOUBLE, 'strcmp': INT}

MACRO_CONSTS = {  # name -> type
    'DPI': DOUBLE, 'D2PI': DOUBLE, 'DR2D': DOUBLE, 'DD2R': DOUBLE, 'DR2AS': DOUBLE, 'DAS2R': DOUBLE,
    'DS2R': DOUBLE, 'TURNAS': DOUBLE, 'DMAS2R': DOUBLE, 'DTY': DOUBLE, 'DAYSEC': DOUBLE, 'DJY': DOUBLE,
    'DJC': DOUBLE, 'DJM': DOUBLE, 'DJ00': DOUBLE, 'DJM0': DOUBLE, 'DJM00': DOUBLE, 'DJM77': DOUBLE,
    'TTMTAI': DOUBLE, 'DAU': DOUBLE, 'CMPS': DOUBLE, 'AULT': DOUBLE, 'DC': DOUBLE, 'ELG': DOUBLE,
    'ELB': DOUBLE, 'TDB0': DOUBLE, 'SRS': DOUBLE, 'WGS84': INT, 'GRS80': INT, 'WGS72': INT,
}
OTHER_CONSTS = {'DBL_EPSILON': ('Number.EPSILON', DOUBLE), 'DBL_MAX': ('Number.MAX_VALUE', DOUBLE),
                'DBL_MIN': ('2.2250738585072014e-308', DOUBLE), 'M_PI': ('Math.PI', DOUBLE)}


def lcfirst(s):
    return s[:1].lower() + s[1:]


def js_func_name(cname):
    if not cname.startswith('iau'):
        return cname
    return lcfirst(cname[3:])


# ----------------------------------------------------------------------------
# Parser
# ----------------------------------------------------------------------------

class Parser:
    def __init__(self, toks, structs, typedefs):
        self.t = toks
        self.i = 0
        self.structs = structs       # struct name -> [(field, T)]
        self.typedefs = typedefs     # typedef name -> struct name
        self.anon = 0

    # token helpers
    def peek(self, k=0):
        j = self.i + k
        return self.t[j] if j < len(self.t) else ('eof', '')

    def val(self, k=0):
        return self.peek(k)[1]

    def next(self):
        tok = self.t[self.i]
        self.i += 1
        return tok

    def accept(self, v):
        if self.val() == v and self.peek()[0] in ('op', 'id'):
            self.i += 1
            return True
        return False

    def expect(self, v):
        if not self.accept(v):
            raise SyntaxError('expected %r got %r at %r' % (v, self.val(), [x[1] for x in self.t[self.i - 6:self.i + 6]]))

    # types
    def is_type_start(self, k=0):
        k_, v = self.peek(k)
        if k_ != 'id':
            return False
        return v in BASE_TYPES or v in ('const', 'struct', 'static', 'enum', 'typedef', 'unsigned') or v in self.typedefs

    def parse_base_type(self):
        """Parse specifiers; returns (base, flags) where flags has static/const; may define a struct."""
        flags = set()
        base = None
        while True:
            v = self.val()
            if v in ('static', 'const', 'typedef'):
                flags.add(v)
                self.i += 1
            elif v in ('unsigned', 'signed'):
                self.i += 1
            elif v in ('double', 'int', 'long', 'char', 'void', 'short', 'float'):
                if base == 'long' and v == 'int':
                    pass
                elif base is None or v == 'long':
                    base = v if base is None else base
                self.i += 1
            elif v == 'struct':
                self.i += 1
                name = None
                if self.peek()[0] == 'id' and self.val() != '{':
                    name = self.next()[1]
                if self.val() == '{':
                    fields = self.parse_struct_body()
                    if name is None:
                        self.anon += 1
                        name = '_anon%d' % self.anon
                    self.structs[name] = fields
                base = name
            elif v in self.typedefs and base is None:
                base = self.typedefs[v]
                self.i += 1
            elif v == 'enum':
                self.i += 1
                base = 'enum'
                break
            else:
                break
        return base, flags

    def parse_struct_body(self):
        self.expect('{')
        fields = []
        while not self.accept('}'):
            base, _ = self.parse_base_type()
            while True:
                name, t = self.parse_declarator(base)
                fields.append((name, t))
                if not self.accept(','):
                    break
            self.expect(';')
        return fields

    def parse_declarator(self, base):
        ptr = 0
        while self.accept('*'):
            ptr += 1
        name = self.next()[1]
        dims = []
        while self.accept('['):
            if self.accept(']'):
                dims.append(None)
            else:
                dims.append(self.expr())
                self.expect(']')
        return name, T(base, dims, ptr)

    # expressions -----------------------------------------------------------
    def expr(self):
        e = self.assign()
        if self.val() == ',':
            items = [e]
            while self.accept(','):
                items.append(self.assign())
            return ('comma', items)
        return e

    ASSIGN_OPS = {'=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='}

    def assign(self):
        l = self.cond()
        if self.peek()[0] == 'op' and self.val() in self.ASSIGN_OPS:
            op = self.next()[1]
            r = self.assign()
            return ('assign', op, l, r)
        return l

    def cond(self):
        c = self.binary(0)
        if self.accept('?'):
            a = self.expr()
            self.expect(':')
            b = self.cond()
            return ('cond', c, a, b)
        return c

    BIN_LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>='],
                  ['<<', '>>'], ['+', '-'], ['*', '/', '%']]

    def binary(self, lvl):
        if lvl == len(self.BIN_LEVELS):
            return self.unary()
        l = self.binary(lvl + 1)
        while self.peek()[0] == 'op' and self.val() in self.BIN_LEVELS[lvl]:
            op = self.next()[1]
            r = self.binary(lvl + 1)
            l = ('bin', op, l, r)
        return l

    def parse_type_name(self):
        base, _ = self.parse_base_type()
        ptr = 0
        while self.accept('*'):
            ptr += 1
        return T(base, [], ptr)

    def unary(self):
        k, v = self.peek()
        if k == 'op' and v in ('-', '+', '!', '~', '*', '&'):
            self.i += 1
            return ('un', v, self.unary())
        if k == 'op' and v in ('++', '--'):
            self.i += 1
            return ('pre', v, self.unary())
        if k == 'id' and v == 'sizeof':
            self.i += 1
            if self.val() == '(' and self.is_type_start(1):
                self.i += 1
                t = self.parse_type_name()
                self.expect(')')
                return ('sizeof_t', t)
            return ('sizeof_e', self.unary())
        if k == 'op' and v == '(' and self.is_type_start(1):
            self.i += 1
            t = self.parse_type_name()
            self.expect(')')
            return ('cast', t, self.unary())
        return self.postfix()

    def postfix(self):
        e = self.primary()
        while True:
            v = self.val()
            if self.peek()[0] != 'op':
                break
            if v == '[':
                self.i += 1
                idx = self.expr()
                self.expect(']')
                e = ('idx', e, idx)
            elif v == '(':
                self.i += 1
                args = []
                if not self.accept(')'):
                    args.append(self.assign())
                    while self.accept(','):
                        args.append(self.assign())
                    self.expect(')')
                e = ('call', e, args)
            elif v == '.' or v == '->':
                self.i += 1
                e = ('mem', e, self.next()[1])
            elif v in ('++', '--'):
                self.i += 1
                e = ('post', v, e)
            else:
                break
        return e

    def primary(self):
        k, v = self.next()
        if k == 'num':
            return ('num', v)
        if k == 'str':
            return ('str', v)
        if k == 'chr':
            return ('chr', v)
        if k == 'id':
            return ('id', v)
        if v == '(':
            e = self.expr()
            self.expect(')')
            return ('paren', e)
        raise SyntaxError('unexpected %r' % v)

    def init(self):
        if self.val() == '{':
            self.i += 1
            items = []
            while not self.accept('}'):
                items.append(self.init())
                if not self.accept(','):
                    self.expect('}')
                    break
            return ('init', items)
        return self.assign()

    # statements ------------------------------------------------------------
    def stmt(self):
        v = self.val()
        k = self.peek()[0]
        if v == '{' and k == 'op':
            return self.block()
        if k == 'id':
            if v == 'if':
                self.i += 1
                self.expect('(')
                c = self.expr()
                self.expect(')')
                a = self.stmt()
                b = None
                if self.accept('else'):
                    b = self.stmt()
                return ('if', c, a, b)
            if v == 'for':
                self.i += 1
                self.expect('(')
                ini = None if self.val() == ';' else self.expr()
                self.expect(';')
                cnd = None if self.val() == ';' else self.expr()
                self.expect(';')
                stp = None if self.val() == ')' else self.expr()
                self.expect(')')
                return ('for', ini, cnd, stp, self.stmt())
            if v == 'while':
                self.i += 1
                self.expect('(')
                c = self.expr()
                self.expect(')')
                return ('while', c, self.stmt())
            if v == 'return':
                self.i += 1
                e = None if self.val() == ';' else self.expr()
                self.expect(';')
                return ('return', e)
            if v == 'break':
                self.i += 1
                self.expect(';')
                return ('break',)
            if v == 'continue':
                self.i += 1
                self.expect(';')
                return ('continue',)
            if v == 'switch':
                self.i += 1
                self.expect('(')
                c = self.expr()
                self.expect(')')
                self.expect('{')
                cases = []
                while not self.accept('}'):
                    if self.accept('case'):
                        lab = self.cond()
                        self.expect(':')
                    else:
                        self.expect('default')
                        self.expect(':')
                        lab = None
                    body = []
                    while self.val() not in ('case', 'default', '}'):
                        body.append(self.stmt())
                    cases.append((lab, body))
                return ('switch', c, cases)
            if self.is_type_start():
                return self.declaration()
        if v == ';' and k == 'op':
            self.i += 1
            return ('empty',)
        e = self.expr()
        self.expect(';')
        return ('expr', e)

    def block(self):
        self.expect('{')
        items = []
        while not self.accept('}'):
            items.append(self.stmt())
        return ('block', items)

    def declaration(self):
        base, flags = self.parse_base_type()
        if base == 'enum':
            if self.peek()[0] == 'id':
                self.i += 1
            self.expect('{')
            items = []
            while not self.accept('}'):
                name = self.next()[1]
                val = None
                if self.accept('='):
                    val = self.cond()
                items.append((name, val))
                if not self.accept(','):
                    self.expect('}')
                    break
            self.expect(';')
            return ('enum', items)
        if 'typedef' in flags:
            name = self.next()[1]
            self.expect(';')
            self.typedefs[name] = base
            return ('empty',)
        if self.accept(';'):       # bare "struct x {...};"
            return ('empty',)
        decls = []
        while True:
            name, t = self.parse_declarator(base)
            init = None
            if self.accept('='):
                init = self.init()
            decls.append((name, t, init))
            if not self.accept(','):
                break
        self.expect(';')
        return ('decl', flags, decls)

    def function(self):
        base, _ = self.parse_base_type()
        ptr = 0
        while self.accept('*'):
            ptr += 1
        name = self.next()[1]
        self.expect('(')
        params = []
        if not self.accept(')'):
            while True:
                if self.val() == 'void' and self.val(1) == ')':
                    self.i += 1
                    break
                pb, pf = self.parse_base_type()
                pn, pt = self.parse_declarator(pb)
                params.append((pn, pt, 'const' in pf))
                if not self.accept(','):
                    break
            self.expect(')')
        body = self.block()
        return {'name': name, 'ret': T(base, [], ptr), 'params': params, 'body': body}


# ----------------------------------------------------------------------------
# Doc comment parsing
# ----------------------------------------------------------------------------

def parse_doc(src):
    """Return (doc_lines, {param: 'in'|'out'|'inout'}) from the header comment of a function."""
    m = re.search(r'\)\s*/\*(.*?)\*/\s*\{', src, re.S)
    if not m:
        return [], {}
    raw = m.group(1).split('\n')
    lines = []
    for l in raw:
        l = l.rstrip()
        if l.startswith('**'):
            l = l[2:]
            if l.startswith('  '):
                l = l[2:]
        lines.append(l)
    kinds = {}
    cur = None
    for l in lines:
        s = l.strip()
        mh = re.match(r'(Given and returned|Given|Returned)\b', s)
        if mh and not s.startswith('Returned (function'):
            cur = {'Given': 'in', 'Returned': 'out', 'Given and returned': 'inout'}[mh.group(1)]
            continue
        if re.match(r'(Returned \(function|Notes|Called|Defined in|Reference|This revision|Status|Test)', s):
            cur = None
            continue
        if cur is None:
            continue
        mp = re.match(r'^\s{1,5}\*?([\w,\[\]*]+)\s+(?:double|int|char|long|iau\w+)', l)
        if mp:
            for nm in mp.group(1).split(','):
                kinds.setdefault(re.sub(r'\[.*', '', nm).lstrip('*'), cur)
    return lines, kinds


# ----------------------------------------------------------------------------
# Signatures
# ----------------------------------------------------------------------------

class Sig:
    def __init__(self, f, kinds, doc):
        self.cname = f['name']
        self.name = js_func_name(f['name'])
        self.ret = f['ret']
        self.params = []   # (name, T, kind)
        self.doc = doc
        for pn, pt, isconst in f['params']:
            k = kinds.get(pn)
            if k is None:
                k = 'out' if (pt.ptr and not pt.dims and pt.base != 'char') else 'in'
                if pt.base == 'char' and pt.ptr and not isconst:
                    k = 'out'
            self.params.append((pn, pt, k))
        self.outs = [p for p in self.params if p[2] == 'out']
        self.ins = [p for p in self.params if p[2] in ('in', 'inout')]
        self.inouts = [p for p in self.params if p[2] == 'inout']

    def returns_object(self):
        if not self.outs:
            return False
        if len(self.outs) == 1 and self.ret.base == 'void':
            return False
        return True

    def status_key(self):
        return 'status' if self.ret.base in ('int', 'long') else 'value'

    def result_kind(self):
        """'none' | 'direct-out' | 'object' | 'value' | 'inout'"""
        if self.returns_object():
            return 'object'
        if self.outs:
            return 'direct-out'
        if self.ret.base != 'void':
            return 'value'
        if self.inouts:
            return 'inout'
        return 'none'


# ----------------------------------------------------------------------------
# Emitter
# ----------------------------------------------------------------------------

class Ex:
    __slots__ = ('c', 'p', 't', 'b')

    def __init__(self, c, p, t, b=False):
        self.c, self.p, self.t, self.b = c, p, t, b

    def at(self, p):
        return self.c if self.p >= p else '(' + self.c + ')'


P_COMMA, P_ASSIGN, P_COND, P_OR, P_AND, P_BOR, P_XOR, P_BAND, P_EQ, P_REL, P_SHIFT, P_ADD, P_MUL, P_UN, P_POST, P_PRIM = range(1, 17)
BINPREC = {'||': P_OR, '&&': P_AND, '|': P_BOR, '^': P_XOR, '&': P_BAND, '==': P_EQ, '!=': P_EQ,
           '<': P_REL, '>': P_REL, '<=': P_REL, '>=': P_REL, '<<': P_SHIFT, '>>': P_SHIFT,
           '+': P_ADD, '-': P_ADD, '*': P_MUL, '/': P_MUL, '%': P_MUL}


class Skip(Exception):
    pass


class FuncEmitter:
    def __init__(self, tr, f, sig, structs):
        self.tr = tr
        self.f = f
        self.sig = sig
        self.structs = structs
        self.scope = {}          # c name -> (js name, T)
        self.imports_funcs = set()
        self.imports_consts = set()
        self.imports_helpers = set()
        self.imports_types = set()
        self.hoisted = []        # lines emitted at module level
        self.pre = []
        self.tmp = 0
        self.warnings = []
        self.given_arrays = {p[0] for p in sig.params if p[2] == 'in' and (p[1].dims)} if sig else set()
        self.used_names = set()
        self.reserved_imports = set()
        self.in_cond = 0
        self.audit = []
        self.cursors = {}        # C name -> js name of walking pointers (pointer + index pair)

    # name handling
    def declare(self, cname, t, static=False):
        js = cname
        if js in JS_RESERVED or js in self.reserved_imports or js in MACRO_CONSTS or js in HELPERS:
            js = js + '_'
        self.scope[cname] = (js, t)
        return js

    def lookup(self, name):
        if name in self.scope:
            return self.scope[name]
        return None

    # -- expressions --
    def num(self, v):
        txt = re.sub(r'[fFlLuU]+$', '', v)
        is_int = re.fullmatch(r'\d+[uUlL]*', v) is not None
        if is_int and len(txt) > 1 and txt.startswith('0'):
            txt = str(int(txt, 8))      # C octal literal
        return Ex(txt, P_PRIM, LONG if re.search('[lL]', v) and is_int else (INT if is_int else DOUBLE))

    def coerce(self, e, t):
        """Coerce expression e to scalar type t on assignment/return/pass."""
        if t is None or t.dims:
            return e.c
        if e.b and t.base in ('int', 'long', 'double') and not t.ptr:
            return '(%s ? 1 : 0)' % e.c
        if t.base in ('int', 'long') and not t.ptr and e.t is not None and e.t.base == 'double' and not e.t.dims:
            self.audit.append('implicit double->%s truncation: %s' % (t.base, e.c))
            return 'Math.trunc(%s)' % e.c
        return e.c

    def ex(self, n):
        k = n[0]
        m = getattr(self, 'x_' + k)
        return m(n)

    def x_num(self, n):
        return self.num(n[1])

    def x_str(self, n):
        s = n[1]
        return Ex(s, P_PRIM, T('char', [], 1))

    def x_chr(self, n):
        s = n[1][1:-1]
        return Ex(("'%s'" % s) if s != "'" else "\"'\"", P_PRIM, CHAR)

    def x_paren(self, n):
        e = self.ex(n[1])
        return Ex(e.c, e.p if e.p == P_PRIM else e.p, e.t, e.b)

    def x_id(self, n):
        name = n[1]
        r = self.lookup(name)
        if r:
            if name in self.cursors:
                raise Skip('walking pointer %s used outside deref/++/=' % name)
            return Ex(r[0], P_PRIM, r[1])
        if name in MACRO_CONSTS:
            self.imports_consts.add(name)
            return Ex(name, P_PRIM, MACRO_CONSTS[name])
        if name in OTHER_CONSTS:
            c, t = OTHER_CONSTS[name]
            return Ex(c, P_PRIM, t)
        raise Skip('unknown identifier %s' % name)

    def x_bin(self, n):
        op = n[1]
        l = self.ex(n[2])
        if op in ('&&', '||'):
            self.in_cond += 1
            r = self.ex(n[3])
            self.in_cond -= 1
        else:
            r = self.ex(n[3])
        p = BINPREC[op]
        if op in ('&&', '||', '==', '!=', '<', '>', '<=', '>='):
            if op in ('==', '!='):
                op_js = '===' if op == '==' else '!=='
                # compare chars/strings strictly, numbers loosely is fine too
                op_js = op
            else:
                op_js = op
            if l.b and not (op in ('&&', '||')):
                l = Ex('(%s ? 1 : 0)' % l.c, P_PRIM, INT)
            if r.b and not (op in ('&&', '||')):
                r = Ex('(%s ? 1 : 0)' % r.c, P_PRIM, INT)
            return Ex('%s %s %s' % (l.at(p), op_js, r.at(p + 1)), p, INT, True)
        lt, rt = l.t or DOUBLE, r.t or DOUBLE
        isint = lt.is_scalar_num() and rt.is_scalar_num() and lt.base != 'double' and rt.base != 'double'
        resbase = 'double'
        if lt.base != 'double' and rt.base != 'double':
            resbase = 'long' if 'long' in (lt.base, rt.base) else 'int'
        rtype = T(resbase)
        if l.b:
            l = Ex('(%s ? 1 : 0)' % l.c, P_PRIM, INT)
        if r.b:
            r = Ex('(%s ? 1 : 0)' % r.c, P_PRIM, INT)
        if op == '/' and isint:
            self.audit.append('integer division: %s / %s' % (l.c, r.c))
            return Ex('Math.trunc(%s / %s)' % (l.at(P_MUL), r.at(P_MUL + 1)), P_PRIM, rtype)
        if op == '/' and not isint and (lt.base not in ('int', 'long', 'double') or rt.base not in ('int', 'long', 'double') or lt.dims or rt.dims):
            self.audit.append('UNTYPED division (check!): %s / %s' % (l.c, r.c))
        if op == '%' and (lt.base == 'double' or rt.base == 'double'):
            self.audit.append('UNEXPECTED floating %%: %s' % l.c)
        if op in ('<<', '>>', '|', '&', '^'):
            rtype = INT
        sp = ' %s ' % op
        # avoid  a - -b  -> a - -b (fine), a - --b problems handled by spaces
        return Ex('%s%s%s' % (l.at(p), sp, r.at(p + 1)), p, rtype)

    def x_un(self, n):
        op = n[1]
        if op == '*':
            inner = n[2]
            while inner[0] == 'paren':
                inner = inner[1]
            cur = self.cursor_of(inner)
            if cur is not None:
                js, step = cur
                return Ex('%s[%s$i%s]' % (js, js, step), P_POST, T(self.scope_t(js)))
            e = self.ex(n[2])
            if e.t is not None and e.t.ptr and not e.t.dims:
                raise Skip('dereference of pointer expression %s' % e.c)
            return Ex(e.c, e.p, e.t.elem() if e.t and (e.t.ptr or e.t.dims) else e.t, e.b)
        if op == '&':
            raise Skip('address-of outside call arguments')
        e = self.ex(n[2])
        if op == '!':
            if e.b:
                return Ex('!' + e.at(P_UN), P_UN, INT, True)
            return Ex('!' + e.at(P_UN), P_UN, INT, True)
        c = e.at(P_UN)
        if e.b:
            c = '(%s ? 1 : 0)' % e.c
        if op in '+-' and c.startswith(op):
            c = '(%s)' % c
        return Ex(op + c, P_UN, e.t if e.t and e.t.base != 'char' else INT)

    def scope_t(self, js):
        for cname, (j, t) in self.scope.items():
            if j == js:
                return t.base
        return 'double'

    def cursor_of(self, n):
        """If n is  p  or  p++  (p a walking pointer) return (js name, '' or '++')."""
        if n[0] == 'id' and n[1] in self.cursors:
            return self.cursors[n[1]], ''
        if n[0] == 'post' and n[1] == '++' and n[2][0] == 'id' and n[2][1] in self.cursors:
            return self.cursors[n[2][1]], '++'
        return None

    def x_pre(self, n):
        e = self.ex(n[2])
        self.check_write(n[2])
        return Ex(n[1] + e.at(P_UN), P_UN, e.t)

    def x_post(self, n):
        if n[2][0] == 'id' and n[2][1] in self.cursors:
            js = self.cursors[n[2][1]]
            return Ex('%s$i%s' % (js, n[1]), P_POST, INT)
        e = self.ex(n[2])
        self.check_write(n[2])
        return Ex(e.at(P_POST) + n[1], P_POST, e.t)

    def root_id(self, n):
        while n[0] in ('idx', 'mem', 'paren'):
            n = n[1]
        if n[0] == 'un' and n[1] == '*':
            return self.root_id(n[2])
        return n[1] if n[0] == 'id' else None

    def check_write(self, target):
        r = self.root_id(target)
        if r in self.given_arrays:
            self.warnings.append('writes to given array param %s' % r)

    def x_assign(self, n):
        op, ln, rn = n[1], n[2], n[3]
        if ln[0] == 'id' and ln[1] in self.cursors:
            js = self.cursors[ln[1]]
            if op != '=':
                raise Skip('compound assignment to pointer')
            if rn[0] == 'id' and rn[1] in self.cursors:
                other = self.cursors[rn[1]]
                return Ex('%s = %s, %s$i = %s$i' % (js, other, js, other), P_COMMA, VOID)
            r = self.ex(rn)
            if not (r.t and (r.t.dims or r.t.ptr)):
                raise Skip('pointer assigned from non-array')
            return Ex('%s = %s, %s$i = 0' % (js, r.at(P_ASSIGN), js), P_COMMA, VOID)
        self.check_write(ln)
        l = self.ex(ln)
        r = self.ex(rn)
        if op == '=':
            return Ex('%s = %s' % (l.at(P_UN), self.coerce(r, l.t)), P_ASSIGN, l.t)
        if op == '/=' and l.t and l.t.base != 'double' and r.t and r.t.base != 'double':
            return Ex('%s = Math.trunc(%s / %s)' % (l.at(P_UN), l.at(P_MUL), r.at(P_MUL + 1)), P_ASSIGN, l.t)
        if l.t and l.t.base in ('int', 'long') and r.t and r.t.base == 'double' and op in ('+=', '-=', '*='):
            return Ex('%s = Math.trunc(%s %s %s)' % (l.at(P_UN), l.at(P_ADD), op[0], r.at(P_ADD + 1)), P_ASSIGN, l.t)
        rc = r.c if not r.b else '(%s ? 1 : 0)' % r.c
        return Ex('%s %s %s' % (l.at(P_UN), op, rc if op != '=' else rc), P_ASSIGN, l.t)

    def x_cond(self, n):
        c = self.ex(n[1])
        self.in_cond += 1
        a = self.ex(n[2])
        b = self.ex(n[3])
        self.in_cond -= 1
        t = a.t
        if b.t and a.t and b.t.base == 'double':
            t = b.t
        ac = a.c if not a.b else '(%s ? 1 : 0)' % a.c
        bc = b.c if not b.b else '(%s ? 1 : 0)' % b.c
        if ac != a.c or bc != b.c:
            return Ex('%s ? %s : %s' % (c.at(P_COND + 1), ac, bc), P_COND, t)
        return Ex('%s ? %s : %s' % (c.at(P_COND + 1), a.at(P_ASSIGN), b.at(P_COND)), P_COND, t)

    def x_comma(self, n):
        items = [self.ex(x) for x in n[1]]
        return Ex(', '.join(i.at(P_ASSIGN) for i in items), P_COMMA, items[-1].t)

    def x_idx(self, n):
        if n[1][0] == 'id' and n[1][1] in self.cursors:
            js = self.cursors[n[1][1]]
            i = self.ex(n[2])
            return Ex('%s[%s$i + %s]' % (js, js, i.at(P_ADD + 1)), P_POST, T(self.scope_t(js)))
        a = self.ex(n[1])
        i = self.ex(n[2])
        ic = i.c if not i.b else '(%s ? 1 : 0)' % i.c
        t = a.t.elem() if a.t else DOUBLE
        return Ex('%s[%s]' % (a.at(P_POST), ic), P_POST, t)

    def x_mem(self, n):
        a = self.ex(n[1])
        base = a.t.base
        fields = self.structs.get(base)
        if fields is None:
            raise Skip('member of non-struct %s' % base)
        ft = dict(fields).get(n[2])
        if ft is None:
            raise Skip('no field %s' % n[2])
        return Ex('%s.%s' % (a.at(P_POST), n[2]), P_POST, ft)

    def x_cast(self, n):
        t = n[1]
        e = self.ex(n[2])
        if t.base in ('int', 'long') and not t.ptr:
            if e.t and e.t.base == 'double':
                self.audit.append('explicit (%s) cast of double: %s' % (t.base, e.c))
                return Ex('Math.trunc(%s)' % e.c, P_PRIM, T(t.base))
            if e.b:
                return Ex('(%s ? 1 : 0)' % e.c, P_PRIM, T(t.base))
            return Ex(e.c, e.p, T(t.base))
        if t.base == 'double' and not t.ptr:
            if e.b:
                return Ex('(%s ? 1 : 0)' % e.c, P_PRIM, DOUBLE)
            return Ex(e.c, e.p, DOUBLE)
        return Ex(e.c, e.p, t)

    SIZES = {'double': 8, 'int': 4, 'long': 4, 'char': 1, 'float': 4}

    def sizeof_type(self, t):
        if t.ptr:
            return Ex('8', P_PRIM, INT)
        return Ex(str(self.SIZES.get(t.base, 1)), P_PRIM, INT)

    def x_sizeof_t(self, n):
        return self.sizeof_type(n[1])

    def x_sizeof_e(self, n):
        e = self.ex(n[1])
        t = e.t
        if t.dims:
            es = self.sizeof_type(T(t.base)).c
            parts = ['%s.length' % e.at(P_POST)]
            for d in t.dims[1:]:
                parts.append(self.ex(d).at(P_MUL + 1))
            parts.append(es)
            return Ex('(%s)' % ' * '.join(parts), P_PRIM, INT)
        return self.sizeof_type(t)

    def x_init(self, n):
        raise Skip('initialiser in expression')

    def x_call(self, n):
        fn = n[1]
        if fn[0] != 'id':
            raise Skip('indirect call')
        cname = fn[1]
        args = n[2]
        if cname in MATH_FUNCS:
            a = [self.ex(x) for x in args]
            t = INT if cname == 'abs' else DOUBLE
            return Ex('%s(%s)' % (MATH_FUNCS[cname], ', '.join(x.at(P_ASSIGN) for x in a)), P_POST, t)
        if cname == 'fmod':
            a = [self.ex(x) for x in args]
            return Ex('%s %% %s' % (a[0].at(P_MUL), a[1].at(P_MUL + 1)), P_MUL, DOUBLE)
        if cname in HELPERS:
            a = [self.ex(x) for x in args]
            if cname == 'strcmp':
                self.imports_helpers.add('strcmp')
            else:
                self.imports_helpers.add(cname)
            t = HELPER_RET.get(cname)
            if t is None:     # gmax / gmin: type of args
                t = DOUBLE if any(x.t and x.t.base == 'double' for x in a) else a[0].t
            return Ex('%s(%s)' % (cname, ', '.join(x.at(P_ASSIGN) for x in a)), P_POST, t)
        if cname.startswith('iau'):
            return self.sofa_call(cname, args)
        if cname in self.tr.extra_funcs:     # support functions of the test file
            return self.extra_call(cname, args)
        raise Skip('unknown function %s' % cname)

    def extra_call(self, cname, args):
        a = []
        for x in args:
            e = self.ex(x)
            a.append(self.coerce(e, None) if not e.b else '(%s ? 1 : 0)' % e.c)
        self.imports_helpers.add(cname)
        return Ex('%s(%s)' % (cname, ', '.join(a)), P_POST, INT)

    def lvalue_of(self, n):
        """Strip & / * from a call-site output argument and emit it as an lvalue."""
        while True:
            if n[0] == 'paren':
                n = n[1]
            elif n[0] == 'un' and n[1] in ('&', '*'):
                n = n[2]
            else:
                break
        return self.ex(n)

    def sofa_call(self, cname, args):
        sig = self.tr.sigs.get(cname)
        if sig is None:
            raise Skip('unknown sofa function %s' % cname)
        jsname = sig.name
        self.imports_funcs.add(jsname)
        if len(args) != len(sig.params):
            raise Skip('arg count mismatch calling %s' % cname)
        call_args = []
        out_targets = []
        for (pn, pt, kind), a in zip(sig.params, args):
            if kind == 'out':
                if self.in_cond:
                    raise Skip('call with outputs inside short-circuit expression: %s' % cname)
                tgt = self.lvalue_of(a)
                out_targets.append((pn, tgt))
                if pt.base in self.structs and not pt.dims:
                    call_args.append(tgt.c)     # struct outputs are filled in place
            else:
                if a[0] == 'un' and a[1] == '&':
                    e = self.lvalue_of(a)
                else:
                    e = self.ex(a)
                call_args.append(self.coerce(e, pt) if not pt.dims and kind == 'in' else e.c if e.p >= P_ASSIGN + 1 else e.c)
        call = '%s(%s)' % (jsname, ', '.join(call_args))
        rk = sig.result_kind()
        if rk == 'direct-out':
            pn, tgt = out_targets[0]
            self.pre.append('%s = %s;' % (tgt.c, call))
            return Ex('undefined', P_PRIM, VOID)
        if rk == 'object':
            self.tmp += 1
            tv = '_r%d' % self.tmp
            self.pre.append('const %s = %s;' % (tv, call))
            for pn, tgt in out_targets:
                self.pre.append('%s = %s.%s;' % (tgt.c, tv, pn))
            if sig.ret.base == 'void':
                return Ex('undefined', P_PRIM, VOID)
            return Ex('%s.%s' % (tv, sig.status_key()), P_POST, sig.ret)
        t = sig.ret if sig.ret.base != 'void' else VOID
        return Ex(call, P_POST, t)

    # -- statements --
    def indent(self, lines, n=1):
        pad = '  ' * n
        return [pad + l if l else l for l in lines]

    def emit_expr_stmt(self, n):
        """expression statement -> lines"""
        self.pre = []
        e = self.ex(n)
        lines = list(self.pre)
        self.pre = []
        if e.c != 'undefined':
            lines.append(e.c + ';')
        return lines

    def cond_expr(self, n):
        e = self.ex(n)
        return e.c

    def s(self, n):
        return getattr(self, 's_' + n[0])(n)

    def body(self, n):
        """Statement used as the body of if/for/while: always braced."""
        if n[0] == 'block':
            return self.block_lines(n)
        return self.s(n)

    def block_lines(self, n):
        out = []
        for st in n[1]:
            out.extend(self.s(st))
        return out

    def s_block(self, n):
        return ['{'] + self.indent(self.block_lines(n)) + ['}']

    def s_empty(self, n):
        return []

    def s_expr(self, n):
        return self.emit_expr_stmt(n[1])

    def s_if(self, n):
        self.pre = []
        c = self.cond_expr(n[1])
        pre = self.pre
        self.pre = []
        out = list(pre)
        out.append('if (%s) {' % c)
        out += self.indent(self.body(n[2]))
        b = n[3]
        while b is not None:
            if b[0] == 'if':
                self.pre = []
                c2 = self.cond_expr(b[1])
                pre2 = self.pre
                self.pre = []
                if pre2:
                    out.append('} else {')
                    inner = self.s_if(b)
                    out += self.indent(inner)
                    out.append('}')
                    return out
                out.append('} else if (%s) {' % c2)
                out += self.indent(self.body(b[2]))
                b = b[3]
            else:
                out.append('} else {')
                out += self.indent(self.body(b))
                b = None
        out.append('}')
        return out

    def s_for(self, n):
        _, ini, cnd, stp, body = n
        self.pre = []
        i = self.ex(ini).c if ini else ''
        c = self.cond_expr(cnd) if cnd else ''
        s = self.ex(stp).c if stp else ''
        if self.pre:
            raise Skip('call with outputs in for header')
        return ['for (%s; %s; %s) {' % (i, c, s)] + self.indent(self.body(body)) + ['}']

    def s_while(self, n):
        self.pre = []
        c = self.cond_expr(n[1])
        if self.pre:
            raise Skip('call with outputs in while condition')
        return ['while (%s) {' % c] + self.indent(self.body(n[2])) + ['}']

    def s_break(self, n):
        return ['break;']

    def s_continue(self, n):
        return ['continue;']

    def s_switch(self, n):
        self.pre = []
        c = self.cond_expr(n[1])
        out = list(self.pre)
        self.pre = []
        out.append('switch (%s) {' % c)
        for lab, body in n[2]:
            if lab is None:
                out.append('  default:')
            else:
                out.append('  case %s:' % self.ex(lab).c)
            inner = []
            for st in body:
                inner.extend(self.s(st))
            out += self.indent(inner, 2)
        out.append('}')
        return out

    def s_return(self, n):
        e = n[1]
        sig = self.sig
        pre = []
        val = None
        if e is not None:
            self.pre = []
            ex = self.ex(e)
            pre = list(self.pre)
            self.pre = []
            val = self.coerce(ex, self.f['ret']) if ex.c != 'undefined' else None
        rk = sig.result_kind() if sig else 'value'
        if rk == 'object':
            fields = [p[0] for p in sig.outs]
            parts = [self.scope[f][0] if self.scope[f][0] == f else '%s: %s' % (f, self.scope[f][0]) for f in fields]
            if sig.ret.base != 'void':
                parts.append('%s: %s' % (sig.status_key(), val))
            return pre + ['return { %s };' % ', '.join(parts)]
        if rk == 'direct-out':
            return pre + ['return %s;' % self.scope[sig.outs[0][0]][0]]
        if rk == 'inout':
            return pre + ['return %s;' % self.scope[sig.inouts[0][0]][0]]
        if val is not None:
            return pre + ['return %s;' % val]
        return pre + ['return;']

    def s_enum(self, n):
        cur = None
        for name, v in n[1]:
            if v is not None:
                ex = self.ex(v)
                code = ex.c
            else:
                code = '1' if cur is None else '%s + 1' % cur
                if cur is None:
                    code = '0'
            js = self.declare(name, INT)
            self.hoisted.append('const %s = %s;' % (js, code))
            cur = js
        return []

    def s_decl(self, n):
        _, flags, decls = n
        lines = []
        is_static = 'static' in flags
        for name, t, init in decls:
            # array dims inferred from initialiser
            t2 = T(t.base, t.dims, t.ptr)
            js = self.declare(name, t2)
            if t2.ptr == 1 and not t2.dims and t2.base in ('double', 'int', 'long') and not is_static:
                if init is not None:
                    raise Skip('initialised pointer local %s' % name)
                self.cursors[name] = js
                lines.append('let %s, %s$i = 0;' % (js, js))
                continue
            if init is not None and init[0] == 'init':
                code = self.init_code(init, t2)
                if t2.dims and t2.dims[0] is None:
                    pass
                if is_static or ('const' in flags and t2.dims):
                    self.hoisted.append('const %s = %s;' % (js, code))
                else:
                    lines.append('let %s = %s;' % (js, code))
                continue
            if init is not None:
                self.pre = []
                e = self.ex(init)
                pre = list(self.pre)
                self.pre = []
                code = self.coerce(e, t2)
                if is_static:
                    self.hoisted.append('const %s = %s;' % (js, code))
                else:
                    lines.extend(pre)
                    kw = 'const' if 'const' in flags and not t2.dims else 'let'
                    lines.append('%s %s = %s;' % (kw, js, code))
                continue
            # uninitialised
            lines.append('let %s%s;' % (js, self.default_init(t2)))
        return lines

    def default_init(self, t):
        if t.dims:
            dims = [self.ex(d).c if d is not None else None for d in t.dims]
            if any(d is None for d in dims):
                raise Skip('unsized uninitialised array')
            leaf = self.leaf_default(t)
            if t.base in self.structs and len(dims) == 1:
                maker = self.tr.struct_maker(t.base, self)
                return ' = Array.from({ length: %s }, %s)' % (dims[0], maker)
            if all(re.fullmatch(r'\d+', d) for d in dims) and int(dims[0]) * (int(dims[1]) if len(dims) > 1 else 1) <= 64 and len(dims) <= 2:
                if len(dims) == 1:
                    return ' = [%s]' % ', '.join([leaf] * int(dims[0]))
                row = '[%s]' % ', '.join([leaf] * int(dims[1]))
                return ' = [%s]' % ', '.join([row] * int(dims[0]))
            if t.base in self.structs:
                self.imports_helpers.add('structs')
                maker = self.tr.struct_maker(t.base, self)
                return ' = Array.from({ length: %s }, %s)' % (dims[0], maker)
            self.imports_helpers.add('zeros')
            return ' = zeros(%s)' % ', '.join(dims)
        if t.base in self.structs and not t.ptr:
            return ' = %s()' % self.tr.struct_maker(t.base, self)
        return ''

    def leaf_default(self, t):
        if t.base == 'char':
            return "''"
        return '0'

    def init_code(self, init, t):
        """Emit an initialiser list for a declared type."""
        return self.init_rec(init, t, 0)

    def init_rec(self, node, t, depth):
        if node[0] != 'init':
            e = self.ex(node)
            return self.coerce(e, T(t.base) if not t.dims else T(t.base))
        items = node[1]
        pad = '  ' * (depth + 1)
        if t.dims:
            sub = T(t.base, t.dims[1:], t.ptr)
            parts = [self.init_rec(i, sub, depth + 1) for i in items]
            if sub.dims or sub.base in self.structs:
                return '[\n' + ',\n'.join(pad + p for p in parts) + ',\n' + '  ' * depth + ']'
            # flat scalars: wrap lines
            lines, cur = [], []
            for p in parts:
                cur.append(p)
                if len(cur) >= 8:
                    lines.append(', '.join(cur))
                    cur = []
            if cur:
                lines.append(', '.join(cur))
            if len(lines) == 1:
                return '[' + lines[0] + ']'
            return '[\n' + ',\n'.join(pad + l for l in lines) + ',\n' + '  ' * depth + ']'
        if t.base in self.structs:
            fields = self.structs[t.base]
            parts = []
            for (fname, ft), i in zip(fields, items):
                parts.append('%s: %s' % (fname, self.init_rec(i, ft, depth + 1)))
            return '{ ' + ', '.join(parts) + ' }'
        raise Skip('initialiser list for scalar')

    # -- whole function --
    def run(self):
        sig = self.sig
        # names that must not be shadowed by locals
        self.reserved_imports = set(self.tr.callee_names(self.f['body_tokens'])) | set(MACRO_CONSTS)
        header_lines = []
        params_js = []
        for pn, pt, kind in sig.params:
            if kind == 'out':
                t = pt
                if pt.dims:
                    t = T(pt.base, pt.dims, pt.ptr)
                    js = self.declare(pn, t)
                    header_lines.append('let %s%s;' % (js, self.default_init_out(t)))
                elif pt.base in self.structs:
                    js = self.declare(pn, T(pt.base))
                    params_js.append('%s = %s()' % (js, self.tr.struct_maker(pt.base, self)))
                elif pt.base == 'char' and pt.ptr:
                    js = self.declare(pn, CHAR)
                    header_lines.append("let %s = '';" % js)
                else:
                    js = self.declare(pn, T(pt.base))
                    header_lines.append('let %s = 0;' % js)
            else:
                t = pt
                if pt.ptr and not pt.dims and pt.base not in self.structs and not (pt.base == 'char'):
                    t = T(pt.base)         # scalar passed by pointer, read-only
                if pt.base == 'char' and pt.ptr:
                    t = T('char', [], 1)
                js = self.declare(pn, t)
                params_js.append(js)
        body = self.block_lines(self.f['body'])
        # fall-off-the-end return
        last = self.f['body'][1][-1] if self.f['body'][1] else None
        if last is None or last[0] != 'return':
            rk = sig.result_kind()
            if rk in ('object', 'direct-out', 'inout'):
                body += self.s_return(('return', None))
        lines = header_lines + body
        return params_js, lines

    def default_init_out(self, t):
        if t.base in self.structs:
            return ' = Array.from({ length: %s }, %s)' % (self.ex(t.dims[0]).c, self.tr.struct_maker(t.base, self))
        return self.default_init(t)


# ----------------------------------------------------------------------------
# Translator driver
# ----------------------------------------------------------------------------

class Translator:
    def __init__(self, srcdir):
        self.srcdir = srcdir
        self.structs = {}
        self.typedefs = {}
        self.sigs = {}
        self.extra_funcs = set()
        self.parsed = {}
        self.makers = {}
        self._parse_header_types()

    def _parse_header_types(self):
        src = open(os.path.join(self.srcdir, 'sofa.h')).read()
        toks = tokenize(src)
        # find typedef structs
        i = 0
        while i < len(toks):
            if toks[i][1] == 'typedef' and toks[i + 1][1] == 'struct':
                j = i
                depth = 0
                while True:
                    if toks[j][1] == '{':
                        depth += 1
                    if toks[j][1] == '}':
                        depth -= 1
                        if depth == 0:
                            break
                    j += 1
                name = toks[j + 1][1]
                p = Parser(toks[i + 2:j + 1], self.structs, self.typedefs)
                fields = p.parse_struct_body()
                self.structs[name] = fields
                self.typedefs[name] = name
                i = j
            i += 1

    def struct_maker(self, base, fe):
        """Name of a factory function for struct `base`."""
        if base in ('iauASTROM', 'iauLDBODY'):
            nm = {'iauASTROM': 'newAstrom', 'iauLDBODY': 'newLdbody'}[base]
            fe.imports_types.add(nm)
            return nm
        # local struct type: build an inline factory
        fields = fe.structs[base]
        parts = []
        for fname, ft in fields:
            parts.append('%s: %s' % (fname, '0'))
        return '() => ({ %s })' % ', '.join(parts)

    def callee_names(self, toks):
        names = set()
        for k, v in toks:
            if k == 'id' and v.startswith('iau') and len(v) > 3 and v[3].isupper():
                names.add(js_func_name(v))
        for k, v in toks:
            if k == 'id' and v in HELPERS:
                names.add(v)
        return names

    def prescan(self, path):
        src = open(path).read()
        toks = tokenize(src)
        doc, kinds = parse_doc(src)
        # find function body start: first '{' at depth 0 after a ')' ... use Parser
        structs = dict(self.structs)
        typedefs = dict(self.typedefs)
        p = Parser(toks, structs, typedefs)
        # collect the tokens of the function body for name scanning
        f = p.function()
        start = None
        depth = 0
        f['body_tokens'] = toks
        sig = Sig(f, kinds, doc)
        f['structs'] = structs
        return f, sig, src

    def load_all(self):
        files = sorted(x for x in os.listdir(self.srcdir) if x.endswith('.c') and x != 't_sofa_c.c')
        for fn in files:
            path = os.path.join(self.srcdir, fn)
            f, sig, src = self.prescan(path)
            self.sigs[sig.cname] = sig
            self.parsed[sig.cname] = (f, sig, src, fn)
        # verify docs match
        problems = []
        for cname, (f, sig, src, fn) in self.parsed.items():
            for pn, pt, k in sig.params:
                if pn not in parse_doc(src)[1]:
                    problems.append('%s: param %s not found in docs' % (cname, pn))
        return problems


# ----------------------------------------------------------------------------
# Output formatting helpers
# ----------------------------------------------------------------------------

def doc_to_jsdoc(sig, doc_lines):
    out = ['/**']
    started = False
    body = []
    for l in doc_lines:
        s = l.strip()
        if re.fullmatch(r'[- ]*', s) and not started:
            continue
        if re.match(r'^(i a u|[a-z] )', s) and not started and ' ' in s and len(s) < 30 and s.replace(' ', '').isalnum():
            continue
        started = True
        body.append(l)
    # drop leading banner lines (letters spaced out) and copyright footer
    text = '\n'.join(body)
    text = re.sub(r'\biau([A-Z])', lambda m: m.group(1).lower(), text)
    text = text.replace('*/', '* /')
    text = text.replace("This function is part of the International Astronomical Union's",
                        "This function is derived from the International Astronomical Union's")
    text = text.replace('SOFA (Standards of Fundamental Astronomy) software collection.',
                        'SOFA (Standards of Fundamental Astronomy) software collection\n'
                        '  (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).')
    for l in text.split('\n'):
        out.append((' * ' + l).rstrip())
    out.append(' */')
    return out


def js_usage(sig):
    args = ', '.join(p[0] for p in sig.ins)
    rk = sig.result_kind()
    if rk == 'object':
        keys = [p[0] for p in sig.outs] + ([sig.status_key()] if sig.ret.base != 'void' else [])
        return 'const { %s } = %s(%s)' % (', '.join(keys), sig.name, args)
    if rk == 'direct-out':
        return 'const %s = %s(%s)' % (sig.outs[0][0], sig.name, args)
    if rk == 'value':
        return 'const result = %s(%s)' % (sig.name, args)
    if rk == 'inout':
        return '%s(%s)   // updates %s in place' % (sig.name, args, sig.inouts[0][0])
    return '%s(%s)' % (sig.name, args)


def indent_block(lines):
    return lines
