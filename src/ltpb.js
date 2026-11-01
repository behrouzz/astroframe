// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ltpb.c.
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

import { DAS2R } from './constants.js';
import { ltp } from './ltp.js';

/**
 * JS usage:  const rpb = ltpb(epj)
 *
 * Long-term precession matrix, including ICRS frame bias.
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
 *    rpb     double[3][3]   precession+bias matrix, J2000.0 to date
 *
 * Notes:
 *
 * 1) The matrix is in the sense
 *
 *       P_date = rpb x P_ICRS,
 *
 *    where P_ICRS is a vector in the Geocentric Celestial Reference
 *    System, and P_date is the vector with respect to the Celestial
 *    Intermediate Reference System at that date but with nutation
 *    neglected.
 *
 * 2) A first order frame bias formulation is used, of sub-
 *    microarcsecond accuracy compared with a full 3D rotation.
 *
 * 3) The Vondrak et al. (2011, 2012) 400 millennia precession model
 *    agrees with the IAU 2006 precession at J2000.0 and stays within
 *    100 microarcseconds during the 20th and 21st centuries.  It is
 *    accurate to a few arcseconds throughout the historical period,
 *    worsening to a few tenths of a degree at the end of the
 *    +/- 200,000 year time span.
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
 * This revision:  2023 March 20
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ltpb(epj) {
  let rpb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const dx = -0.016617 * DAS2R;
  const de = -0.0068192 * DAS2R;
  const dr = -0.0146 * DAS2R;
  let i;
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  rp = ltp(epj);
  for (i = 0; i < 3; i++) {
    rpb[i][0] = rp[i][0] - rp[i][1] * dr + rp[i][2] * dx;
    rpb[i][1] = rp[i][0] * dr + rp[i][1] + rp[i][2] * de;
    rpb[i][2] = -rp[i][0] * dx - rp[i][1] * de + rp[i][2];
  }
  return rpb;
}
