// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file c2s.c.
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
 * JS usage:  const { theta, phi } = c2s(p)
 *
 * P-vector to spherical coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    p      double[3]    p-vector
 *
 * Returned:
 *    theta  double       longitude angle (radians)
 *    phi    double       latitude angle (radians)
 *
 * Notes:
 *
 * 1) The vector p can have any magnitude; only its direction is used.
 *
 * 2) If p is null, zero theta and phi are returned.
 *
 * 3) At either pole, zero theta is returned.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function c2s(p) {
  let theta = 0;
  let phi = 0;
  let x;
  let y;
  let z;
  let d2;
  x = p[0];
  y = p[1];
  z = p[2];
  d2 = x * x + y * y;
  theta = d2 == 0.0 ? 0.0 : Math.atan2(y, x);
  phi = z == 0.0 ? 0.0 : Math.atan2(z, Math.sqrt(d2));
  return { theta, phi };
}
