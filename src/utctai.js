// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file utctai.c.
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
import { cal2jd } from './cal2jd.js';
import { dat } from './dat.js';
import { jd2cal } from './jd2cal.js';

/**
 * JS usage:  const { tai1, tai2, status } = utctai(utc1, utc2)
 *
 * Time scale transformation:  Coordinated Universal Time, UTC, to
 * International Atomic Time, TAI.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    utc1,utc2  double   UTC as a 2-part quasi Julian Date (Notes 1-4)
 *
 * Returned:
 *    tai1,tai2  double   TAI as a 2-part Julian Date (Note 5)
 *
 * Returned (function value):
 *               int      status: +1 = dubious year (Note 3)
 *                                 0 = OK
 *                                -1 = unacceptable date
 *
 * Notes:
 *
 * 1) utc1+utc2 is quasi Julian Date (see Note 2), apportioned in any
 *    convenient way between the two arguments, for example where utc1
 *    is the Julian Day Number and utc2 is the fraction of a day.
 *
 * 2) JD cannot unambiguously represent UTC during a leap second unless
 *    special measures are taken.  The convention in the present
 *    function is that the JD day represents UTC days whether the
 *    length is 86399, 86400 or 86401 SI seconds.  In the 1960-1972 era
 *    there were smaller jumps (in either direction) each time the
 *    linear UTC(TAI) expression was changed, and these "mini-leaps"
 *    are also included in the SOFA convention.
 *
 * 3) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
 *
 * 4) The function dtf2d converts from calendar date and time of day
 *    into 2-part Julian Date, and in the case of UTC implements the
 *    leap-second-ambiguity convention described above.
 *
 * 5) The returned TAI1,TAI2 are such that their sum is the TAI Julian
 *    Date.
 *
 * Called:
 *    jd2cal    JD to Gregorian calendar
 *    dat       delta(AT) = TAI-UTC
 *    cal2jd    Gregorian calendar to JD
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
 *
 */
export function utctai(utc1, utc2) {
  let tai1 = 0;
  let tai2 = 0;
  let big1;
  let iy;
  let im;
  let id;
  let j;
  let iyt;
  let imt;
  let idt;
  let u1;
  let u2;
  let fd;
  let dat0;
  let dat12;
  let w;
  let dat24;
  let dlod;
  let dleap;
  let z1;
  let z2;
  let a2;
  big1 = (Math.abs(utc1) >= Math.abs(utc2) ? 1 : 0);
  if (big1) {
    u1 = utc1;
    u2 = utc2;
  } else {
    u1 = utc2;
    u2 = utc1;
  }
  const _r1 = jd2cal(u1, u2);
  iy = _r1.iy;
  im = _r1.im;
  id = _r1.id;
  fd = _r1.fd;
  j = _r1.status;
  if (j) {
    return { tai1, tai2, status: j };
  }
  const _r2 = dat(iy, im, id, 0.0);
  dat0 = _r2.deltat;
  j = _r2.status;
  if (j < 0) {
    return { tai1, tai2, status: j };
  }
  const _r3 = dat(iy, im, id, 0.5);
  dat12 = _r3.deltat;
  j = _r3.status;
  if (j < 0) {
    return { tai1, tai2, status: j };
  }
  const _r4 = jd2cal(u1 + 1.5, u2 - fd);
  iyt = _r4.iy;
  imt = _r4.im;
  idt = _r4.id;
  w = _r4.fd;
  j = _r4.status;
  if (j) {
    return { tai1, tai2, status: j };
  }
  const _r5 = dat(iyt, imt, idt, 0.0);
  dat24 = _r5.deltat;
  j = _r5.status;
  if (j < 0) {
    return { tai1, tai2, status: j };
  }
  dlod = 2.0 * (dat12 - dat0);
  dleap = dat24 - (dat0 + dlod);
  fd *= (DAYSEC + dleap) / DAYSEC;
  fd *= (DAYSEC + dlod) / DAYSEC;
  const _r6 = cal2jd(iy, im, id);
  z1 = _r6.djm0;
  z2 = _r6.djm;
  if (_r6.status) {
    return { tai1, tai2, status: -1 };
  }
  a2 = z1 - u1;
  a2 += z2;
  a2 += fd + dat0 / DAYSEC;
  if (big1) {
    tai1 = u1;
    tai2 = a2;
  } else {
    tai1 = a2;
    tai2 = u1;
  }
  return { tai1, tai2, status: j };
}
