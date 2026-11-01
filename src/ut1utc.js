// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ut1utc.c.
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
 * JS usage:  const { utc1, utc2, status } = ut1utc(ut11, ut12, dut1)
 *
 * Time scale transformation:  Universal Time, UT1, to Coordinated
 * Universal Time, UTC.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    ut11,ut12  double   UT1 as a 2-part Julian Date (Note 1)
 *    dut1       double   Delta UT1: UT1-UTC in seconds (Note 2)
 *
 * Returned:
 *    utc1,utc2  double   UTC as a 2-part quasi Julian Date (Notes 3,4)
 *
 * Returned (function value):
 *               int      status: +1 = dubious year (Note 5)
 *                                 0 = OK
 *                                -1 = unacceptable date
 *
 * Notes:
 *
 * 1) ut11+ut12 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where ut11 is the Julian
 *    Day Number and ut12 is the fraction of a day.  The returned utc1
 *    and utc2 form an analogous pair, except that a special convention
 *    is used, to deal with the problem of leap seconds - see Note 3.
 *
 * 2) Delta UT1 can be obtained from tabulations provided by the
 *    International Earth Rotation and Reference Systems Service.  The
 *    value changes abruptly by 1s at a leap second;  however, close to
 *    a leap second the algorithm used here is tolerant of the "wrong"
 *    choice of value being made.
 *
 * 3) JD cannot unambiguously represent UTC during a leap second unless
 *    special measures are taken.  The convention in the present
 *    function is that the returned quasi-JD UTC1+UTC2 represents UTC
 *    days whether the length is 86399, 86400 or 86401 SI seconds.
 *
 * 4) The function d2dtf can be used to transform the UTC quasi-JD
 *    into calendar date and clock time, including UTC leap second
 *    handling.
 *
 * 5) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
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
 * This revision:  2023 May 6
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ut1utc(ut11, ut12, dut1) {
  let utc1 = 0;
  let utc2 = 0;
  let big1;
  let i;
  let iy;
  let im;
  let id;
  let js;
  let duts;
  let u1;
  let u2;
  let d1;
  let dats1;
  let d2;
  let fd;
  let dats2;
  let ddats;
  let us1;
  let us2;
  let du;
  duts = dut1;
  big1 = (Math.abs(ut11) >= Math.abs(ut12) ? 1 : 0);
  if (big1) {
    u1 = ut11;
    u2 = ut12;
  } else {
    u1 = ut12;
    u2 = ut11;
  }
  d1 = u1;
  dats1 = 0;
  for (i = -1; i <= 3; i++) {
    d2 = u2 + i;
    const _r1 = jd2cal(d1, d2);
    iy = _r1.iy;
    im = _r1.im;
    id = _r1.id;
    fd = _r1.fd;
    if (_r1.status) {
      return { utc1, utc2, status: -1 };
    }
    const _r2 = dat(iy, im, id, 0.0);
    dats2 = _r2.deltat;
    js = _r2.status;
    if (js < 0) {
      return { utc1, utc2, status: -1 };
    }
    if (i == -1) {
      dats1 = dats2;
    }
    ddats = dats2 - dats1;
    if (Math.abs(ddats) >= 0.5) {
      if (ddats * duts >= 0.0) {
        duts -= ddats;
      }
      const _r3 = cal2jd(iy, im, id);
      d1 = _r3.djm0;
      d2 = _r3.djm;
      if (_r3.status) {
        return { utc1, utc2, status: -1 };
      }
      us1 = d1;
      us2 = d2 - 1.0 + duts / DAYSEC;
      du = u1 - us1;
      du += u2 - us2;
      if (du > 0.0) {
        fd = du * DAYSEC / (DAYSEC + ddats);
        duts += ddats * (fd <= 1.0 ? fd : 1.0);
      }
      break;
    }
    dats1 = dats2;
  }
  u2 -= duts / DAYSEC;
  if (big1) {
    utc1 = u1;
    utc2 = u2;
  } else {
    utc1 = u2;
    utc2 = u1;
  }
  return { utc1, utc2, status: js };
}
