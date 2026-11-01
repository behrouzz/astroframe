// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file af2a.c.
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

import { DAS2R } from './constants.js';

/**
 * JS usage:  const { rad, status } = af2a(s, ideg, iamin, asec)
 *
 * Convert degrees, arcminutes, arcseconds to radians.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    s         char    sign:  '-' = negative, otherwise positive
 *    ideg      int     degrees
 *    iamin     int     arcminutes
 *    asec      double  arcseconds
 *
 * Returned:
 *    rad       double  angle in radians
 *
 * Returned (function value):
 *              int     status:  0 = OK
 *                               1 = ideg outside range 0-359
 *                               2 = iamin outside range 0-59
 *                               3 = asec outside range 0-59.999...
 *
 * Notes:
 *
 * 1)  The result is computed even if any of the range checks fail.
 *
 * 2)  Negative ideg, iamin and/or asec produce a warning status, but
 *     the absolute value is used in the conversion.
 *
 * 3)  If there are multiple errors, the status value reflects only the
 *     first, the smallest taking precedence.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function af2a(s, ideg, iamin, asec) {
  let rad = 0;
  rad = (s == '-' ? -1.0 : 1.0) * (60.0 * (60.0 * Math.abs(ideg) + Math.abs(iamin)) + Math.abs(asec)) * DAS2R;
  if (ideg < 0 || ideg > 359) {
    return { rad, status: 1 };
  }
  if (iamin < 0 || iamin > 59) {
    return { rad, status: 2 };
  }
  if (asec < 0.0 || asec >= 60.0) {
    return { rad, status: 3 };
  }
  return { rad, status: 0 };
}
