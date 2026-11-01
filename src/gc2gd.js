// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gc2gd.c.
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

import { eform } from './eform.js';
import { gc2gde } from './gc2gde.js';

/**
 * JS usage:  const { elong, phi, height, status } = gc2gd(n, xyz)
 *
 * Transform geocentric coordinates to geodetic using the specified
 * reference ellipsoid.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical transformation.
 *
 * Given:
 *    n       int        ellipsoid identifier (Note 1)
 *    xyz     double[3]  geocentric vector (Note 2)
 *
 * Returned:
 *    elong   double     longitude (radians, east +ve, Note 3)
 *    phi     double     latitude (geodetic, radians, Note 3)
 *    height  double     height above ellipsoid (geodetic, Notes 2,3)
 *
 * Returned (function value):
 *           int         status:  0 = OK
 *                               -1 = illegal identifier (Note 3)
 *                               -2 = internal error (Note 3)
 *
 * Notes:
 *
 * 1) The identifier n is a number that specifies the choice of
 *    reference ellipsoid.  The following are supported:
 *
 *       n    ellipsoid
 *
 *       1     WGS84
 *       2     GRS80
 *       3     WGS72
 *
 *    The n value has no significance outside the SOFA software.  For
 *    convenience, symbols WGS84 etc. are defined in sofam.h.
 *
 * 2) The geocentric vector (xyz, given) and height (height, returned)
 *    are in meters.
 *
 * 3) An error status -1 means that the identifier n is illegal.  An
 *    error status -2 is theoretically impossible.  In all error cases,
 *    all three results are set to -1e9.
 *
 * 4) The inverse transformation is performed in the function gd2gc.
 *
 * Called:
 *    eform     Earth reference ellipsoids
 *    gc2gde    geocentric to geodetic transformation, general
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function gc2gd(n, xyz) {
  let elong = 0;
  let phi = 0;
  let height = 0;
  let j;
  let a;
  let f;
  const _r1 = eform(n);
  a = _r1.a;
  f = _r1.f;
  j = _r1.status;
  if (j == 0) {
    const _r2 = gc2gde(a, f, xyz);
    elong = _r2.elong;
    phi = _r2.phi;
    height = _r2.height;
    j = _r2.status;
    if (j < 0) {
      j = -2;
    }
  }
  if (j < 0) {
    elong = -1e9;
    phi = -1e9;
    height = -1e9;
  }
  return { elong, phi, height, status: j };
}
