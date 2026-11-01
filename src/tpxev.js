// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tpxev.c.
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
 * JS usage:  const { xi, eta, status } = tpxev(v, v0)
 *
 * In the tangent plane projection, given celestial direction cosines
 * for a star and the tangent point, solve for the star's rectangular
 * coordinates in the tangent plane.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    v         double[3]  direction cosines of star (Note 4)
 *    v0        double[3]  direction cosines of tangent point (Note 4)
 *
 * Returned:
 *    *xi,*eta  double     tangent plane coordinates of star
 *
 * Returned (function value):
 *              int        status: 0 = OK
 *                                 1 = star too far from axis
 *                                 2 = antistar on tangent plane
 *                                 3 = antistar too far from axis
 *
 * Notes:
 *
 * 1) The tangent plane projection is also called the "gnomonic
 *    projection" and the "central projection".
 *
 * 2) The eta axis points due north in the adopted coordinate system.
 *    If the direction cosines represent observed (RA,Dec), the tangent
 *    plane coordinates (xi,eta) are conventionally called the
 *    "standard coordinates".  If the direction cosines are with
 *    respect to a right-handed triad, (xi,eta) are also right-handed.
 *    The units of (xi,eta) are, effectively, radians at the tangent
 *    point.
 *
 * 3) The method used is to extend the star vector to the tangent
 *    plane and then rotate the triad so that (x,y) becomes (xi,eta).
 *    Writing (a,b) for the celestial spherical coordinates of the
 *    star, the sequence of rotations is (a+pi/2) around the z-axis
 *    followed by (pi/2-b) around the x-axis.
 *
 * 4) If vector v0 is not of unit length, or if vector v is of zero
 *    length, the results will be wrong.
 *
 * 5) If v0 points at a pole, the returned (xi,eta) will be based on
 *    the arbitrary assumption that the longitude coordinate of the
 *    tangent point is zero.
 *
 * 6) This function is a member of the following set:
 *
 *        spherical      vector         solve for
 *
 *        tpxes    > tpxev <       xi,eta
 *        tpsts      tpstv          star
 *        tpors      tporv         origin
 *
 * References:
 *
 *    Calabretta M.R. & Greisen, E.W., 2002, "Representations of
 *    celestial coordinates in FITS", Astron.Astrophys. 395, 1077
 *
 *    Green, R.M., "Spherical Astronomy", Cambridge University Press,
 *    1987, Chapter 13.
 *
 * This revision:   2018 January 2
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function tpxev(v, v0) {
  let xi = 0;
  let eta = 0;
  const TINY = 1e-6;
  let j;
  let x;
  let y;
  let z;
  let x0;
  let y0;
  let z0;
  let r2;
  let r;
  let w;
  let d;
  x = v[0];
  y = v[1];
  z = v[2];
  x0 = v0[0];
  y0 = v0[1];
  z0 = v0[2];
  r2 = x0 * x0 + y0 * y0;
  r = Math.sqrt(r2);
  if (r == 0.0) {
    r = 1e-20;
    x0 = r;
  }
  w = x * x0 + y * y0;
  d = w + z * z0;
  if (d > TINY) {
    j = 0;
  } else if (d >= 0.0) {
    j = 1;
    d = TINY;
  } else if (d > -TINY) {
    j = 2;
    d = -TINY;
  } else {
    j = 3;
  }
  d *= r;
  xi = (y * x0 - x * y0) / d;
  eta = (z * r2 - z0 * w) / d;
  return { xi, eta, status: j };
}
