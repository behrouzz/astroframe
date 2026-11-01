// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file dtf2d.c.
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
import { strcmp } from './util.js';
import { cal2jd } from './cal2jd.js';
import { dat } from './dat.js';
import { jd2cal } from './jd2cal.js';

/**
 * JS usage:  const { d1, d2, status } = dtf2d(scale, iy, im, id, ihr, imn, sec)
 *
 * Encode date and time fields into 2-part Julian Date (or in the case
 * of UTC a quasi-JD form that includes special provision for leap
 * seconds).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    scale     char[]  time scale ID (Note 1)
 *    iy,im,id  int     year, month, day in Gregorian calendar (Note 2)
 *    ihr,imn   int     hour, minute
 *    sec       double  seconds
 *
 * Returned:
 *    d1,d2     double  2-part Julian Date (Notes 3,4)
 *
 * Returned (function value):
 *              int     status: +3 = both of next two
 *                              +2 = time is after end of day (Note 5)
 *                              +1 = dubious year (Note 6)
 *                               0 = OK
 *                              -1 = bad year
 *                              -2 = bad month
 *                              -3 = bad day
 *                              -4 = bad hour
 *                              -5 = bad minute
 *                              -6 = bad second (<0)
 *
 * Notes:
 *
 * 1) scale identifies the time scale.  Only the value "UTC" (in upper
 *    case) is significant, and enables handling of leap seconds (see
 *    Note 4).
 *
 * 2) For calendar conventions and limitations, see cal2jd.
 *
 * 3) The sum of the results, d1+d2, is Julian Date, where normally d1
 *    is the Julian Day Number and d2 is the fraction of a day.  In the
 *    case of UTC, where the use of JD is problematical, special
 *    conventions apply:  see the next note.
 *
 * 4) JD cannot unambiguously represent UTC during a leap second unless
 *    special measures are taken.  The SOFA internal convention is that
 *    the quasi-JD day represents UTC days whether the length is 86399,
 *    86400 or 86401 SI seconds.  In the 1960-1972 era there were
 *    smaller jumps (in either direction) each time the linear UTC(TAI)
 *    expression was changed, and these "mini-leaps" are also included
 *    in the SOFA convention.
 *
 * 5) The warning status "time is after end of day" usually means that
 *    the sec argument is greater than 60.0.  However, in a day ending
 *    in a leap second the limit changes to 61.0 (or 59.0 in the case
 *    of a negative leap second).
 *
 * 6) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
 *
 * 7) Only in the case of continuous and regular time scales (TAI, TT,
 *    TCG, TCB and TDB) is the result d1+d2 a Julian Date, strictly
 *    speaking.  In the other cases (UT1 and UTC) the result must be
 *    used with circumspection;  in particular the difference between
 *    two such results cannot be interpreted as a precise time
 *    interval.
 *
 * Called:
 *    cal2jd    Gregorian calendar to JD
 *    dat       delta(AT) = TAI-UTC
 *    jd2cal    JD to Gregorian calendar
 *
 * This revision:  2023 May 6
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function dtf2d(scale, iy, im, id, ihr, imn, sec) {
  let d1 = 0;
  let d2 = 0;
  let js;
  let iy2;
  let im2;
  let id2;
  let dj;
  let w;
  let day;
  let seclim;
  let dat0;
  let dat12;
  let dat24;
  let dleap;
  let time;
  const _r1 = cal2jd(iy, im, id);
  dj = _r1.djm0;
  w = _r1.djm;
  js = _r1.status;
  if (js) {
    return { d1, d2, status: js };
  }
  dj += w;
  day = DAYSEC;
  seclim = 60.0;
  if (!strcmp(scale, "UTC")) {
    const _r2 = dat(iy, im, id, 0.0);
    dat0 = _r2.deltat;
    js = _r2.status;
    if (js < 0) {
      return { d1, d2, status: js };
    }
    const _r3 = dat(iy, im, id, 0.5);
    dat12 = _r3.deltat;
    js = _r3.status;
    if (js < 0) {
      return { d1, d2, status: js };
    }
    const _r4 = jd2cal(dj, 1.5);
    iy2 = _r4.iy;
    im2 = _r4.im;
    id2 = _r4.id;
    w = _r4.fd;
    js = _r4.status;
    if (js) {
      return { d1, d2, status: js };
    }
    const _r5 = dat(iy2, im2, id2, 0.0);
    dat24 = _r5.deltat;
    js = _r5.status;
    if (js < 0) {
      return { d1, d2, status: js };
    }
    dleap = dat24 - (2.0 * dat12 - dat0);
    day += dleap;
    if (ihr == 23 && imn == 59) {
      seclim += dleap;
    }
  }
  if (ihr >= 0 && ihr <= 23) {
    if (imn >= 0 && imn <= 59) {
      if (sec >= 0.0) {
        if (sec >= seclim) {
          js += 2;
        }
      } else {
        js = -6;
      }
    } else {
      js = -5;
    }
  } else {
    js = -4;
  }
  if (js < 0) {
    return { d1, d2, status: js };
  }
  time = (60.0 * (60 * ihr + imn) + sec) / day;
  d1 = dj;
  d2 = time;
  return { d1, d2, status: js };
}
