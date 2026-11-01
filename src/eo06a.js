// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file eo06a.c.
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
import { eors } from './eors.js';
import { pnm06a } from './pnm06a.js';
import { s06 } from './s06.js';

/**
 * JS usage:  const result = eo06a(date1, date2)
 *
 * Equation of the origins, IAU 2006 precession and IAU 2000A nutation.
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
 *                 double    the equation of the origins in radians
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
 * 2) The equation of the origins is the distance between the true
 *    equinox and the celestial intermediate origin and, equivalently,
 *    the difference between Earth rotation angle and Greenwich
 *    apparent sidereal time (ERA-GST).  It comprises the precession
 *    (since J2000.0) in right ascension plus the equation of the
 *    equinoxes (including the small correction terms).
 *
 * Called:
 *    pnm06a    classical NPB matrix, IAU 2006/2000A
 *    bpn2xy    extract CIP X,Y coordinates from NPB matrix
 *    s06       the CIO locator s, given X,Y, IAU 2006
 *    eors      equation of the origins, given NPB matrix and s
 *
 * References:
 *
 *    Capitaine, N. & Wallace, P.T., 2006, Astron.Astrophys. 450, 855
 *
 *    Wallace, P.T. & Capitaine, N., 2006, Astron.Astrophys. 459, 981
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function eo06a(date1, date2) {
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let x;
  let y;
  let s;
  let eo;
  r = pnm06a(date1, date2);
  const _r1 = bpn2xy(r);
  x = _r1.x;
  y = _r1.y;
  s = s06(date1, date2, x, y);
  eo = eors(r, s);
  return eo;
}
