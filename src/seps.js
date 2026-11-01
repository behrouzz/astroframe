// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file seps.c.
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
import { sepp } from './sepp.js';

/**
 * JS usage:  const result = seps(al, ap, bl, bp)
 *
 * Angular separation between two sets of spherical coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    al     double       first longitude (radians)
 *    ap     double       first latitude (radians)
 *    bl     double       second longitude (radians)
 *    bp     double       second latitude (radians)
 *
 * Returned (function value):
 *           double       angular separation (radians)
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    sepp      angular separation between two p-vectors
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function seps(al, ap, bl, bp) {
  let ac = [0, 0, 0];
  let bc = [0, 0, 0];
  let s;
  ac = s2c(al, ap);
  bc = s2c(bl, bp);
  s = sepp(ac, bc);
  return s;
}
