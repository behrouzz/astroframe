// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pvtob.c.
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

import { D2PI, DAYSEC } from './constants.js';
import { gd2gc } from './gd2gc.js';
import { pom00 } from './pom00.js';
import { trxp } from './trxp.js';

/**
 * JS usage:  const pv = pvtob(elong, phi, hm, xp, yp, sp, theta)
 *
 * Position and velocity of a terrestrial observing station.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    elong   double       longitude (radians, east +ve, Note 1)
 *    phi     double       latitude (geodetic, radians, Note 1)
 *    hm      double       height above ref. ellipsoid (geodetic, m)
 *    xp,yp   double       coordinates of the pole (radians, Note 2)
 *    sp      double       the TIO locator s' (radians, Note 2)
 *    theta   double       Earth rotation angle (radians, Note 3)
 *
 * Returned:
 *    pv      double[2][3] position/velocity vector (m, m/s, CIRS)
 *
 * Notes:
 *
 * 1) The terrestrial coordinates are with respect to the WGS84
 *    reference ellipsoid.
 *
 * 2) xp and yp are the coordinates (in radians) of the Celestial
 *    Intermediate Pole with respect to the International Terrestrial
 *    Reference System (see IERS Conventions), measured along the
 *    meridians 0 and 90 deg west respectively.  sp is the TIO locator
 *    s', in radians, which positions the Terrestrial Intermediate
 *    Origin on the equator.  For many applications, xp, yp and
 *    (especially) sp can be set to zero.
 *
 * 3) If theta is Greenwich apparent sidereal time instead of Earth
 *    rotation angle, the result is with respect to the true equator
 *    and equinox of date, i.e. with the x-axis at the equinox rather
 *    than the celestial intermediate origin.
 *
 * 4) The velocity units are meters per UT1 second, not per SI second.
 *    This is unlikely to have any practical consequences in the modern
 *    era.
 *
 * 5) No validation is performed on the arguments.  Error cases that
 *    could lead to arithmetic exceptions are trapped by the gd2gc
 *    function, and the result set to zeros.
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 *    Urban, S. & Seidelmann, P. K. (eds), Explanatory Supplement to
 *    the Astronomical Almanac, 3rd ed., University Science Books
 *    (2013), Section 7.4.3.3.
 *
 * Called:
 *    gd2gc     geodetic to geocentric transformation
 *    pom00     polar motion matrix
 *    trxp      product of transpose of r-matrix and p-vector
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pvtob(elong, phi, hm, xp, yp, sp, theta) {
  let pv = [[0, 0, 0], [0, 0, 0]];
  const OM = 1.00273781191135448 * D2PI / DAYSEC;
  let xyzm = [0, 0, 0];
  let rpm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let xyz = [0, 0, 0];
  let x;
  let y;
  let z;
  let s;
  let c;
  const _r1 = gd2gc(1, elong, phi, hm);
  xyzm = _r1.xyz;
  _r1.status;
  rpm = pom00(xp, yp, sp);
  xyz = trxp(rpm, xyzm);
  x = xyz[0];
  y = xyz[1];
  z = xyz[2];
  s = Math.sin(theta);
  c = Math.cos(theta);
  pv[0][0] = c * x - s * y;
  pv[0][1] = s * x + c * y;
  pv[0][2] = z;
  pv[1][0] = OM * (-s * x - c * y);
  pv[1][1] = OM * (c * x - s * y);
  pv[1][2] = 0.0;
  return pv;
}
