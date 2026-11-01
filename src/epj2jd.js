// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file epj2jd.c.
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

import { DJM0, DJM00 } from './constants.js';

/**
 * JS usage:  const { djm0, djm } = epj2jd(epj)
 *
 * Julian Epoch to Julian Date.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    epj      double    Julian Epoch (e.g. 1996.8)
 *
 * Returned:
 *    djm0     double    MJD zero-point: always 2400000.5
 *    djm      double    Modified Julian Date
 *
 * Note:
 *
 *    The Julian Date is returned in two pieces, in the usual SOFA
 *    manner, which is designed to preserve time resolution.  The
 *    Julian Date is available as a single number by adding djm0 and
 *    djm.
 *
 * Reference:
 *
 *    Lieske, J.H., 1979, Astron.Astrophys. 73, 282.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function epj2jd(epj) {
  let djm0 = 0;
  let djm = 0;
  djm0 = DJM0;
  djm = DJM00 + (epj - 2000.0) * 365.25;
  return { djm0, djm };
}
