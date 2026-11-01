// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tf2d.c.
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

import { DAYSEC } from './constants.js';

/**
 * JS usage:  const { days, status } = tf2d(s, ihour, imin, sec)
 *
 * Convert hours, minutes, seconds to days.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    s         char    sign:  '-' = negative, otherwise positive
 *    ihour     int     hours
 *    imin      int     minutes
 *    sec       double  seconds
 *
 * Returned:
 *    days      double  interval in days
 *
 * Returned (function value):
 *              int     status:  0 = OK
 *                               1 = ihour outside range 0-23
 *                               2 = imin outside range 0-59
 *                               3 = sec outside range 0-59.999...
 *
 * Notes:
 *
 * 1)  The result is computed even if any of the range checks fail.
 *
 * 2)  Negative ihour, imin and/or sec produce a warning status, but
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
export function tf2d(s, ihour, imin, sec) {
  let days = 0;
  days = (s == '-' ? -1.0 : 1.0) * (60.0 * (60.0 * Math.abs(ihour) + Math.abs(imin)) + Math.abs(sec)) / DAYSEC;
  if (ihour < 0 || ihour > 23) {
    return { days, status: 1 };
  }
  if (imin < 0 || imin > 59) {
    return { days, status: 2 };
  }
  if (sec < 0.0 || sec >= 60.0) {
    return { days, status: 3 };
  }
  return { days, status: 0 };
}
