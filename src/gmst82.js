// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gmst82.c.
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

import { DAYSEC, DJ00, DJC, DS2R } from './constants.js';
import { anp } from './anp.js';

/**
 * JS usage:  const result = gmst82(dj1, dj2)
 *
 * Universal Time to Greenwich mean sidereal time (IAU 1982 model).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    dj1,dj2    double    UT1 Julian Date (see note)
 *
 * Returned (function value):
 *               double    Greenwich mean sidereal time (radians)
 *
 * Notes:
 *
 * 1) The UT1 date dj1+dj2 is a Julian Date, apportioned in any
 *    convenient way between the arguments dj1 and dj2.  For example,
 *    JD(UT1)=2450123.7 could be expressed in any of these ways,
 *    among others:
 *
 *            dj1            dj2
 *
 *        2450123.7          0          (JD method)
 *         2451545        -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5         0.2         (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable.  The J2000 and MJD methods are good compromises
 *    between resolution and convenience.  The date & time method is
 *    best matched to the algorithm used:  maximum accuracy (or, at
 *    least, minimum noise) is delivered when the dj1 argument is for
 *    0hrs UT1 on the day in question and the dj2 argument lies in the
 *    range 0 to 1, or vice versa.
 *
 * 2) The algorithm is based on the IAU 1982 expression.  This is
 *    always described as giving the GMST at 0 hours UT1.  In fact, it
 *    gives the difference between the GMST and the UT, the steady
 *    4-minutes-per-day drawing-ahead of ST with respect to UT.  When
 *    whole days are ignored, the expression happens to equal the GMST
 *    at 0 hours UT1 each day.
 *
 * 3) In this function, the entire UT1 (the sum of the two arguments
 *    dj1 and dj2) is used directly as the argument for the standard
 *    formula, the constant term of which is adjusted by 12 hours to
 *    take account of the noon phasing of Julian Date.  The UT1 is then
 *    added, but omitting whole days to conserve accuracy.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *
 * References:
 *
 *    Transactions of the International Astronomical Union,
 *    XVIII B, 67 (1983).
 *
 *    Aoki et al., Astron.Astrophys., 105, 359-361 (1982).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function gmst82(dj1, dj2) {
  let A = 24110.54841 - DAYSEC / 2.0;
  let B = 8640184.812866;
  let C = 0.093104;
  let D = -6.2e-6;
  let d1;
  let d2;
  let t;
  let f;
  let gmst;
  if (dj1 < dj2) {
    d1 = dj1;
    d2 = dj2;
  } else {
    d1 = dj2;
    d2 = dj1;
  }
  t = (d1 + (d2 - DJ00)) / DJC;
  f = DAYSEC * (d1 % 1.0 + d2 % 1.0);
  gmst = anp(DS2R * (A + (B + (C + D * t) * t) * t + f));
  return gmst;
}
