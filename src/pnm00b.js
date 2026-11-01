// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pnm00b.c.
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

import { pn00b } from './pn00b.js';

/**
 * JS usage:  const rbpn = pnm00b(date1, date2)
 *
 * Form the matrix of precession-nutation for a given date (including
 * frame bias), equinox-based, IAU 2000B model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2 double       TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    rbpn        double[3][3] bias-precession-nutation matrix (Note 2)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways, among
 *    others:
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
 * 2) The matrix operates in the sense V(date) = rbpn * V(GCRS), where
 *    the p-vector V(date) is with respect to the true equatorial triad
 *    of date date1+date2 and the p-vector V(GCRS) is with respect to
 *    the Geocentric Celestial Reference System (IAU, 2000).
 *
 * 3) The present function is faster, but slightly less accurate (about
 *    1 mas), than the pnm00a function.
 *
 * Called:
 *    pn00b     bias/precession/nutation, IAU 2000B
 *
 * Reference:
 *
 *    IAU: Trans. International Astronomical Union, Vol. XXIVB;  Proc.
 *    24th General Assembly, Manchester, UK.  Resolutions B1.3, B1.6.
 *    (2000)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pnm00b(date1, date2) {
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let dpsi;
  let deps;
  let epsa;
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const _r1 = pn00b(date1, date2);
  dpsi = _r1.dpsi;
  deps = _r1.deps;
  epsa = _r1.epsa;
  rb = _r1.rb;
  rp = _r1.rp;
  rbp = _r1.rbp;
  rn = _r1.rn;
  rbpn = _r1.rbpn;
  return rbpn;
}
