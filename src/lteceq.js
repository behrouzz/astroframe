// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file lteceq.c.
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

import { anp } from './anp.js';
import { anpm } from './anpm.js';
import { c2s } from './c2s.js';
import { ltecm } from './ltecm.js';
import { s2c } from './s2c.js';
import { trxp } from './trxp.js';

/**
 * JS usage:  const { dr, dd } = lteceq(epj, dl, db)
 *
 * Transformation from ecliptic coordinates (mean equinox and ecliptic
 * of date) to ICRS RA,Dec, using a long-term precession model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    epj     double     Julian epoch (TT)
 *    dl,db   double     ecliptic longitude and latitude (radians)
 *
 * Returned:
 *    dr,dd   double     ICRS right ascension and declination (radians)
 *
 * 1) No assumptions are made about whether the coordinates represent
 *    starlight and embody astrometric effects such as parallax or
 *    aberration.
 *
 * 2) The transformation is approximately that from ecliptic longitude
 *    and latitude (mean equinox and ecliptic of date) to mean J2000.0
 *    right ascension and declination, with only frame bias (always
 *    less than 25 mas) to disturb this classical picture.
 *
 * 3) The Vondrak et al. (2011, 2012) 400 millennia precession model
 *    agrees with the IAU 2006 precession at J2000.0 and stays within
 *    100 microarcseconds during the 20th and 21st centuries.  It is
 *    accurate to a few arcseconds throughout the historical period,
 *    worsening to a few tenths of a degree at the end of the
 *    +/- 200,000 year time span.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    ltecm     J2000.0 to ecliptic rotation matrix, long term
 *    trxp      product of transpose of r-matrix and p-vector
 *    c2s       unit vector to spherical coordinates
 *    anp       normalize angle into range 0 to 2pi
 *    anpm      normalize angle into range +/- pi
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
export function lteceq(epj, dl, db) {
  let dr = 0;
  let dd = 0;
  let rm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let v1 = [0, 0, 0];
  let v2 = [0, 0, 0];
  let a;
  let b;
  v1 = s2c(dl, db);
  rm = ltecm(epj);
  v2 = trxp(rm, v1);
  const _r1 = c2s(v2);
  a = _r1.theta;
  b = _r1.phi;
  dr = anp(a);
  dd = anpm(b);
  return { dr, dd };
}
