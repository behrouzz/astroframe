// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ppp.c.
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


/**
 * JS usage:  const apb = ppp(a, b)
 *
 * P-vector addition.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a        double[3]      first p-vector
 *    b        double[3]      second p-vector
 *
 * Returned:
 *    apb      double[3]      a + b
 *
 * Note:
 *    It is permissible to re-use the same array for any of the
 *    arguments.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ppp(a, b) {
  let apb = [0, 0, 0];
  apb[0] = a[0] + b[0];
  apb[1] = a[1] + b[1];
  apb[2] = a[2] + b[2];
  return apb;
}
