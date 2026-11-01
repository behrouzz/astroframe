// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tpstv.c.
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
 * JS usage:  const v = tpstv(xi, eta, v0)
 *
 * In the tangent plane projection, given the star's rectangular
 * coordinates and the direction cosines of the tangent point, solve
 * for the direction cosines of the star.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    xi,eta  double     rectangular coordinates of star image (Note 2)
 *    v0      double[3]  tangent point's direction cosines
 *
 * Returned:
 *    v       double[3]  star's direction cosines
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
 * 3) The method used is to complete the star vector in the (xi,eta)
 *    based triad and normalize it, then rotate the triad to put the
 *    tangent point at the pole with the x-axis aligned to zero
 *    longitude.  Writing (a0,b0) for the celestial spherical
 *    coordinates of the tangent point, the sequence of rotations is
 *    (b-pi/2) around the x-axis followed by (-a-pi/2) around the
 *    z-axis.
 *
 * 4) If vector v0 is not of unit length, the returned vector v will
 *    be wrong.
 *
 * 5) If vector v0 points at a pole, the returned vector v will be
 *    based on the arbitrary assumption that the longitude coordinate
 *    of the tangent point is zero.
 *
 * 6) This function is a member of the following set:
 *
 *        spherical      vector         solve for
 *
 *        tpxes      tpxev         xi,eta
 *        tpsts    > tpstv <        star
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
export function tpstv(xi, eta, v0) {
  let v = [0, 0, 0];
  let x;
  let y;
  let z;
  let f;
  let r;
  x = v0[0];
  y = v0[1];
  z = v0[2];
  r = Math.sqrt(x * x + y * y);
  if (r == 0.0) {
    r = 1e-20;
    x = r;
  }
  f = Math.sqrt(1.0 + xi * xi + eta * eta);
  v[0] = (x - (xi * y + eta * x * z) / r) / f;
  v[1] = (y + (xi * x - eta * y * z) / r) / f;
  v[2] = (z + eta * r) / f;
  return v;
}
