"""Static support files for astroframe (constants, util, types, index, d.ts)."""
import os
import re

from c2js import JS_RESERVED

CONSTANTS = """// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofam.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Constants from sofam.h (SOFA release 2023-10-11).

/** Pi */
export const DPI = 3.141592653589793238462643;
/** 2Pi */
export const D2PI = 6.283185307179586476925287;
/** Radians to degrees */
export const DR2D = 57.29577951308232087679815;
/** Degrees to radians */
export const DD2R = 1.745329251994329576923691e-2;
/** Radians to arcseconds */
export const DR2AS = 206264.8062470963551564734;
/** Arcseconds to radians */
export const DAS2R = 4.848136811095359935899141e-6;
/** Seconds of time to radians */
export const DS2R = 7.272205216643039903848712e-5;
/** Arcseconds in a full circle */
export const TURNAS = 1296000.0;
/** Milliarcseconds to radians */
export const DMAS2R = DAS2R / 1e3;
/** Length of tropical year B1900 (days) */
export const DTY = 365.242198781;
/** Seconds per day */
export const DAYSEC = 86400.0;
/** Days per Julian year */
export const DJY = 365.25;
/** Days per Julian century */
export const DJC = 36525.0;
/** Days per Julian millennium */
export const DJM = 365250.0;
/** Reference epoch (J2000.0), Julian Date */
export const DJ00 = 2451545.0;
/** Julian Date of Modified Julian Date zero */
export const DJM0 = 2400000.5;
/** Reference epoch (J2000.0), Modified Julian Date */
export const DJM00 = 51544.5;
/** 1977 Jan 1.0 as MJD */
export const DJM77 = 43144.0;
/** TT minus TAI (s) */
export const TTMTAI = 32.184;
/** Astronomical unit (m, IAU 2012) */
export const DAU = 149597870.7e3;
/** Speed of light (m/s) */
export const CMPS = 299792458.0;
/** Light time for 1 au (s) */
export const AULT = DAU / CMPS;
/** Speed of light (au per day) */
export const DC = DAYSEC / AULT;
/** L_G = 1 - d(TT)/d(TCG) */
export const ELG = 6.969290134e-10;
/** L_B = 1 - d(TDB)/d(TCB) */
export const ELB = 1.550519768e-8;
/** TDB (s) at TAI 1977/1/1.0 */
export const TDB0 = -6.55e-5;
/** Schwarzschild radius of the Sun (au) */
export const SRS = 1.97412574336e-8;
/** Reference ellipsoids (for eform / gc2gd / gd2gc) */
export const WGS84 = 1;
export const GRS80 = 2;
export const WGS72 = 3;
"""

UTIL = """// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofam.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Internal helpers replacing the C macros of sofam.h and a few libc functions.

/** Truncate to nearest whole number towards zero. */
export function dint(a) {
  return a < 0.0 ? Math.ceil(a) : Math.floor(a);
}

/** Round to nearest whole number (halves away from zero). */
export function dnint(a) {
  return Math.abs(a) < 0.5 ? 0.0 : (a < 0.0 ? Math.ceil(a - 0.5) : Math.floor(a + 0.5));
}

/** Magnitude of a with the sign of b. */
export function dsign(a, b) {
  return b < 0.0 ? -Math.abs(a) : Math.abs(a);
}

/** Larger of two numbers. */
export function gmax(a, b) {
  return a > b ? a : b;
}

/** Smaller of two numbers. */
export function gmin(a, b) {
  return a < b ? a : b;
}

/** C-style strcmp: 0 when equal. */
export function strcmp(a, b) {
  return a === b ? 0 : (a < b ? -1 : 1);
}

/** Zero-filled (nested) array with the given dimensions. */
export function zeros(...dims) {
  const n = dims[0];
  const rest = dims.slice(1);
  return Array.from({ length: n }, () => (rest.length ? zeros(...rest) : 0));
}
"""

