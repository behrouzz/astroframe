// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pvdpv.c.
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

import { pdp } from './pdp.js';

/**
 * JS usage:  const adb = pvdpv(a, b)
 *
 * Inner (=scalar=dot) product of two pv-vectors.
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
 *    adb      double[2]         a . b (see note)
 *
 * Note:
 *
 *    If the position and velocity components of the two pv-vectors are
 *    ( ap, av ) and ( bp, bv ), the result, a . b, is the pair of
 *    numbers ( ap . bp , ap . bv + av . bp ).  The two numbers are the
 *    dot-product of the two p-vectors and its derivative.
 *
 * Called:
 *    pdp       scalar product of two p-vectors
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pvdpv(a, b) {
  let adb = [0, 0];
  let adbd;
  let addb;
  adb[0] = pdp(a[0], b[0]);
  adbd = pdp(a[0], b[1]);
  addb = pdp(a[1], b[0]);
  adb[1] = adbd + addb;
  return adb;
}
