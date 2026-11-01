// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file s2c.c.
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
 * JS usage:  const c = s2c(theta, phi)
 *
 * Convert spherical coordinates to Cartesian.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    theta    double       longitude angle (radians)
 *    phi      double       latitude angle (radians)
 *
 * Returned:
 *    c        double[3]    direction cosines
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function s2c(theta, phi) {
  let c = [0, 0, 0];
  let cp;
  cp = Math.cos(phi);
  c[0] = Math.cos(theta) * cp;
  c[1] = Math.sin(theta) * cp;
  c[2] = Math.sin(phi);
  return c;
}
