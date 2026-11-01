// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file jd2cal.c.
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

import { dnint, gmax } from './util.js';

/**
 * JS usage:  const { iy, im, id, fd, status } = jd2cal(dj1, dj2)
 *
 * Julian Date to Gregorian year, month, day, and fraction of a day.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    dj1,dj2   double   Julian Date (Notes 1, 2)
 *
 * Returned (arguments):
 *    iy        int      year
 *    im        int      month
 *    id        int      day
 *    fd        double   fraction of day
 *
 * Returned (function value):
 *              int      status:
 *                          0 = OK
 *                         -1 = unacceptable date (Note 1)
 *
 * Notes:
 *
 * 1) The earliest valid date is -68569.5 (-4900 March 1).  The
 *    largest value accepted is 1e9.
 *
 * 2) The Julian Date is apportioned in any convenient way between
 *    the arguments dj1 and dj2.  For example, JD=2450123.7 could
 *    be expressed in any of these ways, among others:
 *
 *           dj1             dj2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    Separating integer and fraction uses the "compensated summation"
 *    algorithm of Kahan-Neumaier to preserve as much precision as
 *    possible irrespective of the jd1+jd2 apportionment.
 *
 * 3) In early eras the conversion is from the "proleptic Gregorian
 *    calendar";  no account is taken of the date(s) of adoption of
 *    the Gregorian calendar, nor is the AD/BC numbering convention
 *    observed.
 *
 * References:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 12.92 (p604).
 *
 *    Klein, A., A Generalized Kahan-Babuska-Summation-Algorithm.
 *    Computing, 76, 279-293 (2006), Section 3.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function jd2cal(dj1, dj2) {
  let iy = 0;
  let im = 0;
  let id = 0;
  let fd = 0;
  const DJMIN = -68569.5;
  const DJMAX = 1e9;
  let jd;
  let i;
  let l;
  let n;
  let k;
  let dj;
  let f1;
  let f2;
  let d;
  let s;
  let cs;
  let v = [0, 0];
  let x;
  let t;
  let f;
  dj = dj1 + dj2;
  if (dj < DJMIN || dj > DJMAX) {
    return { iy, im, id, fd, status: -1 };
  }
  d = dnint(dj1);
  f1 = dj1 - d;
  jd = Math.trunc(d);
  d = dnint(dj2);
  f2 = dj2 - d;
  jd += Math.trunc(d);
  s = 0.5;
  cs = 0.0;
  v[0] = f1;
  v[1] = f2;
  for (i = 0; i < 2; i++) {
    x = v[i];
    t = s + x;
    cs += Math.abs(s) >= Math.abs(x) ? s - t + x : x - t + s;
    s = t;
    if (s >= 1.0) {
      jd++;
      s -= 1.0;
    }
  }
  f = s + cs;
  cs = f - s;
  if (f < 0.0) {
    f = s + 1.0;
    cs += 1.0 - f + s;
    s = f;
    f = s + cs;
    cs = f - s;
    jd--;
  }
  if (f - 1.0 >= -Number.EPSILON / 4.0) {
    t = s - 1.0;
    cs += s - t - 1.0;
    s = t;
    f = s + cs;
    if (-Number.EPSILON / 2.0 < f) {
      jd++;
      f = gmax(f, 0.0);
    }
  }
  l = jd + 68569;
  n = Math.trunc(4 * l / 146097);
  l -= Math.trunc((146097 * n + 3) / 4);
  i = Math.trunc(4000 * (l + 1) / 1461001);
  l -= Math.trunc(1461 * i / 4) - 31;
  k = Math.trunc(80 * l / 2447);
  id = l - Math.trunc(2447 * k / 80);
  l = Math.trunc(k / 11);
  im = k + 2 - 12 * l;
  iy = 100 * (n - 49) + i + l;
  fd = f;
  return { iy, im, id, fd, status: 0 };
}
