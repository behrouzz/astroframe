// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rx.c.
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
 * JS usage:  rx(phi, r)   // updates r in place
 *
 * Rotate an r-matrix about the x-axis.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    phi    double          angle (radians)
 *
 * Given and returned:
 *    r      double[3][3]    r-matrix, rotated
 *
 * Notes:
 *
 * 1) Calling this function with positive phi incorporates in the
 *    supplied r-matrix r an additional rotation, about the x-axis,
 *    anticlockwise as seen looking towards the origin from positive x.
 *
 * 2) The additional rotation can be represented by this matrix:
 *
 *        (  1        0            0      )
 *        (                               )
 *        (  0   + cos(phi)   + sin(phi)  )
 *        (                               )
 *        (  0   - sin(phi)   + cos(phi)  )
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rx(phi, r) {
  let s;
  let c;
  let a10;
  let a11;
  let a12;
  let a20;
  let a21;
  let a22;
  s = Math.sin(phi);
  c = Math.cos(phi);
  a10 = c * r[1][0] + s * r[2][0];
  a11 = c * r[1][1] + s * r[2][1];
  a12 = c * r[1][2] + s * r[2][2];
  a20 = -s * r[1][0] + c * r[2][0];
  a21 = -s * r[1][1] + c * r[2][1];
  a22 = -s * r[1][2] + c * r[2][2];
  r[1][0] = a10;
  r[1][1] = a11;
  r[1][2] = a12;
  r[2][0] = a20;
  r[2][1] = a21;
  r[2][2] = a22;
  return r;
}
