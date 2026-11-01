// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sepp.c.
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
import { pm } from './pm.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const result = sepp(a, b)
 *
 * Angular separation between two p-vectors.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a      double[3]    first p-vector (not necessarily unit length)
 *    b      double[3]    second p-vector (not necessarily unit length)
 *
 * Returned (function value):
 *           double       angular separation (radians, always positive)
 *
 * Notes:
 *
 * 1) If either vector is null, a zero result is returned.
 *
 * 2) The angular separation is most simply formulated in terms of
 *    scalar product.  However, this gives poor accuracy for angles
 *    near zero and pi.  The present algorithm uses both cross product
 *    and dot product, to deliver full accuracy whatever the size of
 *    the angle.
 *
 * Called:
 *    pxp       vector product of two p-vectors
 *    pm        modulus of p-vector
 *    pdp       scalar product of two p-vectors
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function sepp(a, b) {
  let axb = [0, 0, 0];
  let ss;
  let cs;
  let s;
  axb = pxp(a, b);
  ss = pm(axb);
  cs = pdp(a, b);
  s = ss != 0.0 || cs != 0.0 ? Math.atan2(ss, cs) : 0.0;
  return s;
}
