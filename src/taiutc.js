// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file taiutc.c.
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

import { utctai } from './utctai.js';

/**
 * JS usage:  const { utc1, utc2, status } = taiutc(tai1, tai2)
 *
 * Time scale transformation:  International Atomic Time, TAI, to
 * Coordinated Universal Time, UTC.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    tai1,tai2  double   TAI as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    utc1,utc2  double   UTC as a 2-part quasi Julian Date (Notes 1-3)
 *
 * Returned (function value):
 *               int      status: +1 = dubious year (Note 4)
 *                                 0 = OK
 *                                -1 = unacceptable date
 *
 * Notes:
 *
 * 1) tai1+tai2 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where tai1 is the Julian
 *    Day Number and tai2 is the fraction of a day.  The returned utc1
 *    and utc2 form an analogous pair, except that a special convention
 *    is used, to deal with the problem of leap seconds - see the next
 *    note.
 *
 * 2) JD cannot unambiguously represent UTC during a leap second unless
 *    special measures are taken.  The convention in the present
 *    function is that the JD day represents UTC days whether the
 *    length is 86399, 86400 or 86401 SI seconds.  In the 1960-1972 era
 *    there were smaller jumps (in either direction) each time the
 *    linear UTC(TAI) expression was changed, and these "mini-leaps"
 *    are also included in the SOFA convention.
 *
 * 3) The function d2dtf can be used to transform the UTC quasi-JD
 *    into calendar date and clock time, including UTC leap second
 *    handling.
 *
 * 4) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
 *
 * Called:
 *    utctai    UTC to TAI
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
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
export function taiutc(tai1, tai2) {
  let utc1 = 0;
  let utc2 = 0;
  let big1;
  let i;
  let j;
  let a1;
  let a2;
  let u1;
  let u2;
  let g1;
  let g2;
  big1 = (Math.abs(tai1) >= Math.abs(tai2) ? 1 : 0);
  if (big1) {
    a1 = tai1;
    a2 = tai2;
  } else {
    a1 = tai2;
    a2 = tai1;
  }
  u1 = a1;
  u2 = a2;
  for (i = 0; i < 3; i++) {
    const _r1 = utctai(u1, u2);
    g1 = _r1.tai1;
    g2 = _r1.tai2;
    j = _r1.status;
    if (j < 0) {
      return { utc1, utc2, status: j };
    }
    u2 += a1 - g1;
    u2 += a2 - g2;
  }
  if (big1) {
    utc1 = u1;
    utc2 = u2;
  } else {
    utc1 = u2;
    utc2 = u1;
  }
  return { utc1, utc2, status: j };
}
