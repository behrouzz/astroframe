// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file s2p.c.
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

import { s2c } from './s2c.js';
import { sxp } from './sxp.js';

/**
 * JS usage:  const p = s2p(theta, phi, r)
 *
 * Convert spherical polar coordinates to p-vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    theta   double       longitude angle (radians)
 *    phi     double       latitude angle (radians)
 *    r       double       radial distance
 *
 * Returned:
 *    p       double[3]    Cartesian coordinates
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    sxp       multiply p-vector by scalar
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function s2p(theta, phi, r) {
  let p = [0, 0, 0];
  let u = [0, 0, 0];
  u = s2c(theta, phi);
  p = sxp(r, u);
  return p;
}
