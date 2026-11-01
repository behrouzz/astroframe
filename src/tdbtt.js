// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tdbtt.c.
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
 * JS usage:  const { tt1, tt2, status } = tdbtt(tdb1, tdb2, dtr)
 *
 * Time scale transformation:  Barycentric Dynamical Time, TDB, to
 * Terrestrial Time, TT.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    tdb1,tdb2  double    TDB as a 2-part Julian Date
 *    dtr        double    TDB-TT in seconds
 *
 * Returned:
 *    tt1,tt2    double    TT as a 2-part Julian Date
 *
 * Returned (function value):
 *               int       status:  0 = OK
 *
 * Notes:
 *
 * 1) tdb1+tdb2 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where tdb1 is the Julian
 *    Day Number and tdb2 is the fraction of a day.  The returned
 *    tt1,tt2 follow suit.
 *
 * 2) The argument dtr represents the quasi-periodic component of the
 *    GR transformation between TT and TCB.  It is dependent upon the
 *    adopted solar-system ephemeris, and can be obtained by numerical
 *    integration, by interrogating a precomputed time ephemeris or by
 *    evaluating a model such as that implemented in the SOFA function
 *    dtdb.   The quantity is dominated by an annual term of 1.7 ms
 *    amplitude.
 *
 * 3) TDB is essentially the same as Teph, the time argument for the
 *    JPL solar system ephemerides.
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 *    IAU 2006 Resolution 3
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 *
 */
export function tdbtt(tdb1, tdb2, dtr) {
  let tt1 = 0;
  let tt2 = 0;
  let dtrd;
  dtrd = dtr / DAYSEC;
  if (Math.abs(tdb1) > Math.abs(tdb2)) {
    tt1 = tdb1;
    tt2 = tdb2 - dtrd;
  } else {
    tt1 = tdb1 - dtrd;
    tt2 = tdb2;
  }
  return { tt1, tt2, status: 0 };
}
