// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file xys00a.c.
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
import { pnm00a } from './pnm00a.js';
import { s00 } from './s00.js';

/**
 * JS usage:  const { x, y, s } = xys00a(date1, date2)
 *
 * For a given TT date, compute the X,Y coordinates of the Celestial
 * Intermediate Pole and the CIO locator s, using the IAU 2000A
 * precession-nutation model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double   TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    x,y          double   Celestial Intermediate Pole (Note 2)
 *    s            double   the CIO locator s (Note 3)
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
 * 2) The Celestial Intermediate Pole coordinates are the x,y
 *    components of the unit vector in the Geocentric Celestial
 *    Reference System.
 *
 * 3) The CIO locator s (in radians) positions the Celestial
 *    Intermediate Origin on the equator of the CIP.
 *
 * 4) A faster, but slightly less accurate result (about 1 mas for
 *    X,Y), can be obtained by using instead the xys00b function.
 *
 * Called:
 *    pnm00a    classical NPB matrix, IAU 2000A
 *    bpn2xy    extract CIP X,Y coordinates from NPB matrix
 *    s00       the CIO locator s, given X,Y, IAU 2000A
 *
 * Reference:
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
export function xys00a(date1, date2) {
  let x = 0;
  let y = 0;
  let s = 0;
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  rbpn = pnm00a(date1, date2);
  const _r1 = bpn2xy(rbpn);
  x = _r1.x;
  y = _r1.y;
  s = s00(date1, date2, x, y);
  return { x, y, s };
}
