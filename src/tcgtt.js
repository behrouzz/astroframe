// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tcgtt.c.
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

import { DAYSEC, DJM0, DJM77, ELG, TTMTAI } from './constants.js';

const t77t = DJM77 + TTMTAI / DAYSEC;

/**
 * JS usage:  const { tt1, tt2, status } = tcgtt(tcg1, tcg2)
 *
 * Time scale transformation:  Geocentric Coordinate Time, TCG, to
 * Terrestrial Time, TT.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    tcg1,tcg2  double    TCG as a 2-part Julian Date
 *
 * Returned:
 *    tt1,tt2    double    TT as a 2-part Julian Date
 *
 * Returned (function value):
 *               int       status:  0 = OK
 *
 * Note:
 *
 *    tcg1+tcg2 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where tcg1 is the Julian
 *    Day Number and tcg22 is the fraction of a day.  The returned
 *    tt1,tt2 follow suit.
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 *    IAU 2000 Resolution B1.9
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function tcgtt(tcg1, tcg2) {
  let tt1 = 0;
  let tt2 = 0;
  if (Math.abs(tcg1) > Math.abs(tcg2)) {
    tt1 = tcg1;
    tt2 = tcg2 - (tcg1 - DJM0 + (tcg2 - t77t)) * ELG;
  } else {
    tt1 = tcg1 - (tcg2 - DJM0 + (tcg1 - t77t)) * ELG;
    tt2 = tcg2;
  }
  return { tt1, tt2, status: 0 };
}
