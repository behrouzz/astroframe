// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file cal2jd.c.
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

import { DJM0 } from './constants.js';

const mtab = [
  31, 28, 31, 30, 31, 30, 31, 31,
  30, 31, 30, 31,
];

/**
 * JS usage:  const { djm0, djm, status } = cal2jd(iy, im, id)
 *
 * Gregorian Calendar to Julian Date.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    iy,im,id  int     year, month, day in Gregorian calendar (Note 1)
 *
 * Returned:
 *    djm0      double  MJD zero-point: always 2400000.5
 *    djm       double  Modified Julian Date for 0 hrs
 *
 * Returned (function value):
 *              int     status:
 *                          0 = OK
 *                         -1 = bad year   (Note 3: JD not computed)
 *                         -2 = bad month  (JD not computed)
 *                         -3 = bad day    (JD computed)
 *
 * Notes:
 *
 * 1) The algorithm used is valid from -4800 March 1, but this
 *    implementation rejects dates before -4799 January 1.
 *
 * 2) The Julian Date is returned in two pieces, in the usual SOFA
 *    manner, which is designed to preserve time resolution.  The
 *    Julian Date is available as a single number by adding djm0 and
 *    djm.
 *
 * 3) In early eras the conversion is from the "Proleptic Gregorian
 *    Calendar";  no account is taken of the date(s) of adoption of
 *    the Gregorian Calendar, nor is the AD/BC numbering convention
 *    observed.
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 12.92 (p604).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function cal2jd(iy, im, id) {
  let djm0 = 0;
  let djm = 0;
  let j;
  let ly;
  let my;
  let iypmy;
  const IYMIN = -4799;
  j = 0;
  if (iy < IYMIN) {
    return { djm0, djm, status: -1 };
  }
  if (im < 1 || im > 12) {
    return { djm0, djm, status: -2 };
  }
  ly = (im == 2 && !(iy % 4) && (iy % 100 || !(iy % 400)) ? 1 : 0);
  if (id < 1 || id > mtab[im - 1] + ly) {
    j = -3;
  }
  my = Math.trunc((im - 14) / 12);
  iypmy = iy + my;
  djm0 = DJM0;
  djm = Math.trunc(1461 * (iypmy + 4800) / 4) + Math.trunc(367 * (im - 2 - 12 * my) / 12) - Math.trunc(3 * Math.trunc((iypmy + 4900) / 100) / 4) + id - 2432076;
  return { djm0, djm, status: j };
}
