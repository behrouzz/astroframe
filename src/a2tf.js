// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file a2tf.c.
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

import { D2PI } from './constants.js';
import { d2tf } from './d2tf.js';

/**
 * JS usage:  const { sign, ihmsf } = a2tf(ndp, angle)
 *
 * Decompose radians into hours, minutes, seconds, fraction.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    ndp     int     resolution (Note 1)
 *    angle   double  angle in radians
 *
 * Returned:
 *    sign    char*   '+' or '-'
 *    ihmsf   int[4]  hours, minutes, seconds, fraction
 *
 * Notes:
 *
 * 1) The argument ndp is interpreted as follows:
 *
 *    ndp         resolution
 *     :      ...0000 00 00
 *    -7         1000 00 00
 *    -6          100 00 00
 *    -5           10 00 00
 *    -4            1 00 00
 *    -3            0 10 00
 *    -2            0 01 00
 *    -1            0 00 10
 *     0            0 00 01
 *     1            0 00 00.1
 *     2            0 00 00.01
 *     3            0 00 00.001
 *     :            0 00 00.000...
 *
 * 2) The largest positive useful value for ndp is determined by the
 *    size of angle, the format of doubles on the target platform, and
 *    the risk of overflowing ihmsf[3].  On a typical platform, for
 *    angle up to 2pi, the available floating-point precision might
 *    correspond to ndp=12.  However, the practical limit is typically
 *    ndp=9, set by the capacity of a 32-bit int, or ndp=4 if int is
 *    only 16 bits.
 *
 * 3) The absolute value of angle may exceed 2pi.  In cases where it
 *    does not, it is up to the caller to test for and handle the
 *    case where angle is very nearly 2pi and rounds up to 24 hours,
 *    by testing for ihmsf[0]=24 and setting ihmsf[0-3] to zero.
 *
 * Called:
 *    d2tf      decompose days to hms
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function a2tf(ndp, angle) {
  let sign = '';
  let ihmsf = [0, 0, 0, 0];
  const _r1 = d2tf(ndp, angle / D2PI);
  sign = _r1.sign;
  ihmsf = _r1.ihmsf;
  return { sign, ihmsf };
}
