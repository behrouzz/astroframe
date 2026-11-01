// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ut1tt.c.
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
 * JS usage:  const { tt1, tt2, status } = ut1tt(ut11, ut12, dt)
 *
 * Time scale transformation:  Universal Time, UT1, to Terrestrial
 * Time, TT.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    ut11,ut12  double    UT1 as a 2-part Julian Date
 *    dt         double    TT-UT1 in seconds
 *
 * Returned:
 *    tt1,tt2    double    TT as a 2-part Julian Date
 *
 * Returned (function value):
 *               int       status:  0 = OK
 *
 * Notes:
 *
 * 1) ut11+ut12 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where ut11 is the Julian
 *    Day Number and ut12 is the fraction of a day.  The returned
 *    tt1,tt2 follow suit.
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
export function ut1tt(ut11, ut12, dt) {
  let tt1 = 0;
  let tt2 = 0;
  let dtd;
  dtd = dt / DAYSEC;
  if (Math.abs(ut11) > Math.abs(ut12)) {
    tt1 = ut11;
    tt2 = ut12 + dtd;
  } else {
    tt1 = ut11 + dtd;
    tt2 = ut12;
  }
  return { tt1, tt2, status: 0 };
}
