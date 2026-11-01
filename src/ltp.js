// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ltp.c.
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

import { ltpecl } from './ltpecl.js';
import { ltpequ } from './ltpequ.js';
import { pn } from './pn.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const rp = ltp(epj)
 *
 * Long-term precession matrix.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    epj     double         Julian epoch (TT)
 *
 * Returned:
 *    rp      double[3][3]   precession matrix, J2000.0 to date
 *
 * Notes:
 *
 * 1) The matrix is in the sense
 *
 *       P_date = rp x P_J2000,
 *
 *    where P_J2000 is a vector with respect to the J2000.0 mean
 *    equator and equinox and P_date is the same vector with respect to
 *    the mean equator and equinox of epoch epj.
 *
 * 2) The Vondrak et al. (2011, 2012) 400 millennia precession model
 *    agrees with the IAU 2006 precession at J2000.0 and stays within
 *    100 microarcseconds during the 20th and 21st centuries.  It is
 *    accurate to a few arcseconds throughout the historical period,
 *    worsening to a few tenths of a degree at the end of the
 *    +/- 200,000 year time span.
 *
 * Called:
 *    ltpequ    equator pole, long term
 *    ltpecl    ecliptic pole, long term
 *    pxp       vector product
 *    pn        normalize vector
 *
 * References:
 *
 *   Vondrak, J., Capitaine, N. and Wallace, P., 2011, New precession
 *   expressions, valid for long time intervals, Astron.Astrophys. 534,
 *   A22
 *
 *   Vondrak, J., Capitaine, N. and Wallace, P., 2012, New precession
 *   expressions, valid for long time intervals (Corrigendum),
 *   Astron.Astrophys. 541, C1
 *
 * This revision:  2023 March 19
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ltp(epj) {
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let i;
  let peqr = [0, 0, 0];
  let pecl = [0, 0, 0];
  let v = [0, 0, 0];
  let w;
  let eqx = [0, 0, 0];
  peqr = ltpequ(epj);
  pecl = ltpecl(epj);
  v = pxp(peqr, pecl);
  const _r1 = pn(v);
  w = _r1.r;
  eqx = _r1.u;
  v = pxp(peqr, eqx);
  for (i = 0; i < 3; i++) {
    rp[0][i] = eqx[i];
    rp[1][i] = v[i];
    rp[2][i] = peqr[i];
  }
  return rp;
}
