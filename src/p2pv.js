// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file p2pv.c.
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

import { cp } from './cp.js';
import { zp } from './zp.js';

/**
 * JS usage:  const pv = p2pv(p)
 *
 * Extend a p-vector to a pv-vector by appending a zero velocity.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    p        double[3]       p-vector
 *
 * Returned:
 *    pv       double[2][3]    pv-vector
 *
 * Called:
 *    cp        copy p-vector
 *    zp        zero p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function p2pv(p) {
  let pv = [[0, 0, 0], [0, 0, 0]];
  pv[0] = cp(p);
  pv[1] = zp();
  return pv;
}
