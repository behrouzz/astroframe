// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file utcut1.c.
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

import { dat } from './dat.js';
import { jd2cal } from './jd2cal.js';
import { taiut1 } from './taiut1.js';
import { utctai } from './utctai.js';

/**
 * JS usage:  const { ut11, ut12, status } = utcut1(utc1, utc2, dut1)
 *
 * Time scale transformation:  Coordinated Universal Time, UTC, to
 * Universal Time, UT1.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    utc1,utc2  double   UTC as a 2-part quasi Julian Date (Notes 1-4)
 *    dut1       double   Delta UT1 = UT1-UTC in seconds (Note 5)
 *
 * Returned:
 *    ut11,ut12  double   UT1 as a 2-part Julian Date (Note 6)
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
 *    length is 86399, 86400 or 86401 SI seconds.
 *
 * 3) The warning status "dubious year" flags UTCs that predate the
 *    introduction of the time scale or that are too far in the future
 *    to be trusted.  See dat for further details.
 *
 * 4) The function dtf2d converts from calendar date and time of
 *    day into 2-part Julian Date, and in the case of UTC implements
 *    the leap-second-ambiguity convention described above.
 *
 * 5) Delta UT1 can be obtained from tabulations provided by the
 *    International Earth Rotation and Reference Systems Service.
 *    It is the caller's responsibility to supply a dut1 argument
 *    containing the UT1-UTC value that matches the given UTC.
 *
 * 6) The returned ut11,ut12 are such that their sum is the UT1 Julian
 *    Date.
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992)
 *
 * Called:
 *    jd2cal    JD to Gregorian calendar
 *    dat       delta(AT) = TAI-UTC
 *    utctai    UTC to TAI
 *    taiut1    TAI to UT1
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function utcut1(utc1, utc2, dut1) {
  let ut11 = 0;
  let ut12 = 0;
  let iy;
  let im;
  let id;
  let js;
  let jw;
  let w;
  let dat_;
  let dta;
  let tai1;
  let tai2;
  const _r1 = jd2cal(utc1, utc2);
  iy = _r1.iy;
  im = _r1.im;
  id = _r1.id;
  w = _r1.fd;
  if (_r1.status) {
    return { ut11, ut12, status: -1 };
  }
  const _r2 = dat(iy, im, id, 0.0);
  dat_ = _r2.deltat;
  js = _r2.status;
  if (js < 0) {
    return { ut11, ut12, status: -1 };
  }
  dta = dut1 - dat_;
  const _r3 = utctai(utc1, utc2);
  tai1 = _r3.tai1;
  tai2 = _r3.tai2;
  jw = _r3.status;
  if (jw < 0) {
    return { ut11, ut12, status: -1 };
  } else if (jw > 0) {
    js = jw;
  }
  const _r4 = taiut1(tai1, tai2, dta);
  ut11 = _r4.ut11;
  ut12 = _r4.ut12;
  if (_r4.status) {
    return { ut11, ut12, status: -1 };
  }
  return { ut11, ut12, status: js };
}
