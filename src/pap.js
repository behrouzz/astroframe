// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pap.c.
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
import { pmp } from './pmp.js';
import { pn } from './pn.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const result = pap(a, b)
 *
 * Position-angle from two p-vectors.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    a      double[3]  direction of reference point
 *    b      double[3]  direction of point whose PA is required
 *
 * Returned (function value):
 *           double     position angle of b with respect to a (radians)
 *
 * Notes:
 *
 * 1) The result is the position angle, in radians, of direction b with
 *    respect to direction a.  It is in the range -pi to +pi.  The
 *    sense is such that if b is a small distance "north" of a the
 *    position angle is approximately zero, and if b is a small
 *    distance "east" of a the position angle is approximately +pi/2.
 *
 * 2) The vectors a and b need not be of unit length.
 *
 * 3) Zero is returned if the two directions are the same or if either
 *    vector is null.
 *
 * 4) If vector a is at a pole, the result is ill-defined.
 *
 * Called:
 *    pn        decompose p-vector into modulus and direction
 *    pm        modulus of p-vector
 *    pxp       vector product of two p-vectors
 *    pmp       p-vector minus p-vector
 *    pdp       scalar product of two p-vectors
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pap(a, b) {
  let am;
  let au = [0, 0, 0];
  let bm;
  let st;
  let ct;
  let xa;
  let ya;
  let za;
  let eta = [0, 0, 0];
  let xi = [0, 0, 0];
  let a2b = [0, 0, 0];
  let pa;
  const _r1 = pn(a);
  am = _r1.r;
  au = _r1.u;
  bm = pm(b);
  if (am == 0.0 || bm == 0.0) {
    st = 0.0;
    ct = 1.0;
  } else {
    xa = a[0];
    ya = a[1];
    za = a[2];
    eta[0] = -xa * za;
    eta[1] = -ya * za;
    eta[2] = xa * xa + ya * ya;
    xi = pxp(eta, au);
    a2b = pmp(b, a);
    st = pdp(a2b, xi);
    ct = pdp(a2b, eta);
    if (st == 0.0 && ct == 0.0) {
      ct = 1.0;
    }
  }
  pa = Math.atan2(st, ct);
  return pa;
}
