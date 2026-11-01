// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ltecm.c.
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
import { ltpecl } from './ltpecl.js';
import { ltpequ } from './ltpequ.js';
import { pn } from './pn.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const rm = ltecm(epj)
 *
 * ICRS equatorial to ecliptic rotation matrix, long-term.
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
 *    rm      double[3][3]   ICRS to ecliptic rotation matrix
 *
 * Notes:
 *
 * 1) The matrix is in the sense
 *
 *       E_ep = rm x P_ICRS,
 *
 *    where P_ICRS is a vector with respect to ICRS right ascension
 *    and declination axes and E_ep is the same vector with respect to
 *    the (inertial) ecliptic and equinox of epoch epj.
 *
 * 2) P_ICRS is a free vector, merely a direction, typically of unit
 *    magnitude, and not bound to any particular spatial origin, such
 *    as the Earth, Sun or SSB.  No assumptions are made about whether
 *    it represents starlight and embodies astrometric effects such as
 *    parallax or aberration.  The transformation is approximately that
 *    between mean J2000.0 right ascension and declination and ecliptic
 *    longitude and latitude, with only frame bias (always less than
 *    25 mas) to disturb this classical picture.
 *
 * 3) The Vondrak et al. (2011, 2012) 400 millennia precession model
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
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ltecm(epj) {
  let rm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const dx = -0.016617 * DAS2R;
  const de = -0.0068192 * DAS2R;
  const dr = -0.0146 * DAS2R;
  let p = [0, 0, 0];
  let z = [0, 0, 0];
  let w = [0, 0, 0];
  let s;
  let x = [0, 0, 0];
  let y = [0, 0, 0];
  p = ltpequ(epj);
  z = ltpecl(epj);
  w = pxp(p, z);
  const _r1 = pn(w);
  s = _r1.r;
  x = _r1.u;
  y = pxp(z, x);
  rm[0][0] = x[0] - x[1] * dr + x[2] * dx;
  rm[0][1] = x[0] * dr + x[1] + x[2] * de;
  rm[0][2] = -x[0] * dx - x[1] * de + x[2];
  rm[1][0] = y[0] - y[1] * dr + y[2] * dx;
  rm[1][1] = y[0] * dr + y[1] + y[2] * de;
  rm[1][2] = -y[0] * dx - y[1] * de + y[2];
  rm[2][0] = z[0] - z[1] * dr + z[2] * dx;
  rm[2][1] = z[0] * dr + z[1] + z[2] * de;
  rm[2][2] = -z[0] * dx - z[1] * de + z[2];
  return rm;
}
