// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ry.c.
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
 * JS usage:  ry(theta, r)   // updates r in place
 *
 * Rotate an r-matrix about the y-axis.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    theta  double          angle (radians)
 *
 * Given and returned:
 *    r      double[3][3]    r-matrix, rotated
 *
 * Notes:
 *
 * 1) Calling this function with positive theta incorporates in the
 *    supplied r-matrix r an additional rotation, about the y-axis,
 *    anticlockwise as seen looking towards the origin from positive y.
 *
 * 2) The additional rotation can be represented by this matrix:
 *
 *        (  + cos(theta)     0      - sin(theta)  )
 *        (                                        )
 *        (       0           1           0        )
 *        (                                        )
 *        (  + sin(theta)     0      + cos(theta)  )
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ry(theta, r) {
  let s;
  let c;
  let a00;
  let a01;
  let a02;
  let a20;
  let a21;
  let a22;
  s = Math.sin(theta);
  c = Math.cos(theta);
  a00 = c * r[0][0] - s * r[2][0];
  a01 = c * r[0][1] - s * r[2][1];
  a02 = c * r[0][2] - s * r[2][2];
  a20 = s * r[0][0] + c * r[2][0];
  a21 = s * r[0][1] + c * r[2][1];
  a22 = s * r[0][2] + c * r[2][2];
  r[0][0] = a00;
  r[0][1] = a01;
  r[0][2] = a02;
  r[2][0] = a20;
  r[2][1] = a21;
  r[2][2] = a22;
  return r;
}
