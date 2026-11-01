// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pvxpv.c.
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

import { cpv } from './cpv.js';
import { ppp } from './ppp.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const axb = pvxpv(a, b)
 *
 * Outer (=vector=cross) product of two pv-vectors.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a        double[2][3]      first pv-vector
 *    b        double[2][3]      second pv-vector
 *
 * Returned:
 *    axb      double[2][3]      a x b
 *
 * Notes:
 *
 * 1) If the position and velocity components of the two pv-vectors are
 *    ( ap, av ) and ( bp, bv ), the result, a x b, is the pair of
 *    vectors ( ap x bp, ap x bv + av x bp ).  The two vectors are the
 *    cross-product of the two p-vectors and its derivative.
 *
 * 2) It is permissible to re-use the same array for any of the
 *    arguments.
 *
 * Called:
 *    cpv       copy pv-vector
 *    pxp       vector product of two p-vectors
 *    ppp       p-vector plus p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pvxpv(a, b) {
  let axb = [[0, 0, 0], [0, 0, 0]];
  let wa = [[0, 0, 0], [0, 0, 0]];
  let wb = [[0, 0, 0], [0, 0, 0]];
  let axbd = [0, 0, 0];
  let adxb = [0, 0, 0];
  wa = cpv(a);
  wb = cpv(b);
  axb[0] = pxp(wa[0], wb[0]);
  axbd = pxp(wa[0], wb[1]);
  adxb = pxp(wa[1], wb[0]);
  axb[1] = ppp(axbd, adxb);
  return axb;
}