TYPES = """// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofa.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Structures of sofa.h.

/**
 * Star-independent astrometry parameters (iauASTROM).
 * @typedef {Object} Astrom
 * @property {number} pmt    PM time interval (SSB, Julian years)
 * @property {number[]} eb   SSB to observer (vector, au)
 * @property {number[]} eh   Sun to observer (unit vector)
 * @property {number} em     distance from Sun to observer (au)
 * @property {number[]} v    barycentric observer velocity (vector, c)
 * @property {number} bm1    sqrt(1-|v|^2): reciprocal of Lorenz factor
 * @property {number[][]} bpn bias-precession-nutation matrix
 * @property {number} along  longitude + s' + dERA(DUT) (radians)
 * @property {number} phi    geodetic latitude (radians)
 * @property {number} xpl    polar motion xp wrt local meridian (radians)
 * @property {number} ypl    polar motion yp wrt local meridian (radians)
 * @property {number} sphi   sine of geodetic latitude
 * @property {number} cphi   cosine of geodetic latitude
 * @property {number} diurab magnitude of diurnal aberration vector
 * @property {number} eral   "local" Earth rotation angle (radians)
 * @property {number} refa   refraction constant A (radians)
 * @property {number} refb   refraction constant B (radians)
 */

/** Create a zero-filled Astrom object. @returns {Astrom} */
export function newAstrom() {
  return {
    pmt: 0, eb: [0, 0, 0], eh: [0, 0, 0], em: 0, v: [0, 0, 0], bm1: 0,
    bpn: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    along: 0, phi: 0, xpl: 0, ypl: 0, sphi: 0, cphi: 0, diurab: 0, eral: 0, refa: 0, refb: 0,
  };
}

/**
 * Body parameters for light deflection (iauLDBODY).
 * @typedef {Object} LdBody
 * @property {number} bm    mass of the body (solar masses)
 * @property {number} dl    deflection limiter (radians^2/2)
 * @property {number[][]} pv barycentric PV of the body (au, au/day)
 */

/** Create a zero-filled LdBody object. @returns {LdBody} */
export function newLdbody() {
  return { bm: 0, dl: 0, pv: [[0, 0, 0], [0, 0, 0]] };
}
"""


def dts_type(t):
    if t.base == 'iauASTROM':
        return 'Astrom'
    if t.base == 'iauLDBODY':
        base = 'LdBody'
    elif t.base == 'char':
        base = 'string'
    else:
        base = 'number'
    return base + '[]' * len(t.dims)


def dts_for(sig):
    args = []
    for pn, pt, k in sig.params:
        nm = pn if pn not in JS_RESERVED else pn + '_'
        if k == 'out':
            if pt.base == 'iauASTROM':
                args.append('%s?: %s' % (nm, dts_type(pt)))
            continue
        args.append('%s: %s' % (nm, dts_type(pt)))
    rk = sig.result_kind()
    if rk == 'object':
        fields = ['%s: %s' % (p[0], dts_type(p[1])) for p in sig.outs]
        if sig.ret.base != 'void':
            fields.append('%s: number' % sig.status_key())
        ret = '{ %s }' % '; '.join(fields)
    elif rk == 'direct-out':
        ret = dts_type(sig.outs[0][1])
    elif rk == 'value':
        ret = dts_type(sig.ret)
    elif rk == 'inout':
        ret = dts_type(sig.inouts[0][1])
    else:
        ret = 'void'
    return 'export function %s(%s): %s;' % (sig.name, ', '.join(args), ret)


def write_support(tr, out):
    def w(name, text):
        with open(os.path.join(out, name), 'w', newline='\n') as fh:
            fh.write(text)
    w('constants.js', CONSTANTS)
    w('util.js', UTIL)
    w('types.js', TYPES)
    names = sorted(s.name for s in tr.sigs.values())
    idx = ['// astroframe: JavaScript translation of the IAU SOFA library (release 2023-10-11).',
           "export * from './constants.js';",
           "export { newAstrom, newLdbody } from './types.js';"]
    idx += ["export { %s } from './%s.js';" % (n, n) for n in names]
    w('index.js', '\n'.join(idx) + '\n')
    d = ['// Type declarations for astroframe.', '',
         'export interface Astrom {',
         '  pmt: number; eb: number[]; eh: number[]; em: number; v: number[]; bm1: number;',
         '  bpn: number[][]; along: number; phi: number; xpl: number; ypl: number;',
         '  sphi: number; cphi: number; diurab: number; eral: number; refa: number; refb: number;',
         '}',
         'export interface LdBody { bm: number; dl: number; pv: number[][]; }',
         'export function newAstrom(): Astrom;',
         'export function newLdbody(): LdBody;', '']
    for line in CONSTANTS.split('\n'):
        mm = re.match(r'export const (\w+) =', line)
        if mm:
            d.append('export const %s: number;' % mm.group(1))
    d.append('')
    d += [dts_for(tr.sigs[c]) for c in sorted(tr.sigs, key=lambda c: tr.sigs[c].name)]
    w('index.d.ts', '\n'.join(d) + '\n')
