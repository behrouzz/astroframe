// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file era00.c.
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

import { D2PI, DJ00 } from './constants.js';
import { anp } from './anp.js';

/**
 * JS usage:  const result = era00(dj1, dj2)
 *
 * Earth rotation angle (IAU 2000 model).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    dj1,dj2   double    UT1 as a 2-part Julian Date (see note)
 *
 * Returned (function value):
 *              double    Earth rotation angle (radians), range 0-2pi
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
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable.  The J2000 and MJD methods are good compromises
 *    between resolution and convenience.  The date & time method is
 *    best matched to the algorithm used:  maximum precision is
 *    delivered when the dj1 argument is for 0hrs UT1 on the day in
 *    question and the dj2 argument lies in the range 0 to 1, or vice
 *    versa.
 *
 * 2) The algorithm is adapted from Expression 22 of Capitaine et al.
 *    2000.  The time argument has been expressed in days directly,
 *    and, to retain precision, integer contributions have been
 *    eliminated.  The same formulation is given in IERS Conventions
 *    (2003), Chap. 5, Eq. 14.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *
 * References:
 *
 *    Capitaine N., Guinot B. and McCarthy D.D, 2000, Astron.
 *    Astrophys., 355, 398-405.
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function era00(dj1, dj2) {
  let d1;
  let d2;
  let t;
  let f;
  let theta;
  if (dj1 < dj2) {
    d1 = dj1;
    d2 = dj2;
  } else {
    d1 = dj2;
    d2 = dj1;
  }
  t = d1 + (d2 - DJ00);
  f = d1 % 1.0 + d2 % 1.0;
  theta = anp(D2PI * (f + 0.7790572732640 + 0.00273781191135448 * t));
  return theta;
}
