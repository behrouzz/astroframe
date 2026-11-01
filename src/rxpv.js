// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rxpv.c.
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

/**
 * JS usage:  const rpv = rxpv(r, pv)
 *
 * Multiply a pv-vector by an r-matrix.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    r        double[3][3]    r-matrix
 *    pv       double[2][3]    pv-vector
 *
 * Returned:
 *    rpv      double[2][3]    r * pv
 *
 * Notes:
 *
 * 1) The algorithm is for the simple case where the r-matrix r is not
 *    a function of time.  The case where r is a function of time leads
 *    to an additional velocity component equal to the product of the
 *    derivative of r and the position vector.
 *
 * 2) It is permissible for pv and rpv to be the same array.
 *
 * Called:
 *    rxp       product of r-matrix and p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rxpv(r, pv) {
  let rpv = [[0, 0, 0], [0, 0, 0]];
  rpv[0] = rxp(r, pv[0]);
  rpv[1] = rxp(r, pv[1]);
  return rpv;
}
