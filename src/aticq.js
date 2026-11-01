// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file aticq.c.
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
import { s2c } from './s2c.js';
import { trxp } from './trxp.js';
import { zp } from './zp.js';

/**
 * JS usage:  const { rc, dc } = aticq(ri, di, astrom)
 *
 * Quick CIRS RA,Dec to ICRS astrometric place, given the star-
 * independent astrometry parameters.
 *
 * Use of this function is appropriate when efficiency is important and
 * where many star positions are all to be transformed for one date.
 * The star-independent astrometry parameters can be obtained by
 * calling one of the functions apci[13], apcg[13], apco[13]
 * or apcs[13].
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ri,di  double     CIRS RA,Dec (radians)
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
 *    rc,dc  double     ICRS astrometric RA,Dec (radians)
 *
 * Notes:
 *
 * 1) Only the Sun is taken into account in the light deflection
 *    correction.
 *
 * 2) Iterative techniques are used for the aberration and light
 *    deflection corrections so that the functions atic13 (or
 *    aticq) and atci13 (or atciq) are accurate inverses;
 *    even at the edge of the Sun's disk the discrepancy is only about
 *    1 nanoarcsecond.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    trxp      product of transpose of r-matrix and p-vector
 *    zp        zero p-vector
 *    ab        stellar aberration
 *    ldsun     light deflection by the Sun
 *    c2s       p-vector to spherical
 *    anp       normalize angle into range +/- pi
 *
 * This revision:   2013 October 9
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function aticq(ri, di, astrom) {
  let rc = 0;
  let dc = 0;
  let j;
  let i;
  let pi = [0, 0, 0];
  let ppr = [0, 0, 0];
  let pnat = [0, 0, 0];
  let pco = [0, 0, 0];
  let w;
  let d = [0, 0, 0];
  let before = [0, 0, 0];
  let r2;
  let r;
  let after = [0, 0, 0];
  pi = s2c(ri, di);
  ppr = trxp(astrom.bpn, pi);
  d = zp();
  for (j = 0; j < 2; j++) {
    r2 = 0.0;
    for (i = 0; i < 3; i++) {
      w = ppr[i] - d[i];
      before[i] = w;
      r2 += w * w;
    }
    r = Math.sqrt(r2);
    for (i = 0; i < 3; i++) {
      before[i] /= r;
    }
    after = ab(before, astrom.v, astrom.em, astrom.bm1);
    r2 = 0.0;
    for (i = 0; i < 3; i++) {
      d[i] = after[i] - before[i];
      w = ppr[i] - d[i];
      pnat[i] = w;
      r2 += w * w;
    }
    r = Math.sqrt(r2);
    for (i = 0; i < 3; i++) {
      pnat[i] /= r;
    }
  }
  d = zp();
  for (j = 0; j < 5; j++) {
    r2 = 0.0;
    for (i = 0; i < 3; i++) {
      w = pnat[i] - d[i];
      before[i] = w;
      r2 += w * w;
    }
    r = Math.sqrt(r2);
    for (i = 0; i < 3; i++) {
      before[i] /= r;
    }
    after = ldsun(before, astrom.eh, astrom.em);
    r2 = 0.0;
    for (i = 0; i < 3; i++) {
      d[i] = after[i] - before[i];
      w = pnat[i] - d[i];
      pco[i] = w;
      r2 += w * w;
    }
    r = Math.sqrt(r2);
    for (i = 0; i < 3; i++) {
      pco[i] /= r;
    }
  }
  const _r1 = c2s(pco);
  w = _r1.theta;
  dc = _r1.phi;
  rc = anp(w);
  return { rc, dc };
}
