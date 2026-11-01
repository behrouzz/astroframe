// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file c2ibpn.c.
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
import { c2ixy } from './c2ixy.js';

/**
 * JS usage:  const rc2i = c2ibpn(date1, date2, rbpn)
 *
 * Form the celestial-to-intermediate matrix for a given date given
 * the bias-precession-nutation matrix.  IAU 2000.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2 double       TT as a 2-part Julian Date (Note 1)
 *    rbpn        double[3][3] celestial-to-true matrix (Note 2)
 *
 * Returned:
 *    rc2i        double[3][3] celestial-to-intermediate matrix (Note 3)
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
 * 2) The matrix rbpn transforms vectors from GCRS to true equator (and
 *    CIO or equinox) of date.  Only the CIP (bottom row) is used.
 *
 * 3) The matrix rc2i is the first stage in the transformation from
 *    celestial to terrestrial coordinates:
 *
 *       [TRS] = RPOM * R_3(ERA) * rc2i * [CRS]
 *
 *             = RC2T * [CRS]
 *
 *    where [CRS] is a vector in the Geocentric Celestial Reference
 *    System and [TRS] is a vector in the International Terrestrial
 *    Reference System (see IERS Conventions 2003), ERA is the Earth
 *    Rotation Angle and RPOM is the polar motion matrix.
 *
 * 4) Although its name does not include "00", This function is in fact
 *    specific to the IAU 2000 models.
 *
 * Called:
 *    bpn2xy    extract CIP X,Y coordinates from NPB matrix
 *    c2ixy     celestial-to-intermediate matrix, given X,Y
 *
 * References:
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
export function c2ibpn(date1, date2, rbpn) {
  let rc2i = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let x;
  let y;
  const _r1 = bpn2xy(rbpn);
  x = _r1.x;
  y = _r1.y;
  rc2i = c2ixy(date1, date2, x, y);
  return rc2i;
}
