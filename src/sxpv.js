// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sxpv.c.
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

import { s2xpv } from './s2xpv.js';

/**
 * JS usage:  const spv = sxpv(s, pv)
 *
 * Multiply a pv-vector by a scalar.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    s       double          scalar
 *    pv      double[2][3]    pv-vector
 *
 * Returned:
 *    spv     double[2][3]    s * pv
 *
 * Note:
 *    It is permissible for pv and spv to be the same array.
 *
 * Called:
 *    s2xpv     multiply pv-vector by two scalars
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function sxpv(s, pv) {
  let spv = [[0, 0, 0], [0, 0, 0]];
  spv = s2xpv(s, s, pv);
  return spv;
}
