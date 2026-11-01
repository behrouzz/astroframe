#!/usr/bin/env python3
"""
Independent validation of astroframe against the ORIGINAL SOFA C code.

For every one of the 247 routines this script
  1. draws random (seeded) inputs,
  2. generates a C driver and compiles it with gcc together with the unmodified
     SOFA sources (20231011/c/src),
  3. generates a JavaScript driver that calls the astroframe function with the
     very same inputs (inputs are exchanged as %.17g text, so they are bit-identical),
  4. runs both and compares every output value (all returned scalars, arrays,
     structures, status codes) in units in the last place (ulp).

Usage:  python validation/run.py [--cases N] [--seed S] [--opt -O2]
Needs:  gcc, node, Python 3.  Writes validation/work/* and validation/report.md.
"""
import argparse
import math
import os
import random
import re
import struct
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from c2js import Translator, T   # noqa: E402
from generate import CSRC        # noqa: E402

WORK = os.path.join(HERE, 'work')

P1 = {'date1', 'dj1', 'utc1', 'tai1', 'tt1', 'ut11', 'tcb1', 'tcg1', 'tdb1', 'd1', 'uta', 'tta',
      'date01', 'date11', 'ep1a', 'ep2a'}
P2 = {'date2', 'dj2', 'utc2', 'tai2', 'tt2', 'ut12', 'tcb2', 'tcg2', 'tdb2', 'd2', 'utb', 'ttb',
      'date02', 'date12', 'ep1b', 'ep2b'}
LATS = {'dec', 'dc', 'di', 'd5', 'd1950', 'd2000', 'phi', 'el', 'db', 'dd', 'b0', 'bp', 'bl', 'dec1', 'dec2'}
TINY = {'xp', 'yp', 'sp', 'dpsi', 'deps', 'x', 'y', 's', 'refa', 'refb', 'dr', 'dl',
        'pr', 'pd', 'pmr', 'pmd', 'pmr1', 'pmd1', 'dr5', 'dd5', 'dr1950', 'dd1950', 'dr2000', 'dd2000',
        'drh', 'ddh'}
STRUCT_FIELDS = None


import datetime
LEAP_DAYS = [datetime.date(y, m, d) for y, m, d in [
    (1972, 6, 30), (1972, 12, 31), (1973, 12, 31), (1974, 12, 31), (1975, 12, 31), (1976, 12, 31),
    (1977, 12, 31), (1978, 12, 31), (1979, 12, 31), (1981, 6, 30), (1982, 6, 30), (1983, 6, 30),
    (1985, 6, 30), (1987, 12, 31), (1989, 12, 31), (1990, 12, 31), (1992, 6, 30), (1993, 6, 30),
    (1994, 6, 30), (1995, 12, 31), (1997, 6, 30), (1998, 12, 31), (2005, 12, 31), (2008, 12, 31),
    (2012, 6, 30), (2015, 6, 30), (2016, 12, 31)]]


