// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gd2gce.c.
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
 * JS usage:  const { xyz, status } = gd2gce(a, f, elong, phi, height)
 *
 * Transform geodetic coordinates to geocentric for a reference
 * ellipsoid of specified form.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    a       double     equatorial radius (Notes 1,3,4)
 *    f       double     flattening (Notes 2,4)
 *    elong   double     longitude (radians, east +ve, Note 4)
 *    phi     double     latitude (geodetic, radians, Note 4)
 *    height  double     height above ellipsoid (geodetic, Notes 3,4)
 *
 * Returned:
 *    xyz     double[3]  geocentric vector (Note 3)
 *
 * Returned (function value):
 *            int        status:  0 = OK
 *                               -1 = illegal case (Note 4)
 * Notes:
 *
 * 1) The equatorial radius, a, can be in any units, but meters is
 *    the conventional choice.
 *
 * 2) The flattening, f, is (for the Earth) a value around 0.00335,
 *    i.e. around 1/298.
 *
 * 3) The equatorial radius, a, and the height, height, must be
 *    given in the same units, and determine the units of the
 *    returned geocentric vector, xyz.
 *
 * 4) No validation is performed on individual arguments.  The error
 *    status -1 protects against (unrealistic) cases that would lead
 *    to arithmetic exceptions.  If an error occurs, xyz is unchanged.
 *
 * 5) The inverse transformation is performed in the function
 *    gc2gde.
 *
 * 6) The transformation for a standard ellipsoid (such as WGS84) can
 *    more conveniently be performed by calling gd2gc,  which uses a
 *    numerical code to identify the required a and f values.
 *
 * References:
 *
 *    Green, R.M., Spherical Astronomy, Cambridge University Press,
 *    (1985) Section 4.5, p96.
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 4.22, p202.
 *
 * This revision:  2023 March 10
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function gd2gce(a, f, elong, phi, height) {
  let xyz = [0, 0, 0];
  let sp;
  let cp;
  let w;
  let d;
  let ac;
  let as;
  let r;
  sp = Math.sin(phi);
  cp = Math.cos(phi);
  w = 1.0 - f;
  w = w * w;
  d = cp * cp + w * sp * sp;
  if (d <= 0.0) {
    return { xyz, status: -1 };
  }
  ac = a / Math.sqrt(d);
  as = w * ac;
  r = (ac + height) * cp;
  xyz[0] = r * Math.cos(elong);
  xyz[1] = r * Math.sin(elong);
  xyz[2] = (as + height) * sp;
  return { xyz, status: 0 };
}
