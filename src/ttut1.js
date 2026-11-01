// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ttut1.c.
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
 * JS usage:  const { ut11, ut12, status } = ttut1(tt1, tt2, dt)
 *
 * Time scale transformation:  Terrestrial Time, TT, to Universal Time,
 * UT1.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    tt1,tt2    double    TT as a 2-part Julian Date
 *    dt         double    TT-UT1 in seconds
 *
 * Returned:
 *    ut11,ut12  double    UT1 as a 2-part Julian Date
 *
 * Returned (function value):
 *               int       status:  0 = OK
 *
 * Notes:
 *
 * 1) tt1+tt2 is Julian Date, apportioned in any convenient way between
 *    the two arguments, for example where tt1 is the Julian Day Number
 *    and tt2 is the fraction of a day.  The returned ut11,ut12 follow
 *    suit.
 *
 * 2) The argument dt is classical Delta T.
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ttut1(tt1, tt2, dt) {
  let ut11 = 0;
  let ut12 = 0;
  let dtd;
  dtd = dt / DAYSEC;
  if (Math.abs(tt1) > Math.abs(tt2)) {
    ut11 = tt1;
    ut12 = tt2 - dtd;
  } else {
    ut11 = tt1 - dtd;
    ut12 = tt2;
  }
  return { ut11, ut12, status: 0 };
}
