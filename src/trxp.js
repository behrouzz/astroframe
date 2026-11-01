// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file trxp.c.
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

import { rxp } from './rxp.js';
import { tr } from './tr.js';

/**
 * JS usage:  const trp = trxp(r, p)
 *
 * Multiply a p-vector by the transpose of an r-matrix.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    r        double[3][3]   r-matrix
 *    p        double[3]      p-vector
 *
 * Returned:
 *    trp      double[3]      r^T * p
 *
 * Note:
 *    It is permissible for p and trp to be the same array.
 *
 * Called:
 *    tr        transpose r-matrix
 *    rxp       product of r-matrix and p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function trxp(r, p) {
  let trp = [0, 0, 0];
  let tr_ = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  tr_ = tr(r);
  trp = rxp(tr_, p);
  return trp;
}
