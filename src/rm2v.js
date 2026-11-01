// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rm2v.c.
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
 * JS usage:  const w = rm2v(r)
 *
 * Express an r-matrix as an r-vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    r        double[3][3]    rotation matrix
 *
 * Returned:
 *    w        double[3]       rotation vector (Note 1)
 *
 * Notes:
 *
 * 1) A rotation matrix describes a rotation through some angle about
 *    some arbitrary axis called the Euler axis.  The "rotation vector"
 *    returned by this function has the same direction as the Euler axis,
 *    and its magnitude is the angle in radians.  (The magnitude and
 *    direction can be separated by means of the function pn.)
 *
 * 2) If r is null, so is the result.  If r is not a rotation matrix
 *    the result is undefined;  r must be proper (i.e. have a positive
 *    determinant) and real orthogonal (inverse = transpose).
 *
 * 3) The reference frame rotates clockwise as seen looking along
 *    the rotation vector from the origin.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rm2v(r) {
  let w = [0, 0, 0];
  let x;
  let y;
  let z;
  let s2;
  let c2;
  let phi;
  let f;
  x = r[1][2] - r[2][1];
  y = r[2][0] - r[0][2];
  z = r[0][1] - r[1][0];
  s2 = Math.sqrt(x * x + y * y + z * z);
  if (s2 > 0) {
    c2 = r[0][0] + r[1][1] + r[2][2] - 1.0;
    phi = Math.atan2(s2, c2);
    f = phi / s2;
    w[0] = x * f;
    w[1] = y * f;
    w[2] = z * f;
  } else {
    w[0] = 0.0;
    w[1] = 0.0;
    w[2] = 0.0;
  }
  return w;
}
