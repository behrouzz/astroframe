// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file atciq.c.
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

import { ab } from './ab.js';
import { anp } from './anp.js';
import { c2s } from './c2s.js';
import { ldsun } from './ldsun.js';
import { pmpx } from './pmpx.js';
import { rxp } from './rxp.js';

/**
 * JS usage:  const { ri, di } = atciq(rc, dc, pr, pd, px, rv, astrom)
 *
 * Quick ICRS, epoch J2000.0, to CIRS transformation, given precomputed
 * star-independent astrometry parameters.
 *
 * Use of this function is appropriate when efficiency is important and
 * where many star positions are to be transformed for one date.  The
 * star-independent parameters can be obtained by calling one of the
 * functions apci[13], apcg[13], apco[13] or apcs[13].
 *
 * If the parallax and proper motions are zero the atciqz function
 * can be used instead.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rc,dc  double     ICRS RA,Dec at J2000.0 (radians, Note 1)
 *    pr     double     RA proper motion (radians/year, Note 2)
 *    pd     double     Dec proper motion (radians/year)
 *    px     double     parallax (arcsec)
 *    rv     double     radial velocity (km/s, +ve if receding)
 *    astrom aSTROM* star-independent astrometry parameters:
 *     pmt    double       PM time interval (SSB, Julian years)
 *     eb     double[3]    SSB to observer (vector, au)
 *     eh     double[3]    Sun to observer (unit vector)
 *     em     double       distance from Sun to observer (au)
 *     v      double[3]    barycentric observer velocity (vector, c)
 *     bm1    double       sqrt(1-|v|^2): reciprocal of Lorenz factor
 *     bpn    double[3][3] bias-precession-nutation matrix
 *     along  double       longitude + s' (radians)
 *     xpl    double       polar motion xp wrt local meridian (radians)
 *     ypl    double       polar motion yp wrt local meridian (radians)
 *     sphi   double       sine of geodetic latitude
 *     cphi   double       cosine of geodetic latitude
 *     diurab double       magnitude of diurnal aberration vector
 *     eral   double       "local" Earth rotation angle (radians)
 *     refa   double       refraction constant A (radians)
 *     refb   double       refraction constant B (radians)
 *
 * Returned:
 *    ri,di   double    CIRS RA,Dec (radians)
 *
 * Notes:
 *
 * 1) Star data for an epoch other than J2000.0 (for example from the
 *    Hipparcos catalog, which has an epoch of J1991.25) will require a
 *    preliminary call to pmsafe before use.
 *
 * 2) The proper motion in RA is dRA/dt rather than cos(Dec)*dRA/dt.
 *
 * Called:
 *    pmpx      proper motion and parallax
 *    ldsun     light deflection by the Sun
 *    ab        stellar aberration
 *    rxp       product of r-matrix and pv-vector
 *    c2s       p-vector to spherical
 *    anp       normalize angle into range 0 to 2pi
 *
 * This revision:   2021 April 19
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function atciq(rc, dc, pr, pd, px, rv, astrom) {
  let ri = 0;
  let di = 0;
  let pco = [0, 0, 0];
  let pnat = [0, 0, 0];
  let ppr = [0, 0, 0];
  let pi = [0, 0, 0];
  let w;
  pco = pmpx(rc, dc, pr, pd, px, rv, astrom.pmt, astrom.eb);
  pnat = ldsun(pco, astrom.eh, astrom.em);
  ppr = ab(pnat, astrom.v, astrom.em, astrom.bm1);
  pi = rxp(astrom.bpn, ppr);
  const _r1 = c2s(pi);
  w = _r1.theta;
  di = _r1.phi;
  ri = anp(w);
  return { ri, di };
}
