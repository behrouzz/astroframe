// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gc2gde.c.
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

import { DPI } from './constants.js';

/**
 * JS usage:  const { elong, phi, height, status } = gc2gde(a, f, xyz)
 *
 * Transform geocentric coordinates to geodetic for a reference
 * ellipsoid of specified form.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    a       double     equatorial radius (Notes 2,4)
 *    f       double     flattening (Note 3)
 *    xyz     double[3]  geocentric vector (Note 4)
 *
 * Returned:
 *    elong   double     longitude (radians, east +ve)
 *    phi     double     latitude (geodetic, radians)
 *    height  double     height above ellipsoid (geodetic, Note 4)
 *
 * Returned (function value):
 *            int        status:  0 = OK
 *                               -1 = illegal f
 *                               -2 = illegal a
 *
 * Notes:
 *
 * 1) This function is based on the GCONV2H Fortran subroutine by
 *    Toshio Fukushima (see reference).
 *
 * 2) The equatorial radius, a, can be in any units, but meters is
 *    the conventional choice.
 *
 * 3) The flattening, f, is (for the Earth) a value around 0.00335,
 *    i.e. around 1/298.
 *
 * 4) The equatorial radius, a, and the geocentric vector, xyz,
 *    must be given in the same units, and determine the units of
 *    the returned height, height.
 *
 * 5) If an error occurs (status < 0), elong, phi and height are
 *    unchanged.
 *
 * 6) The inverse transformation is performed in the function
 *    gd2gce.
 *
 * 7) The transformation for a standard ellipsoid (such as WGS84) can
 *    more conveniently be performed by calling gc2gd, which uses a
 *    numerical code to identify the required A and F values.
 *
 * Reference:
 *
 *    Fukushima, T., "Transformation from Cartesian to geodetic
 *    coordinates accelerated by Halley's method", J.Geodesy (2006)
 *    79: 689-693
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function gc2gde(a, f, xyz) {
  let elong = 0;
  let phi = 0;
  let height = 0;
  let aeps2;
  let e2;
  let e4t;
  let ec2;
  let ec;
  let b;
  let x;
  let y;
  let z;
  let p2;
  let absz;
  let p;
  let s0;
  let pn;
  let zc;
  let c0;
  let c02;
  let c03;
  let s02;
  let s03;
  let a02;
  let a0;
  let a03;
  let d0;
  let f0;
  let b0;
  let s1;
  let cc;
  let s12;
  let cc2;
  if (f < 0.0 || f >= 1.0) {
    return { elong, phi, height, status: -1 };
  }
  if (a <= 0.0) {
    return { elong, phi, height, status: -2 };
  }
  aeps2 = a * a * 1e-32;
  e2 = (2.0 - f) * f;
  e4t = e2 * e2 * 1.5;
  ec2 = 1.0 - e2;
  if (ec2 <= 0.0) {
    return { elong, phi, height, status: -1 };
  }
  ec = Math.sqrt(ec2);
  b = a * ec;
  x = xyz[0];
  y = xyz[1];
  z = xyz[2];
  p2 = x * x + y * y;
  elong = p2 > 0.0 ? Math.atan2(y, x) : 0.0;
  absz = Math.abs(z);
  if (p2 > aeps2) {
    p = Math.sqrt(p2);
    s0 = absz / a;
    pn = p / a;
    zc = ec * s0;
    c0 = ec * pn;
    c02 = c0 * c0;
    c03 = c02 * c0;
    s02 = s0 * s0;
    s03 = s02 * s0;
    a02 = c02 + s02;
    a0 = Math.sqrt(a02);
    a03 = a02 * a0;
    d0 = zc * a03 + e2 * s03;
    f0 = pn * a03 - e2 * c03;
    b0 = e4t * s02 * c02 * pn * (a0 - ec);
    s1 = d0 * f0 - b0 * s0;
    cc = ec * (f0 * f0 - b0 * c0);
    phi = Math.atan(s1 / cc);
    s12 = s1 * s1;
    cc2 = cc * cc;
    height = (p * cc + absz * s1 - a * Math.sqrt(ec2 * s12 + cc2)) / Math.sqrt(s12 + cc2);
  } else {
    phi = DPI / 2.0;
    height = absz - b;
  }
  if (z < 0) {
    phi = -phi;
  }
  return { elong, phi, height, status: 0 };
}
