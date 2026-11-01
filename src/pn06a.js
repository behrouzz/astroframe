// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pn06a.c.
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

import { nut06a } from './nut06a.js';
import { pn06 } from './pn06.js';

/**
 * JS usage:  const { dpsi, deps, epsa, rb, rp, rbp, rn, rbpn } = pn06a(date1, date2)
 *
 * Precession-nutation, IAU 2006/2000A models:  a multi-purpose function,
 * supporting classical (equinox-based) use directly and CIO-based use
 * indirectly.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double          TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    dpsi,deps    double          nutation (Note 2)
 *    epsa         double          mean obliquity (Note 3)
 *    rb           double[3][3]    frame bias matrix (Note 4)
 *    rp           double[3][3]    precession matrix (Note 5)
 *    rbp          double[3][3]    bias-precession matrix (Note 6)
 *    rn           double[3][3]    nutation matrix (Note 7)
 *    rbpn         double[3][3]    GCRS-to-true matrix (Notes 8,9)
 *
 * Notes:
 *
 * 1)  The TT date date1+date2 is a Julian Date, apportioned in any
 *     convenient way between the two arguments.  For example,
 *     JD(TT)=2450123.7 could be expressed in any of these ways,
 *     among others:
 *
 *            date1          date2
 *
 *         2450123.7           0.0       (JD method)
 *         2451545.0       -1421.3       (J2000 method)
 *         2400000.5       50123.2       (MJD method)
 *         2450123.5           0.2       (date & time method)
 *
 *     The JD method is the most natural and convenient to use in
 *     cases where the loss of several decimal digits of resolution
 *     is acceptable.  The J2000 method is best matched to the way
 *     the argument is handled internally and will deliver the
 *     optimum resolution.  The MJD method and the date & time methods
 *     are both good compromises between resolution and convenience.
 *
 * 2)  The nutation components (luni-solar + planetary, IAU 2000A) in
 *     longitude and obliquity are in radians and with respect to the
 *     equinox and ecliptic of date.  Free core nutation is omitted;
 *     for the utmost accuracy, use the pn06 function, where the
 *     nutation components are caller-specified.
 *
 * 3)  The mean obliquity is consistent with the IAU 2006 precession.
 *
 * 4)  The matrix rb transforms vectors from GCRS to mean J2000.0 by
 *     applying frame bias.
 *
 * 5)  The matrix rp transforms vectors from mean J2000.0 to mean of
 *     date by applying precession.
 *
 * 6)  The matrix rbp transforms vectors from GCRS to mean of date by
 *     applying frame bias then precession.  It is the product rp x rb.
 *
 * 7)  The matrix rn transforms vectors from mean of date to true of
 *     date by applying the nutation (luni-solar + planetary).
 *
 * 8)  The matrix rbpn transforms vectors from GCRS to true of date
 *     (CIP/equinox).  It is the product rn x rbp, applying frame bias,
 *     precession and nutation in that order.
 *
 * 9)  The X,Y,Z coordinates of the IAU 2006/2000A Celestial
 *     Intermediate Pole are elements (3,1-3) of the GCRS-to-true
 *     matrix, i.e. rbpn[2][0-2].
 *
 * 10) It is permissible to re-use the same array in the returned
 *     arguments.  The arrays are filled in the stated order.
 *
 * Called:
 *    nut06a    nutation, IAU 2006/2000A
 *    pn06      bias/precession/nutation results, IAU 2006
 *
 * Reference:
 *
 *    Capitaine, N. & Wallace, P.T., 2006, Astron.Astrophys. 450, 855
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pn06a(date1, date2) {
  let dpsi = 0;
  let deps = 0;
  let epsa = 0;
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const _r1 = nut06a(date1, date2);
  dpsi = _r1.dpsi;
  deps = _r1.deps;
  const _r2 = pn06(date1, date2, dpsi, deps);
  epsa = _r2.epsa;
  rb = _r2.rb;
  rp = _r2.rp;
  rbp = _r2.rbp;
  rn = _r2.rn;
  rbpn = _r2.rbpn;
  return { dpsi, deps, epsa, rb, rp, rbp, rn, rbpn };
}
