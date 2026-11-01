// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file epb.c.
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

import { DJ00, DTY } from './constants.js';

/**
 * JS usage:  const result = epb(dj1, dj2)
 *
 * Julian Date to Besselian Epoch.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    dj1,dj2    double     Julian Date (Notes 3,4)
 *
 * Returned (function value):
 *               double     Besselian Epoch.
 *
 * Notes:
 *
 * 1) Besselian Epoch is a method of expressing a moment in time as a
 *    year plus fraction.  It was superseded by Julian Year (see the
 *    function epj).
 *
 * 2) The start of a Besselian year is when the right ascension of
 *    the fictitious mean Sun is 18h 40m, and the unit is the tropical
 *    year.  The conventional definition (see Lieske 1979) is that
 *    Besselian Epoch B1900.0 is JD 2415020.31352 and the length of the
 *    year is 365.242198781 days.
 *
 * 3) The time scale for the JD, originally Ephemeris Time, is TDB,
 *    which for all practical purposes in the present context is
 *    indistinguishable from TT.
 *
 * 4) The Julian Date is supplied in two pieces, in the usual SOFA
 *    manner, which is designed to preserve time resolution.  The
 *    Julian Date is available as a single number by adding dj1 and
 *    dj2.  The maximum resolution is achieved if dj1 is 2451545.0
 *    (J2000.0).
 *
 * Reference:
 *
 *    Lieske, J.H., 1979. Astron.Astrophys., 73, 282.
 *
 * This revision:  2023 May 5
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function epb(dj1, dj2) {
  const D1900 = 36524.68648;
  return 1900.0 + (dj1 - DJ00 + (dj2 + D1900)) / DTY;
}
