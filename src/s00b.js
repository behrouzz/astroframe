// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file s00b.c.
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

import { bpn2xy } from './bpn2xy.js';
import { pnm00b } from './pnm00b.js';
import { s00 } from './s00.js';

/**
 * JS usage:  const result = s00b(date1, date2)
 *
 * The CIO locator s, positioning the Celestial Intermediate Origin on
 * the equator of the Celestial Intermediate Pole, using the IAU 2000B
 * precession-nutation model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double    TT as a 2-part Julian Date (Note 1)
 *
 * Returned (function value):
 *                 double    the CIO locator s in radians (Note 2)
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
 * 2) The CIO locator s is the difference between the right ascensions
 *    of the same point in two systems.  The two systems are the GCRS
 *    and the CIP,CIO, and the point is the ascending node of the
 *    CIP equator.  The CIO locator s remains a small fraction of
 *    1 arcsecond throughout 1900-2100.
 *
 * 3) The series used to compute s is in fact for s+XY/2, where X and Y
 *    are the x and y components of the CIP unit vector;  this series
 *    is more compact than a direct series for s would be.  The present
 *    function uses the IAU 2000B truncated nutation model when
 *    predicting the CIP position.  The function s00a uses instead
 *    the full IAU 2000A model, but with no significant increase in
 *    accuracy and at some cost in speed.
 *
 * Called:
 *    pnm00b    classical NPB matrix, IAU 2000B
 *    bnp2xy    extract CIP X,Y from the BPN matrix
 *    s00       the CIO locator s, given X,Y, IAU 2000A
 *
 * References:
 *
 *    Capitaine, N., Chapront, J., Lambert, S. and Wallace, P.,
 *    "Expressions for the Celestial Intermediate Pole and Celestial
 *    Ephemeris Origin consistent with the IAU 2000A precession-
 *    nutation model", Astron.Astrophys. 400, 1145-1154 (2003)
 *
 *    n.b. The celestial ephemeris origin (CEO) was renamed "celestial
 *         intermediate origin" (CIO) by IAU 2006 Resolution 2.
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
export function s00b(date1, date2) {
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let x;
  let y;
  let s;
  rbpn = pnm00b(date1, date2);
  const _r1 = bpn2xy(rbpn);
  x = _r1.x;
  y = _r1.y;
  s = s00(date1, date2, x, y);
  return s;
}
