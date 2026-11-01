// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk54z.c.
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
import { c2s } from './c2s.js';
import { fk524 } from './fk524.js';
import { s2c } from './s2c.js';

/**
 * JS usage:  const { r1950, d1950, dr1950, dd1950 } = fk54z(r2000, d2000, bepoch)
 *
 * Convert a J2000.0 FK5 star position to B1950.0 FK4, assuming zero
 * proper motion in FK5 and parallax.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    r2000,d2000    double   J2000.0 FK5 RA,Dec (rad)
 *    bepoch         double   Besselian epoch (e.g. 1950.0)
 *
 * Returned:
 *    r1950,d1950    double   B1950.0 FK4 RA,Dec (rad) at epoch BEPOCH
 *    dr1950,dd1950  double   B1950.0 FK4 proper motions (rad/trop.yr)
 *
 * Notes:
 *
 * 1) In contrast to the fk524 function, here the FK5 proper
 *    motions, the parallax and the radial velocity are presumed zero.
 *
 * 2) This function converts a star position from the IAU 1976 FK5
 *   (Fricke) system to the former FK4 (Bessel-Newcomb) system, for
 *    cases such as distant radio sources where it is presumed there is
 *    zero parallax and no proper motion.  Because of the E-terms of
 *    aberration, such objects have (in general) non-zero proper motion
 *    in FK4, and the present function returns those fictitious proper
 *    motions.
 *
 * 3) Conversion from J2000.0 FK5 to B1950.0 FK4 only is provided for.
 *    Conversions involving other equinoxes would require additional
 *    treatment for precession.
 *
 * 4) The position returned by this function is in the B1950.0 FK4
 *    reference system but at Besselian epoch bepoch.  For comparison
 *    with catalogs the bepoch argument will frequently be 1950.0. (In
 *    this context the distinction between Besselian and Julian epoch
 *    is insignificant.)
 *
 * 5) The RA component of the returned (fictitious) proper motion is
 *    dRA/dt rather than cos(Dec)*dRA/dt.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *    c2s       p-vector to spherical
 *    fk524     FK4 to FK5
 *    s2c       spherical to p-vector
 *
 * This revision:   2023 March 5
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk54z(r2000, d2000, bepoch) {
  let r1950 = 0;
  let d1950 = 0;
  let dr1950 = 0;
  let dd1950 = 0;
  let r;
  let d;
  let pr;
  let pd;
  let px;
  let rv;
  let p = [0, 0, 0];
  let w;
  let v = [0, 0, 0];
  let i;
  const _r1 = fk524(r2000, d2000, 0.0, 0.0, 0.0, 0.0);
  r = _r1.r1950;
  d = _r1.d1950;
  pr = _r1.dr1950;
  pd = _r1.dd1950;
  px = _r1.p1950;
  rv = _r1.v1950;
  p = s2c(r, d);
  v[0] = -pr * p[1] - pd * Math.cos(r) * Math.sin(d);
  v[1] = pr * p[0] - pd * Math.sin(r) * Math.sin(d);
  v[2] = pd * Math.cos(d);
  w = bepoch - 1950.0;
  for (i = 0; i < 3; i++) {
    p[i] += w * v[i];
  }
  const _r2 = c2s(p);
  w = _r2.theta;
  d1950 = _r2.phi;
  r1950 = anp(w);
  dr1950 = pr;
  dd1950 = pd;
  return { r1950, d1950, dr1950, dd1950 };
}
