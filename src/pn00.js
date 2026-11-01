// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pn00.c.
// Mechanically translated to JavaScript by tools/c2js.py.
//
// This code uses routines and computations derived by the astroframe authors from software
// provided by SOFA under license, and does not itself constitute software provided by and/or
// endorsed by SOFA.  Differences from the original SOFA C code:
//   - the "iau" prefix is removed from routine names (SOFA license, clause 3c);
//   - output arguments passed by pointer in C are returned from the JavaScript function;
//   - C arrays and structures are JavaScript arrays and objects;
//   - C int/long arithmetic is emulated (integer division truncates);
//   - the numerical algorithms and constants are unchanged.
// See README.md.  License: SOFA Software License, PART 1 of LICENSE-SOFA.txt.

import { bp00 } from './bp00.js';
import { cr } from './cr.js';
import { numat } from './numat.js';
import { obl80 } from './obl80.js';
import { pr00 } from './pr00.js';
import { rxr } from './rxr.js';

/**
 * JS usage:  const { epsa, rb, rp, rbp, rn, rbpn } = pn00(date1, date2, dpsi, deps)
 *
 * Precession-nutation, IAU 2000 model:  a multi-purpose function,
 * supporting classical (equinox-based) use directly and CIO-based
 * use indirectly.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double          TT as a 2-part Julian Date (Note 1)
 *    dpsi,deps    double          nutation (Note 2)
 *
 * Returned:
 *    epsa         double          mean obliquity (Note 3)
 *    rb           double[3][3]    frame bias matrix (Note 4)
 *    rp           double[3][3]    precession matrix (Note 5)
 *    rbp          double[3][3]    bias-precession matrix (Note 6)
 *    rn           double[3][3]    nutation matrix (Note 7)
 *    rbpn         double[3][3]    GCRS-to-true matrix (Note 8)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways,
 *    among others:
 *
 *           date1          date2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable.  The J2000 method is best matched to the way
 *    the argument is handled internally and will deliver the
 *    optimum resolution.  The MJD method and the date & time methods
 *    are both good compromises between resolution and convenience.
 *
 * 2) The caller is responsible for providing the nutation components;
 *    they are in longitude and obliquity, in radians and are with
 *    respect to the equinox and ecliptic of date.  For high-accuracy
 *    applications, free core nutation should be included as well as
 *    any other relevant corrections to the position of the CIP.
 *
 * 3) The returned mean obliquity is consistent with the IAU 2000
 *    precession-nutation models.
 *
 * 4) The matrix rb transforms vectors from GCRS to J2000.0 mean
 *    equator and equinox by applying frame bias.
 *
 * 5) The matrix rp transforms vectors from J2000.0 mean equator and
 *    equinox to mean equator and equinox of date by applying
 *    precession.
 *
 * 6) The matrix rbp transforms vectors from GCRS to mean equator and
 *    equinox of date by applying frame bias then precession.  It is
 *    the product rp x rb.
 *
 * 7) The matrix rn transforms vectors from mean equator and equinox of
 *    date to true equator and equinox of date by applying the nutation
 *    (luni-solar + planetary).
 *
 * 8) The matrix rbpn transforms vectors from GCRS to true equator and
 *    equinox of date.  It is the product rn x rbp, applying frame
 *    bias, precession and nutation in that order.
 *
 * 9) It is permissible to re-use the same array in the returned
 *    arguments.  The arrays are filled in the order given.
 *
 * Called:
 *    pr00      IAU 2000 precession adjustments
 *    obl80     mean obliquity, IAU 1980
 *    bp00      frame bias and precession matrices, IAU 2000
 *    cr        copy r-matrix
 *    numat     form nutation matrix
 *    rxr       product of two r-matrices
 *
 * Reference:
 *
 *    Capitaine, N., Chapront, J., Lambert, S. and Wallace, P.,
 *    "Expressions for the Celestial Intermediate Pole and Celestial
 *    Ephemeris Origin consistent with the IAU 2000A precession-
 *    nutation model", Astron.Astrophys. 400, 1145-1154 (2003)
 *
 *    n.b. The celestial ephemeris origin (CEO) was renamed "celestial
 *         intermediate origin" (CIO) by IAU 2006 Resolution 2.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pn00(date1, date2, dpsi, deps) {
  let epsa = 0;
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let dpsipr;
  let depspr;
  let rbpw = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rnw = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const _r1 = pr00(date1, date2);
  dpsipr = _r1.dpsipr;
  depspr = _r1.depspr;
  epsa = obl80(date1, date2) + depspr;
  const _r2 = bp00(date1, date2);
  rb = _r2.rb;
  rp = _r2.rp;
  rbpw = _r2.rbp;
  rbp = cr(rbpw);
  rnw = numat(epsa, dpsi, deps);
  rn = cr(rnw);
  rbpn = rxr(rnw, rbpw);
  return { epsa, rb, rp, rbp, rn, rbpn };
}
