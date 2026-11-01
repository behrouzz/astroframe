// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tpxes.c.
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
 * JS usage:  const { xi, eta, status } = tpxes(a, b, a0, b0)
 *
 * In the tangent plane projection, given celestial spherical
 * coordinates for a star and the tangent point, solve for the star's
 * rectangular coordinates in the tangent plane.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    a,b       double  star's spherical coordinates
 *    a0,b0     double  tangent point's spherical coordinates
 *
 * Returned:
 *    *xi,*eta  double  rectangular coordinates of star image (Note 2)
 *
 * Returned (function value):
 *              int     status:  0 = OK
 *                               1 = star too far from axis
 *                               2 = antistar on tangent plane
 *                               3 = antistar too far from axis
 *
 * Notes:
 *
 * 1) The tangent plane projection is also called the "gnomonic
 *    projection" and the "central projection".
 *
 * 2) The eta axis points due north in the adopted coordinate system.
 *    If the spherical coordinates are observed (RA,Dec), the tangent
 *    plane coordinates (xi,eta) are conventionally called the
 *    "standard coordinates".  For right-handed spherical coordinates,
 *    (xi,eta) are also right-handed.  The units of (xi,eta) are,
 *    effectively, radians at the tangent point.
 *
 * 3) All angular arguments are in radians.
 *
 * 4) This function is a member of the following set:
 *
 *        spherical      vector         solve for
 *
 *      > tpxes <    tpxev         xi,eta
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
export function tpxes(a, b, a0, b0) {
  let xi = 0;
  let eta = 0;
  const TINY = 1e-6;
  let j;
  let sb0;
  let sb;
  let cb0;
  let cb;
  let da;
  let sda;
  let cda;
  let d;
  sb0 = Math.sin(b0);
  sb = Math.sin(b);
  cb0 = Math.cos(b0);
  cb = Math.cos(b);
  da = a - a0;
  sda = Math.sin(da);
  cda = Math.cos(da);
  d = sb * sb0 + cb * cb0 * cda;
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
  xi = cb * sda / d;
  eta = (sb * cb0 - cb * sb0 * cda) / d;
  return { xi, eta, status: j };
}