class Gen:
    def __init__(self, seed):
        self.r = random.Random(seed)
        self.jdpair = None
        self.leap = False        # this case is placed on (or next to) a UTC leap-second day

    def jd_pair(self):
        r = self.r
        if self.leap:
            d = r.choice(LEAP_DAYS)
            mjd = (d - datetime.date(1858, 11, 17)).days + r.choice([-1, 0, 0, 0, 1])
            return 2400000.5, mjd + r.choice([r.uniform(0.9, 1.0), r.uniform(0, 1), 0.99999])
        if r.random() < 0.7:
            return 2400000.5, r.uniform(37300, 66000)
        return 2451545.0 + round(r.uniform(-15000, 15000)), r.uniform(-0.5, 0.5)

    def dbl(self, fn, name, state):
        r = self.r
        if name in P1:
            a, b = self.jd_pair()
            state[name[:-1] + '2' if not name.endswith('b') else name] = None
            state['_pair'] = (a, b)
            return a
        if name in P2:
            return state['_pair'][1] if '_pair' in state else r.uniform(37300, 66000)
        if fn in ('anp', 'anpm') and name == 'a':
            return r.uniform(-20, 20)
        if fn in ('gc2gde', 'gd2gce') and name == 'a':
            return r.uniform(6.3e6, 6.4e6)
        if name == 'f':
            return r.uniform(0.0030, 0.0036)
        if name == 't':
            return r.uniform(-2, 2)
        if fn == 'dtdb' and name == 'ut':
            return r.uniform(0, 1)
        if fn == 'dtdb' and name in ('u', 'v'):
            return r.uniform(0, 6400)
        if fn == 'dtdb' and name == 'elong':
            return r.uniform(-3, 3)
        if name in ('epj', 'epb', 'bepoch'):
            return r.uniform(1900, 2100)
        if name in ('pmt',):
            return r.uniform(-100, 100)
        if name in ('px', 'px1', 'p1950', 'p2000', 'px5', 'pxh'):
            return r.uniform(0, 0.5)
        if name in ('rv', 'rv1', 'v1950', 'v2000', 'rv5', 'rvh'):
            return r.uniform(-100, 100)
        if name == 'dut1':
            return r.uniform(-0.9, 0.9)
        if name in ('dt', 'dta', 'dtr', 'days'):
            return r.uniform(-1, 1) * (0.002 if name == 'dtr' else (5 if name == 'days' else 100))
        if name == 'hm' or name == 'height':
            return r.uniform(0, 4000)
        if name == 'phpa':
            return r.uniform(700, 1100)
        if name == 'tc':
            return r.uniform(-20, 40)
        if name == 'rh':
            return r.uniform(0, 1)
        if name == 'wl':
            return r.uniform(0.3, 2.0)
        if name in ('ob1', 'ob2'):
            return r.uniform(-1, 1) if fn.endswith('13') and False else r.uniform(0, 3)
        if (name == 'sec') and self.leap:
            return r.uniform(59.0, 61.0)
        if name == 'fd' and self.leap:
            return r.uniform(0.9, 1.0)
        if name == 'sec' or name == 'asec':
            return r.uniform(0, 59.99)
        if name in ('em', 'bm'):
            return r.uniform(0.1, 2)
        if name in ('dlim', 'dl') and fn == 'ld':
            return r.uniform(1e-8, 1e-6)
        if name == 'bm1':
            return r.uniform(0.9999, 1.0)
        if name in TINY:
            scale = {'x': 0.01, 'y': 0.01, 's': 1e-4, 'sp': 1e-7, 'refa': 3e-4, 'refb': -3e-7}.get(
                name, 5e-6 if name in ('xp', 'yp') else (1e-3 if name in ('dpsi', 'deps') else 1e-6))
            if fn in ('eceq06', 'eqec06', 'g2icrs', 'icrs2g', 'lteceq', 'lteqec') and name in ('dr', 'dd', 'dl', 'db'):
                return r.uniform(-1.5, 1.5)
            return r.uniform(-1, 1) * scale
        if name in LATS:
            return r.uniform(-1.5, 1.5)
        if name in ('s',) and fn in ('ab',):
            return r.uniform(0.9, 1.1)
        if name in ('phib', 'gamb', 'psi', 'eps', 'epsa', 'era', 'gst', 'angle', 'a', 'b', 'a0', 'b0', 'al', 'ap',
                    'bl', 'bp', 'xi', 'eta', 'elong', 'theta', 'az', 'ha', 'ra', 'rc', 'ri', 'r5', 'r1950', 'r2000',
                    'ra1', 'ra2', 'rd', 'td', 's1', 's2', 'r', 'dh', 'dd', 'dl', 'db'):
            if name in ('rd', 'td', 's1', 's2', 'r') and fn in ('s2pv', 's2xpv', 's2p'):
                return r.uniform(0.5, 2) if name in ('r', 's1', 's2') else r.uniform(-1e-3, 1e-3)
            return r.uniform(-3, 3)
        return r.uniform(-1, 1)

    def ints(self, fn, name):
        r = self.r
        if self.leap and fn in ('dtf2d', 'dat', 'cal2jd'):
            d = self.leap_date
            if name == 'iy':
                return d.year
            if name == 'im':
                return d.month
            if name == 'id':
                return d.day
            if name in ('ihr', 'ihour'):
                return 23
            if name in ('imn', 'imin'):
                return 59
        if name == 'iy':
            return r.randint(1955, 2040)
        if name == 'im':
            return r.choice([0, 13]) if r.random() < 0.04 else r.randint(1, 12)
        if name == 'id':
            return r.choice([0, 32]) if r.random() < 0.05 else r.randint(1, 31)
        if name in ('ihr', 'ihour'):
            return r.randint(0, 23)
        if name in ('imn', 'imin', 'iamin'):
            return r.randint(0, 59)
        if name == 'ideg':
            return r.randint(0, 359)
        if name == 'ndp':
            return r.randint(-4, 8)
        if name == 'n' and fn in ('ldn', 'atciqn', 'aticqn'):
            return r.randint(0, 3)          # number of bodies in the 3-element array
        if name == 'n':
            return r.choice([0, 4]) if r.random() < 0.05 else r.randint(1, 3)
        if name == 'np':
            return r.choice([0, 9]) if r.random() < 0.05 else r.randint(1, 8)
        return r.randint(0, 10)

    def array(self, fn, name, dims):
        r = self.r
        n = 1
        for d in dims:
            n *= d
        if name == 'ebpv':
            return [r.uniform(-1, 1) for _ in range(3)] + [r.uniform(-0.02, 0.02) for _ in range(3)]
        if fn == 'ab' and name == 'v':
            return [r.uniform(-1e-4, 1e-4) for _ in range(3)]
        if fn == 'ld' and name == 'v':
            return [r.uniform(-1, 1) for _ in range(3)]
        if name in ('rbpn', 'rnpb', 'rc2i', 'rpom'):          # proper rotation matrices
            def rot(ax, ang):
                c, s_ = math.cos(ang), math.sin(ang)
                m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
                i, j = [(1, 2), (2, 0), (0, 1)][ax]
                m[i][i] = c; m[j][j] = c; m[i][j] = s_; m[j][i] = -s_
                return m
            def mul(a, b):
                return [[sum(a[i][k] * b[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
            m = mul(mul(rot(0, r.uniform(-0.3, 0.3)), rot(1, r.uniform(-0.3, 0.3))), rot(2, r.uniform(-3, 3)))
            return [x for row in m for x in row]
        return [r.uniform(-1, 1) for _ in range(n)]


def dim_val(d):
    if d is None:
        return 3
    if d[0] == 'num':
        return int(d[1])
    return 3     # 'n' of the n-body routines


def fmt(x):
    return '%.17g' % x


def build_cases(tr, n_cases, seed):
    """Return (lines_for_inputfile, specs)."""
    g = Gen(seed)
    lines = []
    specs = {}
    for cname in sorted(tr.sigs):
        sig = tr.sigs[cname]
        fn = sig.name
        specs[fn] = sig
        for _ in range(n_cases):
            toks = [fn]
            state = {}
            g.leap = g.r.random() < 0.3
            g.leap_date = g.r.choice(LEAP_DAYS)
            for pn, pt, kind in sig.params:
                if kind == 'out':
                    continue
                if pt.base == 'iauASTROM':
                    a, b = g.jd_pair()
                    vals = [a, b, g.r.uniform(-0.9, 0.9), g.r.uniform(-3, 3), g.r.uniform(-1.4, 1.4),
                            g.r.uniform(0, 3000), g.r.uniform(-1, 1) * 5e-6, g.r.uniform(-1, 1) * 5e-6,
                            g.r.uniform(700, 1100), g.r.uniform(-10, 35), g.r.uniform(0, 1), g.r.uniform(0.4, 1.0)]
                    toks += [fmt(v) for v in vals]
                elif pt.base == 'iauLDBODY':
                    for _ in range(3):
                        toks += [fmt(g.r.uniform(1e-8, 1e-3)), fmt(g.r.uniform(1e-10, 1e-6))]
                        toks += [fmt(g.r.uniform(-5, 5)) for _ in range(6)]
                elif pt.base == 'char' and pt.ptr:
                    if pn == 'scale':
                        toks.append(g.r.choice(['UTC'] * 6 + ['TAI', 'TT', 'XYZ']))
                    else:
                        toks.append(g.r.choice(['R', 'H', 'A', 'R', 'H', 'A', 'Q']))
                elif pt.base == 'char':
                    toks.append(g.r.choice(['+', '-']))
                elif pt.dims:
                    dims = [dim_val(d) for d in pt.dims]
                    toks += [fmt(v) for v in g.array(fn, pn, dims)]
                elif pt.base in ('int', 'long'):
                    toks.append(str(g.ints(fn, pn)))
                else:
                    toks.append(fmt(g.dbl(fn, pn, state)))
            lines.append(' '.join(toks))
    return lines


# --------------------------------------------------------------------------- C driver

def struct_fields(tr, base):
    return tr.structs[base]


def c_flat_expr(tr, expr, t):
    """C statements printing value `expr` of type t."""
    if t.base in ('iauASTROM', 'iauLDBODY') and not t.dims:
        out = []
        for fname, ft in tr.structs[t.base]:
            out.append(c_flat_expr(tr, '%s.%s' % (expr, fname), ft))
        return '\n'.join(out)
    if t.dims:
        if t.base in ('iauASTROM', 'iauLDBODY'):
            n = dim_val(t.dims[0])
            return 'for (int _i = 0; _i < %d; _i++) {\n%s\n}' % (
                n, c_flat_expr(tr, '%s[_i]' % expr, T(t.base)))
        total = 1
        for d in t.dims:
            total *= dim_val(d)
        return 'for (int _i = 0; _i < %d; _i++) pd(((%s*)%s)[_i]);' % (total, t.base, expr)
    return 'pd((double)(%s));' % expr


def gen_c(tr, specs):
    L = ['#include <stdio.h>', '#include <string.h>', '#include <stdlib.h>', '#include "sofa.h"', '',
         'static void pd(double x) { printf(" %.17g", x); }', '',
         'int main(void) {', '  char fn[64];', '  while (scanf("%63s", fn) == 1) {', '    double _d; int _k; char _tok[64];', '    (void)_d; (void)_k; (void)_tok;']
    first = True
    for fn in sorted(specs):
        sig = specs[fn]
        body = []
        args = []
        for pn, pt, kind in sig.params:
            v = 'v_' + pn
            if kind == 'out':
                if pt.base in ('iauASTROM', 'iauLDBODY'):
                    body.append('%s %s; memset(&%s, 0, sizeof %s);' % (pt.base, v, v, v))
                    args.append('&' + v)
                elif pt.dims:
                    dims = ''.join('[%d]' % dim_val(d) for d in pt.dims)
                    body.append('%s %s%s; memset(%s, 0, sizeof %s);' % (pt.base, v, dims, v, v))
                    args.append(v)
                else:
                    body.append('%s %s = 0;' % (pt.base, v))
                    args.append('&' + v)
                continue
            if pt.base == 'iauASTROM':
                names = ['d1', 'd2', 'dut1', 'el', 'ph', 'hm', 'xp', 'yp', 'pp', 'tc', 'rh', 'wl']
                body.append('double %s;' % ', '.join('a_' + x for x in names))
                for x in names:
                    body.append('scanf("%%lf", &a_%s);' % x)
                body.append('iauASTROM %s; memset(&%s, 0, sizeof %s); { double eo_; iauApco13(%s, &%s, &eo_); }' % (
                    v, v, v, ', '.join('a_' + x for x in names), v))
                args.append('&' + v)
            elif pt.base == 'iauLDBODY':
                body.append('iauLDBODY %s[3];' % v)
                body.append('for (int _i = 0; _i < 3; _i++) { scanf("%%lf %%lf", &%s[_i].bm, &%s[_i].dl); for (int _a = 0; _a < 2; _a++) for (int _b = 0; _b < 3; _b++) scanf("%%lf", &%s[_i].pv[_a][_b]); }' % (v, v, v))
                args.append(v)
            elif pt.base == 'char' and pt.ptr:
                body.append('char %s[16]; scanf("%%15s", %s);' % (v, v))
                args.append(v)
            elif pt.base == 'char':
                body.append('char %s; scanf("%%63s", _tok); %s = _tok[0];' % (v, v))
                args.append(v)
            elif pt.dims:
                dims = ''.join('[%d]' % dim_val(d) for d in pt.dims)
                total = 1
                for d in pt.dims:
                    total *= dim_val(d)
                body.append('%s %s%s; for (int _i = 0; _i < %d; _i++) scanf("%%lf", &((double*)%s)[_i]);' % (pt.base, v, dims, total, v))
                args.append(v)
            elif pt.base in ('int', 'long'):
                body.append('int %s; scanf("%%d", &%s);' % (v, v))
                args.append(v)
            else:
                body.append('double %s; scanf("%%lf", &%s);' % (v, v))
                args.append(v)
        call = '%s(%s)' % (sig.cname, ', '.join(args))
        if sig.ret.base == 'void':
            body.append(call + ';')
        elif sig.ret.base in ('int', 'long'):
            body.append('int ret_ = %s;' % call)
        else:
            body.append('double ret_ = %s;' % call)
        body.append('printf("%s");' % fn)
        for pn, pt, kind in sig.params:
            if kind in ('out', 'inout'):
                body.append(c_flat_expr(tr, 'v_' + pn, pt if pt.dims or pt.base in ('iauASTROM', 'iauLDBODY') else T(pt.base)))
        if sig.ret.base != 'void':
            body.append('pd((double)ret_);')
        body.append('printf("\\n");')
        L.append('    %sif (!strcmp(fn, "%s")) {' % ('' if first else 'else ', fn))
        first = False
        L += ['      ' + b for b in body]
        L.append('    }')
    L.append('    else { fprintf(stderr, "unknown %s\\n", fn); return 1; }')
    L += ['  }', '  return 0;', '}']
    return '\n'.join(L) + '\n'


# --------------------------------------------------------------------------- JS driver

def gen_js(tr, specs):
    desc = {}
    for fn, sig in specs.items():
        desc[fn] = {
            'kind': sig.result_kind(),
            'retvoid': sig.ret.base == 'void',
            'statusKey': sig.status_key(),
            'params': [[pn, pt.base, [dim_val(d) for d in pt.dims], 1 if pt.ptr else 0, k] for pn, pt, k in sig.params],
        }
    import json
    structs = {b: [[f, ft.base, [dim_val(d) for d in ft.dims]] for f, ft in fl] for b, fl in tr.structs.items()
               if b in ('iauASTROM', 'iauLDBODY')}
    js = '''// generated by validation/run.py
import fs from 'node:fs';
import * as AF from '../../src/index.js';
if (process.env.LIBM_NOISE) {
  // emulate a libm that differs from V8's by up to 1 ulp: perturb results of transcendental functions
  let st = 0x9e3779b9 >>> 0;
  const rnd = () => { st ^= st << 13; st >>>= 0; st ^= st >>> 17; st ^= st << 5; st >>>= 0; return st / 4294967296; };
  for (const f of ['sin', 'cos', 'tan', 'atan', 'atan2', 'asin', 'acos', 'exp', 'log', 'pow']) {
    const orig = Math[f];
    Math[f] = (...a) => { const r = orig(...a); const u = rnd(); return u < 0.25 ? r * (1 + 2 ** -52) : (u < 0.5 ? r * (1 - 2 ** -52) : r); };
  }
}
const DESC = %s;
const STRUCTS = %s;
const toks = fs.readFileSync(process.argv[2], 'utf8').split(/\\s+/).filter(Boolean);
let pos = 0;
const next = () => toks[pos++];
const num = () => Number(next());
function mkarr(dims) {
  if (dims.length === 0) return num();
  return Array.from({ length: dims[0] }, () => mkarr(dims.slice(1)));
}
const out = [];
function flat(v, base, dims, acc) {
  if (dims.length) { for (const e of v) flat(e, base, dims.slice(1), acc); return; }
  if (STRUCTS[base]) { for (const [f, fb, fd] of STRUCTS[base]) flat(v[f], fb, fd, acc); return; }
  if (typeof v === 'string') { acc.push(v.charCodeAt(0)); return; }
  acc.push(v === undefined ? 'undef' : v);
}
while (pos < toks.length) {
  const fn = next();
  const d = DESC[fn];
  const args = [];
  const outsDesc = [];
  for (const [pn, base, dims, ptr, kind] of d.params) {
    if (kind === 'out') { outsDesc.push([pn, base, dims, kind]); continue; }
    let a;
    if (base === 'iauASTROM') {
      const v = Array.from({ length: 12 }, num);
      a = AF.apco13(...v).astrom;
    } else if (base === 'iauLDBODY') {
      a = Array.from({ length: 3 }, () => { const bm = num(), dl = num(); return { bm, dl, pv: mkarr([2, 3]) }; });
    } else if (base === 'char') { a = next(); }
    else if (dims.length) { a = mkarr(dims); }
    else { a = num(); }
    args.push(a);
    if (kind === 'inout') outsDesc.push([pn, base, dims, kind, a]);
  }
  const res = AF[fn](...args);
  const acc = [];
  for (const [pn, base, dims, kind, a] of outsDesc) {
    let v;
    if (kind === 'inout') v = a;
    else if (d.kind === 'object') v = res[pn];
    else v = res;      // sole output returned directly
    flat(v, base, dims, acc);
  }
  if (!d.retvoid) {
    flat(d.kind === 'object' ? res[d.statusKey] : res, 'double', [], acc);
  }
  out.push(fn + ' ' + acc.map(String).join(' '));
}
fs.writeFileSync(process.argv[3], out.join('\\n') + '\\n');
''' % (json.dumps(desc), json.dumps(structs))
    return js


# --------------------------------------------------------------------------- comparison

def ulp_dist(a, b):
    if a == b:
        return 0
    if math.isnan(a) and math.isnan(b):
        return 0
    if math.isnan(a) or math.isnan(b) or math.isinf(a) != math.isinf(b):
        return float('inf')

    def key(x):
        i = struct.unpack('<q', struct.pack('<d', x))[0]
        return i if i >= 0 else -(1 << 63) - i
    return abs(key(a) - key(b))


def compare(cfile, jfile):
    cl = open(cfile).read().strip().split('\n')
    jl = open(jfile).read().strip().split('\n')
    assert len(cl) == len(jl), (len(cl), len(jl))
    stats = {}
    for a, b in zip(cl, jl):
        ta, tb = a.split(), b.split()
        assert ta[0] == tb[0], (ta[0], tb[0])
        assert len(ta) == len(tb), (ta[0], len(ta), len(tb))
        s = stats.setdefault(ta[0], dict(cases=0, vals=0, exact=0, maxulp=0, maxabs=0.0, maxrel=0.0, bad=0, worst=None, gross=[]))
        s['cases'] += 1
        for x, y in zip(ta[1:], tb[1:]):
            xf = float(x)
            yf = float(y) if y != 'undef' else float('nan')
            s['vals'] += 1
            u = ulp_dist(xf, yf)
            if u == 0:
                s['exact'] += 1
            else:
                ab = abs(xf - yf) if not (math.isnan(xf) or math.isnan(yf)) else float('inf')
                rel = ab / max(abs(xf), abs(yf), 1e-300)
                if ab > 1e-9 * max(1.0, abs(xf), abs(yf)) and len(s['gross']) < 5:
                    s['gross'].append((s['cases'], x, y))
                if ab > 1e-9 * max(1.0, abs(xf), abs(yf)):
                    s['bad'] += 1
                s['maxabs'] = max(s['maxabs'], ab)
                s['maxrel'] = max(s['maxrel'], rel)
                if u > s['maxulp']:
                    s['maxulp'] = u
                    s['worst'] = (x, y)
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cases', type=int, default=300)
    ap.add_argument('--seed', type=int, default=20231011)
    ap.add_argument('--opt', default='-O2')
    ap.add_argument('--report', default=os.path.join(HERE, 'report.md'))
    a = ap.parse_args()
    os.makedirs(WORK, exist_ok=True)
    tr = Translator(CSRC)
    tr.load_all()
    lines = build_cases(tr, a.cases, a.seed)
    specs = {s.name: s for s in tr.sigs.values()}
    open(os.path.join(WORK, 'cases.txt'), 'w').write('\n'.join(lines) + '\n')
    open(os.path.join(WORK, 'harness.c'), 'w').write(gen_c(tr, specs))
    open(os.path.join(WORK, 'harness.mjs'), 'w').write(gen_js(tr, specs))
    srcs = [os.path.join(CSRC, f) for f in sorted(os.listdir(CSRC)) if f.endswith('.c') and f != 't_sofa_c.c']
    exe = os.path.join(WORK, 'harness_c.exe')
    cmd = ['gcc', a.opt, '-ffp-contract=off', '-fno-fast-math', '-w', '-I', CSRC, '-o', exe,
           os.path.join(WORK, 'harness.c')] + srcs + ['-lm']
    print('compiling C reference:', a.opt)
    subprocess.run(cmd, check=True)
    with open(os.path.join(WORK, 'cases.txt')) as fin, open(os.path.join(WORK, 'c_out.txt'), 'w') as fout:
        subprocess.run([exe], stdin=fin, stdout=fout, check=True)
    subprocess.run(['node', os.path.join(WORK, 'harness.mjs'), os.path.join(WORK, 'cases.txt'),
                    os.path.join(WORK, 'js_out.txt')], check=True)
    env = dict(os.environ, LIBM_NOISE='1')
    subprocess.run(['node', os.path.join(WORK, 'harness.mjs'), os.path.join(WORK, 'cases.txt'),
                    os.path.join(WORK, 'js_noise_out.txt')], check=True, env=env)
    stats = compare(os.path.join(WORK, 'c_out.txt'), os.path.join(WORK, 'js_out.txt'))
    noise = compare(os.path.join(WORK, 'js_out.txt'), os.path.join(WORK, 'js_noise_out.txt'))
    write_report(a, stats, noise, subprocess.run(['gcc', '--version'], capture_output=True, text=True).stdout.split('\n')[0])


def write_report(a, stats, noise, gccv):
    tot_vals = sum(s['vals'] for s in stats.values())
    tot_exact = sum(s['exact'] for s in stats.values())
    ident = sorted(f for f, s in stats.items() if s['maxulp'] == 0)
    diff = sorted(((s['maxulp'], f) for f, s in stats.items() if s['maxulp'] > 0), reverse=True)
    gross = sorted(f for f, s in stats.items() if s['bad'])
    L = ['# Validation of astroframe against the original SOFA C code', '',
         'Generated by `validation/run.py` (seed %d, %d random cases per routine, C compiled with `gcc %s '
         '-ffp-contract=off`; %s; node %s).' % (a.seed, a.cases, a.opt, gccv,
                                              subprocess.run(['node', '-v'], capture_output=True, text=True).stdout.strip()),
         '', '* routines compared: %d' % len(stats),
         '* output values compared: %d, bit-identical: %d (%.3f%%)' % (tot_vals, tot_exact, 100.0 * tot_exact / tot_vals),
         '* routines whose outputs are bit-identical in every case: %d' % len(ident),
         '* routines with at least one differing value: %d' % len(diff),
         '* values differing by more than 1e-9 (absolute, or relative for |v|>1): %d in %d routines: %s' % (
             sum(s['bad'] for s in stats.values()), len(gross), ', '.join(gross) or 'none'), '',
         '"JS-vs-JS(noise)" is the same JavaScript run with every transcendental function perturbed by 1 ulp: it',
         'shows how much an ulp-level libm difference alone moves the result of each routine.  C-vs-JS errors of',
         'that size are therefore expected (V8 and the C runtime use different sin/cos/atan2 implementations).', '',
         '## Routines with differences', '',
         '| routine | cases | values | bit-identical | max abs err C-vs-JS | max abs err JS-vs-JS(noise) | values > 1e-9 | worst pair (C, JS) |',
         '|---|---|---|---|---|---|---|---|']
    for u, f in diff:
        s = stats[f]
        L.append('| %s | %d | %d | %.1f%% | %.3g | %.3g | %d | %s |' % (
            f, s['cases'], s['vals'], 100.0 * s['exact'] / s['vals'], s['maxabs'], noise[f]['maxabs'], s['bad'],
            ('%s, %s' % s['worst']) if s['worst'] else ''))
    L += ['', '## Values differing by more than 1e-9', '']
    for f in gross:
        for case, x, y in stats[f]['gross']:
            L.append('* %s case %d: C=%s JS=%s' % (f, case, x, y))
    L += ['', '## Routines bit-identical in all cases', '', ', '.join(ident), '']
    open(a.report, 'w').write('\n'.join(L))
    print('routines: %d, bit-identical routines: %d, values: %d, identical values: %.3f%%' % (
        len(stats), len(ident), tot_vals, 100.0 * tot_exact / tot_vals))
    print('largest ulp differences:', [(f, u) for u, f in diff[:12]])


if __name__ == '__main__':
    main()
