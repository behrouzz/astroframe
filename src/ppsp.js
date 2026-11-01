// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ppsp.c.
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

import { ppp } from './ppp.js';
import { sxp } from './sxp.js';

/**
 * JS usage:  const apsb = ppsp(a, s, b)
 *
 * P-vector plus scaled p-vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a      double[3]     first p-vector
 *    s      double        scalar (multiplier for b)
 *    b      double[3]     second p-vector
 *
 * Returned:
 *    apsb   double[3]     a + s*b
 *
 * Note:
 *    It is permissible for any of a, b and apsb to be the same array.
 *
 * Called:
 *    sxp       multiply p-vector by scalar
 *    ppp       p-vector plus p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ppsp(a, s, b) {
  let apsb = [0, 0, 0];
  let sb = [0, 0, 0];
  sb = sxp(s, b);
  apsb = ppp(a, sb);
  return apsb;
}
