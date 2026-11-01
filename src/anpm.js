// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file anpm.c.
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

import { D2PI, DPI } from './constants.js';
import { dsign } from './util.js';

/**
 * JS usage:  const result = anpm(a)
 *
 * Normalize angle into the range -pi <= a < +pi.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a        double     angle (radians)
 *
 * Returned (function value):
 *             double     angle in range +/-pi
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function anpm(a) {
  let w;
  w = a % D2PI;
  if (Math.abs(w) >= DPI) {
    w -= dsign(D2PI, a);
  }
  return w;
}
