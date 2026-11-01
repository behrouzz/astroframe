// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file jdcalf.c.
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

import { dnint } from './util.js';
import { jd2cal } from './jd2cal.js';

/**
 * JS usage:  const { iymdf, status } = jdcalf(ndp, dj1, dj2)
 *
 * Julian Date to Gregorian Calendar, expressed in a form convenient
 * for formatting messages:  rounded to a specified precision.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ndp       int      number of decimal places of days in fraction
 *    dj1,dj2   double   dj1+dj2 = Julian Date (Note 1)
 *
 * Returned:
 *    iymdf     int[4]   year, month, day, fraction in Gregorian
 *                       calendar
 *
 * Returned (function value):
 *              int      status:
 *                         -1 = date out of range
 *                          0 = OK
 *                         +1 = ndp not 0-9 (interpreted as 0)
 *
 * Notes:
 *
 * 1) The Julian Date is apportioned in any convenient way between
 *    the arguments dj1 and dj2.  For example, JD=2450123.7 could
 *    be expressed in any of these ways, among others:
 *
 *            dj1            dj2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 * 2) In early eras the conversion is from the "Proleptic Gregorian
 *    Calendar";  no account is taken of the date(s) of adoption of
 *    the Gregorian Calendar, nor is the AD/BC numbering convention
 *    observed.
 *
 * 3) See also the function jd2cal.
 *
 * 4) The number of decimal places ndp should be 4 or less if internal
 *    overflows are to be avoided on platforms which use 16-bit
 *    integers.
 *
 * Called:
 *    jd2cal    JD to Gregorian calendar
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 12.92 (p604).
 *
 * This revision:  2023 January 16
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function jdcalf(ndp, dj1, dj2) {
  let iymdf = [0, 0, 0, 0];
  let j;
  let js;
  let denom;
  let d1;
  let d2;
  let f1;
  let f2;
  let d;
  let djd;
  let f;
  let rf;
  if (ndp >= 0 && ndp <= 9) {
    j = 0;
    denom = Math.pow(10.0, ndp);
  } else {
    j = 1;
    denom = 1.0;
  }
  if (Math.abs(dj1) >= Math.abs(dj2)) {
    d1 = dj1;
    d2 = dj2;
  } else {
    d1 = dj2;
    d2 = dj1;
  }
  d1 -= 0.5;
  d = dnint(d1);
  f1 = d1 - d;
  djd = d;
  d = dnint(d2);
  f2 = d2 - d;
  djd += d;
  d = dnint(f1 + f2);
  f = f1 - d + f2;
  if (f < 0.0) {
    f += 1.0;
    d -= 1.0;
  }
  djd += d;
  rf = dnint(f * denom) / denom;
  djd += 0.5;
  const _r1 = jd2cal(djd, rf);
  iymdf[0] = _r1.iy;
  iymdf[1] = _r1.im;
  iymdf[2] = _r1.id;
  f = _r1.fd;
  js = _r1.status;
  if (js == 0) {
    iymdf[3] = Math.trunc(dnint(f * denom));
  } else {
    j = js;
  }
  return { iymdf, status: j };
}
