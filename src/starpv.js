// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file starpv.c.
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

import { DAU, DAYSEC, DC, DJY, DR2AS } from './constants.js';
import { pdp } from './pdp.js';
import { pm } from './pm.js';
import { pmp } from './pmp.js';
import { pn } from './pn.js';
import { ppp } from './ppp.js';
import { s2pv } from './s2pv.js';
import { sxp } from './sxp.js';
import { zp } from './zp.js';

const PXMIN = 1e-7;
const VMAX = 0.5;
const IMAX = 100;

/**
 * JS usage:  const { pv, status } = starpv(ra, dec, pmr, pmd, px, rv)
 *
 * Convert star catalog coordinates to position+velocity vector.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given (Note 1):
 *    ra     double        right ascension (radians)
 *    dec    double        declination (radians)
 *    pmr    double        RA proper motion (radians/year)
 *    pmd    double        Dec proper motion (radians/year)
 *    px     double        parallax (arcseconds)
 *    rv     double        radial velocity (km/s, positive = receding)
 *
 * Returned (Note 2):
 *    pv     double[2][3]  pv-vector (au, au/day)
 *
 * Returned (function value):
 *           int           status:
 *                             0 = no warnings
 *                             1 = distance overridden (Note 6)
 *                             2 = excessive speed (Note 7)
 *                             4 = solution didn't converge (Note 8)
 *                          else = binary logical OR of the above
 *
 * Notes:
 *
 * 1) The star data accepted by this function are "observables" for an
 *    imaginary observer at the solar-system barycenter.  Proper motion
 *    and radial velocity are, strictly, in terms of barycentric
 *    coordinate time, TCB.  For most practical applications, it is
 *    permissible to neglect the distinction between TCB and ordinary
 *    "proper" time on Earth (TT/TAI).  The result will, as a rule, be
 *    limited by the intrinsic accuracy of the proper-motion and
 *    radial-velocity data;  moreover, the pv-vector is likely to be
 *    merely an intermediate result, so that a change of time unit
 *    would cancel out overall.
 *
 *    In accordance with normal star-catalog conventions, the object's
 *    right ascension and declination are freed from the effects of
 *    secular aberration.  The frame, which is aligned to the catalog
 *    equator and equinox, is Lorentzian and centered on the SSB.
 *
 * 2) The resulting position and velocity pv-vector is with respect to
 *    the same frame and, like the catalog coordinates, is freed from
 *    the effects of secular aberration.  Should the "coordinate
 *    direction", where the object was located at the catalog epoch, be
 *    required, it may be obtained by calculating the magnitude of the
 *    position vector pv[0][0-2] dividing by the speed of light in
 *    au/day to give the light-time, and then multiplying the space
 *    velocity pv[1][0-2] by this light-time and adding the result to
 *    pv[0][0-2].
 *
 *    Summarizing, the pv-vector returned is for most stars almost
 *    identical to the result of applying the standard geometrical
 *    "space motion" transformation.  The differences, which are the
 *    subject of the Stumpff paper referenced below, are:
 *
 *    (i) In stars with significant radial velocity and proper motion,
 *    the constantly changing light-time distorts the apparent proper
 *    motion.  Note that this is a classical, not a relativistic,
 *    effect.
 *
 *    (ii) The transformation complies with special relativity.
 *
 * 3) Care is needed with units.  The star coordinates are in radians
 *    and the proper motions in radians per Julian year, but the
 *    parallax is in arcseconds; the radial velocity is in km/s, but
 *    the pv-vector result is in au and au/day.
 *
 * 4) The RA proper motion is in terms of coordinate angle, not true
 *    angle.  If the catalog uses arcseconds for both RA and Dec proper
 *    motions, the RA proper motion will need to be divided by cos(Dec)
 *    before use.
 *
 * 5) Straight-line motion at constant speed, in the inertial frame,
 *    is assumed.
 *
 * 6) An extremely small (or zero or negative) parallax is interpreted
 *    to mean that the object is on the "celestial sphere", the radius
 *    of which is an arbitrary (large) value (see the constant PXMIN).
 *    When the distance is overridden in this way, the status,
 *    initially zero, has 1 added to it.
 *
 * 7) If the space velocity is a significant fraction of c (see the
 *    constant VMAX), it is arbitrarily set to zero.  When this action
 *    occurs, 2 is added to the status.
 *
 * 8) The relativistic adjustment involves an iterative calculation.
 *    If the process fails to converge within a set number (IMAX) of
 *    iterations, 4 is added to the status.
 *
 * 9) The inverse transformation is performed by the function
 *    pvstar.
 *
 * Called:
 *    s2pv      spherical coordinates to pv-vector
 *    pm        modulus of p-vector
 *    zp        zero p-vector
 *    pn        decompose p-vector into modulus and direction
 *    pdp       scalar product of two p-vectors
 *    sxp       multiply p-vector by scalar
 *    pmp       p-vector minus p-vector
 *    ppp       p-vector plus p-vector
 *
 * Reference:
 *
 *    Stumpff, P., 1985, Astron.Astrophys. 144, 232-240.
 *
 * This revision:  2023 May 4
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function starpv(ra, dec, pmr, pmd, px, rv) {
  let pv = [[0, 0, 0], [0, 0, 0]];
  let i;
  let iwarn;
  let w;
  let r;
  let rd;
  let rad;
  let decd;
  let v;
  let pu = [0, 0, 0];
  let usr = [0, 0, 0];
  let ust = [0, 0, 0];
  let vsr;
  let vst;
  let betst;
  let betsr;
  let bett;
  let betr;
  let dd;
  let ddel;
  let ur = [0, 0, 0];
  let ut = [0, 0, 0];
  let d = 0.0;
  let del = 0.0;
  let odd = 0.0;
  let oddel = 0.0;
  let od = 0.0;
  let odel = 0.0;
  if (px >= PXMIN) {
    w = px;
    iwarn = 0;
  } else {
    w = PXMIN;
    iwarn = 1;
  }
  r = DR2AS / w;
  rd = DAYSEC * rv * 1e3 / DAU;
  rad = pmr / DJY;
  decd = pmd / DJY;
  pv = s2pv(ra, dec, r, rad, decd, rd);
  v = pm(pv[1]);
  if (v / DC > VMAX) {
    pv[1] = zp();
    iwarn += 2;
  }
  const _r1 = pn(pv[0]);
  w = _r1.r;
  pu = _r1.u;
  vsr = pdp(pu, pv[1]);
  usr = sxp(vsr, pu);
  ust = pmp(pv[1], usr);
  vst = pm(ust);
  betsr = vsr / DC;
  betst = vst / DC;
  bett = betst;
  betr = betsr;
  for (i = 0; i < IMAX; i++) {
    d = 1.0 + betr;
    w = betr * betr + bett * bett;
    del = -w / (Math.sqrt(1.0 - w) + 1.0);
    betr = d * betsr + del;
    bett = d * betst;
    if (i > 0) {
      dd = Math.abs(d - od);
      ddel = Math.abs(del - odel);
      if (i > 1 && dd >= odd && ddel >= oddel) {
        break;
      }
      odd = dd;
      oddel = ddel;
    }
    od = d;
    odel = del;
  }
  if (i >= IMAX) {
    iwarn += 4;
  }
  ut = sxp(d, ust);
  ur = sxp(DC * (d * betsr + del), pu);
  pv[1] = ppp(ur, ut);
  return { pv, status: iwarn };
}
