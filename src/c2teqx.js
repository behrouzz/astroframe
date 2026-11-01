// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file c2teqx.c.
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

import { cr } from './cr.js';
import { rxr } from './rxr.js';
import { rz } from './rz.js';

/**
 * JS usage:  const rc2t = c2teqx(rbpn, gst, rpom)
 *
 * Assemble the celestial to terrestrial matrix from equinox-based
 * components (the celestial-to-true matrix, the Greenwich Apparent
 * Sidereal Time and the polar motion matrix).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rbpn   double[3][3]  celestial-to-true matrix
 *    gst    double        Greenwich (apparent) Sidereal Time (radians)
 *    rpom   double[3][3]  polar-motion matrix
 *
 * Returned:
 *    rc2t   double[3][3]  celestial-to-terrestrial matrix (Note 2)
 *
 * Notes:
 *
 * 1) This function constructs the rotation matrix that transforms
 *    vectors in the celestial system into vectors in the terrestrial
 *    system.  It does so starting from precomputed components, namely
 *    the matrix which rotates from celestial coordinates to the
 *    true equator and equinox of date, the Greenwich Apparent Sidereal
 *    Time and the polar motion matrix.  One use of the present function
 *    is when generating a series of celestial-to-terrestrial matrices
 *    where only the Sidereal Time changes, avoiding the considerable
 *    overhead of recomputing the precession-nutation more often than
 *    necessary to achieve given accuracy objectives.
 *
 * 2) The relationship between the arguments is as follows:
 *
 *       [TRS] = rpom * R_3(gst) * rbpn * [CRS]
 *
 *             = rc2t * [CRS]
 *
 *    where [CRS] is a vector in the Geocentric Celestial Reference
 *    System and [TRS] is a vector in the International Terrestrial
 *    Reference System (see IERS Conventions 2003).
 *
 * Called:
 *    cr        copy r-matrix
 *    rz        rotate around Z-axis
 *    rxr       product of two r-matrices
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
export function c2teqx(rbpn, gst, rpom) {
  let rc2t = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  r = cr(rbpn);
  rz(gst, r);
  rc2t = rxr(rpom, r);
  return rc2t;
}
