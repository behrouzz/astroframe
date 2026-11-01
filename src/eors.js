// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file eors.c.
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
 * JS usage:  const result = eors(rnpb, s)
 *
 * Equation of the origins, given the classical NPB matrix and the
 * quantity s.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rnpb  double[3][3]  classical nutation x precession x bias matrix
 *    s     double        the quantity s (the CIO locator) in radians
 *
 * Returned (function value):
 *          double        the equation of the origins in radians
 *
 * Notes:
 *
 * 1)  The equation of the origins is the distance between the true
 *     equinox and the celestial intermediate origin and, equivalently,
 *     the difference between Earth rotation angle and Greenwich
 *     apparent sidereal time (ERA-GST).  It comprises the precession
 *     (since J2000.0) in right ascension plus the equation of the
 *     equinoxes (including the small correction terms).
 *
 * 2)  The algorithm is from Wallace & Capitaine (2006).
 *
 *  References:
 *
 *    Capitaine, N. & Wallace, P.T., 2006, Astron.Astrophys. 450, 855
 *
 *    Wallace, P. & Capitaine, N., 2006, Astron.Astrophys. 459, 981
 *
 * This revision:  2023 May 6
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function eors(rnpb, s) {
  let x;
  let ax;
  let xs;
  let ys;
  let zs;
  let p;
  let q;
  let eo;
  x = rnpb[2][0];
  ax = x / (1.0 + rnpb[2][2]);
  xs = 1.0 - ax * x;
  ys = -ax * rnpb[2][1];
  zs = -x;
  p = rnpb[0][0] * xs + rnpb[0][1] * ys + rnpb[0][2] * zs;
  q = rnpb[1][0] * xs + rnpb[1][1] * ys + rnpb[1][2] * zs;
  eo = p != 0.0 || q != 0.0 ? s - Math.atan2(q, p) : s;
  return eo;
}
