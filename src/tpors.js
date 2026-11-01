// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tpors.c.
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
 * JS usage:  const { a01, b01, a02, b02, status } = tpors(xi, eta, a, b)
 *
 * In the tangent plane projection, given the rectangular coordinates
 * of a star and its spherical coordinates, determine the spherical
 * coordinates of the tangent point.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    xi,eta     double  rectangular coordinates of star image (Note 2)
 *    a,b        double  star's spherical coordinates (Note 3)
 *
 * Returned:
 *    *a01,*b01  double  tangent point's spherical coordinates, Soln. 1
 *    *a02,*b02  double  tangent point's spherical coordinates, Soln. 2
 *
 * Returned (function value):
 *               int     number of solutions:
 *                       0 = no solutions returned (Note 5)
 *                       1 = only the first solution is useful (Note 6)
 *                       2 = both solutions are useful (Note 6)
 *
 * Notes:
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
 * 4) The angles a01 and a02 are returned in the range 0-2pi.  The
 *    angles b01 and b02 are returned in the range +/-pi, but in the
 *    usual, non-pole-crossing, case, the range is +/-pi/2.
 *
 * 5) Cases where there is no solution can arise only near the poles.
 *    For example, it is clearly impossible for a star at the pole
 *    itself to have a non-zero xi value, and hence it is meaningless
 *    to ask where the tangent point would have to be to bring about
 *    this combination of xi and dec.
 *
 * 6) Also near the poles, cases can arise where there are two useful
 *    solutions.  The return value indicates whether the second of the
 *    two solutions returned is useful;  1 indicates only one useful
 *    solution, the usual case.
 *
 * 7) The basis of the algorithm is to solve the spherical triangle PSC,
 *    where P is the north celestial pole, S is the star and C is the
 *    tangent point.  The spherical coordinates of the tangent point are
 *    [a0,b0];  writing rho^2 = (xi^2+eta^2) and r^2 = (1+rho^2), side c
 *    is then (pi/2-b), side p is sqrt(xi^2+eta^2) and side s (to be
 *    found) is (pi/2-b0).  Angle C is given by sin(C) = xi/rho and
 *    cos(C) = eta/rho.  Angle P (to be found) is the longitude
 *    difference between star and tangent point (a-a0).
 *
 * 8) This function is a member of the following set:
 *
 *        spherical      vector         solve for
 *
 *        tpxes      tpxev         xi,eta
 *        tpsts      tpstv          star
 *      > tpors <    tporv         origin
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
export function tpors(xi, eta, a, b) {
  let a01 = 0;
  let b01 = 0;
  let a02 = 0;
  let b02 = 0;
  let xi2;
  let r;
  let sb;
  let cb;
  let rsb;
  let rcb;
  let w2;
  let w;
  let s;
  let c;
  xi2 = xi * xi;
  r = Math.sqrt(1.0 + xi2 + eta * eta);
  sb = Math.sin(b);
  cb = Math.cos(b);
  rsb = r * sb;
  rcb = r * cb;
  w2 = rcb * rcb - xi2;
  if (w2 >= 0.0) {
    w = Math.sqrt(w2);
    s = rsb - eta * w;
    c = rsb * eta + w;
    if (xi == 0.0 && w == 0.0) {
      w = 1.0;
    }
    a01 = anp(a - Math.atan2(xi, w));
    b01 = Math.atan2(s, c);
    w = -w;
    s = rsb - eta * w;
    c = rsb * eta + w;
    a02 = anp(a - Math.atan2(xi, w));
    b02 = Math.atan2(s, c);
    return { a01, b01, a02, b02, status: Math.abs(rsb) < 1.0 ? 1 : 2 };
  } else {
    return { a01, b01, a02, b02, status: 0 };
  }
  return { a01, b01, a02, b02, status: None };
}
