// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rz.c.
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
 * JS usage:  rz(psi, r)   // updates r in place
 *
 * Rotate an r-matrix about the z-axis.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    psi    double          angle (radians)
 *
 * Given and returned:
 *    r      double[3][3]    r-matrix, rotated
 *
 * Notes:
 *
 * 1) Calling this function with positive psi incorporates in the
 *    supplied r-matrix r an additional rotation, about the z-axis,
 *    anticlockwise as seen looking towards the origin from positive z.
 *
 * 2) The additional rotation can be represented by this matrix:
 *
 *        (  + cos(psi)   + sin(psi)     0  )
 *        (                                 )
 *        (  - sin(psi)   + cos(psi)     0  )
 *        (                                 )
 *        (       0            0         1  )
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rz(psi, r) {
  let s;
  let c;
  let a00;
  let a01;
  let a02;
  let a10;
  let a11;
  let a12;
  s = Math.sin(psi);
  c = Math.cos(psi);
  a00 = c * r[0][0] + s * r[1][0];
  a01 = c * r[0][1] + s * r[1][1];
  a02 = c * r[0][2] + s * r[1][2];
  a10 = -s * r[0][0] + c * r[1][0];
  a11 = -s * r[0][1] + c * r[1][1];
  a12 = -s * r[0][2] + c * r[1][2];
  r[0][0] = a00;
  r[0][1] = a01;
  r[0][2] = a02;
  r[1][0] = a10;
  r[1][1] = a11;
  r[1][2] = a12;
  return r;
}
