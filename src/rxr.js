// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rxr.c.
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

/**
 * JS usage:  const atb = rxr(a, b)
 *
 * Multiply two r-matrices.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a        double[3][3]    first r-matrix
 *    b        double[3][3]    second r-matrix
 *
 * Returned:
 *    atb      double[3][3]    a * b
 *
 * Note:
 *    It is permissible to re-use the same array for any of the
 *    arguments.
 *
 * Called:
 *    cr        copy r-matrix
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rxr(a, b) {
  let atb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let i;
  let j;
  let k;
  let w;
  let wm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      w = 0.0;
      for (k = 0; k < 3; k++) {
        w += a[i][k] * b[k][j];
      }
      wm[i][j] = w;
    }
  }
  atb = cr(wm);
  return atb;
}
