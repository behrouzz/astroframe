// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tpsts.c.
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

import { anp } from './anp.js';

/**
 * JS usage:  const { a, b } = tpsts(xi, eta, a0, b0)
 *
 * In the tangent plane projection, given the star's rectangular
 * coordinates and the spherical coordinates of the tangent point,
 * solve for the spherical coordinates of the star.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    xi,eta    double  rectangular coordinates of star image (Note 2)
 *    a0,b0     double  tangent point's spherical coordinates
 *
 * Returned:
 *    *a,*b     double  star's spherical coordinates
 *
 * 1) The tangent plane projection is also called the "gnomonic
 *    projection" and the "central projection".
 *
 * 2) The eta axis points due north in the adopted coordinate system.
 *    If the spherical coordinates are observed (RA,Dec), the tangent
 *    plane coordinates (xi,eta) are conventionally called the
 *    "standard coordinates".  If the spherical coordinates are with
 *    respect to a right-handed triad, (xi,eta) are also right-handed.
 *    The units of (xi,eta) are, effectively, radians at the tangent
 *    point.
 *
 * 3) All angular arguments are in radians.
 *
 * 4) This function is a member of the following set:
 *
 *        spherical      vector         solve for
 *
 *        tpxes      tpxev         xi,eta
 *      > tpsts <    tpstv          star
 *        tpors      tporv         origin
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
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
export function tpsts(xi, eta, a0, b0) {
  let a = 0;
  let b = 0;
  let sb0;
  let cb0;
  let d;
  sb0 = Math.sin(b0);
  cb0 = Math.cos(b0);
  d = cb0 - eta * sb0;
  a = anp(Math.atan2(xi, d) + a0);
  b = Math.atan2(sb0 + eta * cb0, Math.sqrt(xi * xi + d * d));
  return { a, b };
}
