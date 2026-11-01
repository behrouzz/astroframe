// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pn.c.
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

import { pm } from './pm.js';
import { sxp } from './sxp.js';
import { zp } from './zp.js';

/**
 * JS usage:  const { r, u } = pn(p)
 *
 * Convert a p-vector into modulus and unit vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    p        double[3]      p-vector
 *
 * Returned:
 *    r        double         modulus
 *    u        double[3]      unit vector
 *
 * Notes:
 *
 * 1) If p is null, the result is null.  Otherwise the result is a unit
 *    vector.
 *
 * 2) It is permissible to re-use the same array for any of the
 *    arguments.
 *
 * Called:
 *    pm        modulus of p-vector
 *    zp        zero p-vector
 *    sxp       multiply p-vector by scalar
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pn(p) {
  let r = 0;
  let u = [0, 0, 0];
  let w;
  w = pm(p);
  if (w == 0.0) {
    u = zp();
  } else {
    u = sxp(1.0 / w, p);
  }
  r = w;
  return { r, u };
}
