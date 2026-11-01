// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file atciqn.c.
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
import { ldn } from './ldn.js';
import { pmpx } from './pmpx.js';
import { rxp } from './rxp.js';

/**
 * JS usage:  const { ri, di } = atciqn(rc, dc, pr, pd, px, rv, astrom, n, b)
 *
 * Quick ICRS, epoch J2000.0, to CIRS transformation, given precomputed
 * star-independent astrometry parameters plus a list of light-
 * deflecting bodies.
 *
 * Use of this function is appropriate when efficiency is important and
 * where many star positions are to be transformed for one date.  The
 * star-independent parameters can be obtained by calling one of the
 * functions apci[13], apcg[13], apco[13] or apcs[13].
 *
 *
 * If the only light-deflecting body to be taken into account is the
 * Sun, the atciq function can be used instead.  If in addition the
 * parallax and proper motions are zero, the atciqz function can be
 * used.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rc,dc  double       ICRS RA,Dec at J2000.0 (radians)
 *    pr     double       RA proper motion (radians/year, Note 3)
 *    pd     double       Dec proper motion (radians/year)
 *    px     double       parallax (arcsec)
 *    rv     double       radial velocity (km/s, +ve if receding)
 *    astrom aSTROM*   star-independent astrometry parameters:
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
 *    n      int          number of bodies (Note 3)
 *    b      lDBODY[n] data for each of the n bodies (Notes 3,4):
 *     bm     double       mass of the body (solar masses, Note 5)
 *     dl     double       deflection limiter (Note 6)
 *     pv     [2][3]       barycentric PV of the body (au, au/day)
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
 * 3) The struct b contains n entries, one for each body to be
 *    considered.  If n = 0, no gravitational light deflection will be
 *    applied, not even for the Sun.
 *
 * 4) The struct b should include an entry for the Sun as well as for
 *    any planet or other body to be taken into account.  The entries
 *    should be in the order in which the light passes the body.
 *
 * 5) In the entry in the b struct for body i, the mass parameter
 *    b[i].bm can, as required, be adjusted in order to allow for such
 *    effects as quadrupole field.
 *
 * 6) The deflection limiter parameter b[i].dl is phi^2/2, where phi is
 *    the angular separation (in radians) between star and body at
 *    which limiting is applied.  As phi shrinks below the chosen
 *    threshold, the deflection is artificially reduced, reaching zero
 *    for phi = 0.   Example values suitable for a terrestrial
 *    observer, together with masses, are as follows:
 *
 *       body i     b[i].bm        b[i].dl
 *
 *       Sun        1.0            6e-6
 *       Jupiter    0.00095435     3e-9
 *       Saturn     0.00028574     3e-10
 *
 * 7) For efficiency, validation of the contents of the b array is
 *    omitted.  The supplied masses must be greater than zero, the
 *    position and velocity vectors must be right, and the deflection
 *    limiter greater than zero.
 *
 * Called:
 *    pmpx      proper motion and parallax
 *    ldn       light deflection by n bodies
 *    ab        stellar aberration
 *    rxp       product of r-matrix and pv-vector
 *    c2s       p-vector to spherical
 *    anp       normalize angle into range 0 to 2pi
 *
 * This revision:   2021 April 3
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function atciqn(rc, dc, pr, pd, px, rv, astrom, n, b) {
  let ri = 0;
  let di = 0;
  let pco = [0, 0, 0];
  let pnat = [0, 0, 0];
  let ppr = [0, 0, 0];
  let pi = [0, 0, 0];
  let w;
  pco = pmpx(rc, dc, pr, pd, px, rv, astrom.pmt, astrom.eb);
  pnat = ldn(n, b, astrom.eb, pco);
  ppr = ab(pnat, astrom.v, astrom.em, astrom.bm1);
  pi = rxp(astrom.bpn, ppr);
  const _r1 = c2s(pi);
  w = _r1.theta;
  di = _r1.phi;
  ri = anp(w);
  return { ri, di };
}
