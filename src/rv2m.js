// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file rv2m.c.
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
 * JS usage:  const r = rv2m(w)
 *
 * Form the r-matrix corresponding to a given r-vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    w        double[3]      rotation vector (Note 1)
 *
 * Returned:
 *    r        double[3][3]    rotation matrix
 *
 * Notes:
 *
 * 1) A rotation matrix describes a rotation through some angle about
 *    some arbitrary axis called the Euler axis.  The "rotation vector"
 *    supplied to This function has the same direction as the Euler
 *    axis, and its magnitude is the angle in radians.
 *
 * 2) If w is null, the identity matrix is returned.
 *
 * 3) The reference frame rotates clockwise as seen looking along the
 *    rotation vector from the origin.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function rv2m(w) {
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let x;
  let y;
  let z;
  let phi;
  let s;
  let c;
  let f;
  x = w[0];
  y = w[1];
  z = w[2];
  phi = Math.sqrt(x * x + y * y + z * z);
  s = Math.sin(phi);
  c = Math.cos(phi);
  f = 1.0 - c;
  if (phi > 0.0) {
    x /= phi;
    y /= phi;
    z /= phi;
  }
  r[0][0] = x * x * f + c;
  r[0][1] = x * y * f + z * s;
  r[0][2] = x * z * f - y * s;
  r[1][0] = y * x * f - z * s;
  r[1][1] = y * y * f + c;
  r[1][2] = y * z * f + x * s;
  r[2][0] = z * x * f + y * s;
  r[2][1] = z * y * f - x * s;
  r[2][2] = z * z * f + c;
  return r;
}
