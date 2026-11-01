// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file d2dtf.c.
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
import { d2tf } from './d2tf.js';
import { dat } from './dat.js';
import { jd2cal } from './jd2cal.js';

/**
 * JS usage:  const { iy, im, id, ihmsf, status } = d2dtf(scale, ndp, d1, d2)
 *
 * Format for output a 2-part Julian Date (or in the case of UTC a
 * quasi-JD form that includes special provision for leap seconds).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    scale     char[]  time scale ID (Note 1)
 *    ndp       int     resolution (Note 2)
 *    d1,d2     double  time as a 2-part Julian Date (Notes 3,4)
 *
 * Returned:
 *    iy,im,id  int     year, month, day in Gregorian calendar (Note 5)
 *    ihmsf     int[4]  hours, minutes, seconds, fraction (Note 1)
 *
 * Returned (function value):
 *              int     status: +1 = dubious year (Note 5)
 *                               0 = OK
 *                              -1 = unacceptable date (Note 6)
 *
 * Notes:
 *
 * 1) scale identifies the time scale.  Only the value "UTC" (in upper
 *    case) is significant, and enables handling of leap seconds (see
 *    Note 4).
 *
 * 2) ndp is the number of decimal places in the seconds field, and can
 *    have negative as well as positive values, such as:
 *
 *    ndp         resolution
 *    -4            1 00 00
 *    -3            0 10 00
 *    -2            0 01 00
 *    -1            0 00 10
 *     0            0 00 01
 *     1            0 00 00.1
 *     2            0 00 00.01
 *     3            0 00 00.001
 *
 *    The limits are platform dependent, but a safe range is -5 to +9.
 *
 * 3) d1+d2 is Julian Date, apportioned in any convenient way between
 *    the two arguments, for example where d1 is the Julian Day Number
 *    and d2 is the fraction of a day.  In the case of UTC, where the
 *    use of JD is problematical, special conventions apply:  see the
 *    next note.
 *
 * 4) JD cannot unambiguously represent UTC during a leap second unless
 *    special measures are taken.  The SOFA internal convention is that
 *    the quasi-JD day represents UTC days whether the length is 86399,
 *    86400 or 86401 SI seconds.  In the 1960-1972 era there were
 *    smaller jumps (in either direction) each time the linear UTC(TAI)
 *    expression was changed, and these "mini-leaps" are also included
 *    in the SOFA convention.
 *
 * 5) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
 *
 * 6) For calendar conventions and limitations, see cal2jd.
 *
 * Called:
 *    jd2cal    JD to Gregorian calendar
 *    d2tf      decompose days to hms
 *    dat       delta(AT) = TAI-UTC
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function d2dtf(scale, ndp, d1, d2) {
  let iy = 0;
  let im = 0;
  let id = 0;
  let ihmsf = [0, 0, 0, 0];
  let leap;
  let s;
  let iy1;
  let im1;
  let id1;
  let js;
  let iy2;
  let im2;
  let id2;
  let ihmsf1 = [0, 0, 0, 0];
  let i;
  let a1;
  let b1;
  let fd;
  let dat0;
  let dat12;
  let w;
  let dat24;
  let dleap;
  a1 = d1;
  b1 = d2;
  const _r1 = jd2cal(a1, b1);
  iy1 = _r1.iy;
  im1 = _r1.im;
  id1 = _r1.id;
  fd = _r1.fd;
  js = _r1.status;
  if (js) {
    return { iy, im, id, ihmsf, status: -1 };
  }
  leap = 0;
  if (!strcmp(scale, "UTC")) {
    const _r2 = dat(iy1, im1, id1, 0.0);
    dat0 = _r2.deltat;
    js = _r2.status;
    if (js < 0) {
      return { iy, im, id, ihmsf, status: -1 };
    }
    const _r3 = dat(iy1, im1, id1, 0.5);
    dat12 = _r3.deltat;
    js = _r3.status;
    if (js < 0) {
      return { iy, im, id, ihmsf, status: -1 };
    }
    const _r4 = jd2cal(a1 + 1.5, b1 - fd);
    iy2 = _r4.iy;
    im2 = _r4.im;
    id2 = _r4.id;
    w = _r4.fd;
    js = _r4.status;
    if (js) {
      return { iy, im, id, ihmsf, status: -1 };
    }
    const _r5 = dat(iy2, im2, id2, 0.0);
    dat24 = _r5.deltat;
    js = _r5.status;
    if (js < 0) {
      return { iy, im, id, ihmsf, status: -1 };
    }
    dleap = dat24 - (2.0 * dat12 - dat0);
    leap = (Math.abs(dleap) > 0.5 ? 1 : 0);
    if (leap) {
      fd += fd * dleap / DAYSEC;
    }
  }
  const _r6 = d2tf(ndp, fd);
  s = _r6.sign;
  ihmsf1 = _r6.ihmsf;
  if (ihmsf1[0] > 23) {
    const _r7 = jd2cal(a1 + 1.5, b1 - fd);
    iy2 = _r7.iy;
    im2 = _r7.im;
    id2 = _r7.id;
    w = _r7.fd;
    js = _r7.status;
    if (js) {
      return { iy, im, id, ihmsf, status: -1 };
    }
    if (!leap) {
      iy1 = iy2;
      im1 = im2;
      id1 = id2;
      ihmsf1[0] = 0;
      ihmsf1[1] = 0;
      ihmsf1[2] = 0;
    } else {
      if (ihmsf1[2] > 0) {
        iy1 = iy2;
        im1 = im2;
        id1 = id2;
        ihmsf1[0] = 0;
        ihmsf1[1] = 0;
        ihmsf1[2] = 0;
      } else {
        ihmsf1[0] = 23;
        ihmsf1[1] = 59;
        ihmsf1[2] = 60;
      }
      if (ndp < 0 && ihmsf1[2] == 60) {
        iy1 = iy2;
        im1 = im2;
        id1 = id2;
        ihmsf1[0] = 0;
        ihmsf1[1] = 0;
        ihmsf1[2] = 0;
      }
    }
  }
  iy = iy1;
  im = im1;
  id = id1;
  for (i = 0; i < 4; i++) {
    ihmsf[i] = ihmsf1[i];
  }
  return { iy, im, id, ihmsf, status: js };
}
