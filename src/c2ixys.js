// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file c2ixys.c.
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

import { ir } from './ir.js';
import { ry } from './ry.js';
import { rz } from './rz.js';

/**
 * JS usage:  const rc2i = c2ixys(x, y, s)
 *
 * Form the celestial to intermediate-frame-of-date matrix given the CIP
 * X,Y and the CIO locator s.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    x,y      double         Celestial Intermediate Pole (Note 1)
 *    s        double         the CIO locator s (Note 2)
 *
 * Returned:
 *    rc2i     double[3][3]   celestial-to-intermediate matrix (Note 3)
 *
 * Notes:
 *
 * 1) The Celestial Intermediate Pole coordinates are the x,y
 *    components of the unit vector in the Geocentric Celestial
 *    Reference System.
 *
 * 2) The CIO locator s (in radians) positions the Celestial
 *    Intermediate Origin on the equator of the CIP.
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
 * Called:
 *    ir        initialize r-matrix to identity
 *    rz        rotate around Z-axis
 *    ry        rotate around Y-axis
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
export function c2ixys(x, y, s) {
  let rc2i = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let r2;
  let e;
  let d;
  r2 = x * x + y * y;
  e = r2 > 0.0 ? Math.atan2(y, x) : 0.0;
  d = Math.atan(Math.sqrt(r2 / (1.0 - r2)));
  rc2i = ir();
  rz(e, rc2i);
  ry(d, rc2i);
  rz(-(e + s), rc2i);
  return rc2i;
}
