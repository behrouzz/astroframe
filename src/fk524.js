// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk524.c.
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

import { DR2AS } from './constants.js';
import { anp } from './anp.js';
import { pdp } from './pdp.js';
import { pm } from './pm.js';
import { pmp } from './pmp.js';
import { ppp } from './ppp.js';
import { pv2s } from './pv2s.js';
import { s2pv } from './s2pv.js';
import { sxp } from './sxp.js';

const a = [
  [-1.62557e-6, -0.31919e-6, -0.13843e-6],
  [+1.245e-3, -1.580e-3, -0.659e-3],
];
const em = [
  [
    [
      [+0.9999256795, +0.0111814828, +0.0048590039],
      [-0.00000242389840, -0.00000002710544, -0.00000001177742],
    ],
    [
      [-0.0111814828, +0.9999374849, -0.0000271771],
      [+0.00000002710544, -0.00000242392702, +0.00000000006585],
    ],
    [
      [-0.0048590040, -0.0000271557, +0.9999881946],
      [+0.00000001177742, +0.00000000006585, -0.00000242404995],
    ],
  ],
  [
    [
      [-0.000551, +0.238509, -0.435614],
      [+0.99990432, +0.01118145, +0.00485852],
    ],
    [
      [-0.238560, -0.002667, +0.012254],
      [-0.01118145, +0.99991613, -0.00002717],
    ],
    [
      [+0.435730, -0.008541, +0.002117],
      [-0.00485852, -0.00002716, +0.99996684],
    ],
  ],
];

/**
 * JS usage:  const { r1950, d1950, dr1950, dd1950, p1950, v1950 } = fk524(r2000, d2000, dr2000, dd2000, p2000, v2000)
 *
 * Convert J2000.0 FK5 star catalog data to B1950.0 FK4.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given: (all J2000.0, FK5)
 *    r2000,d2000    double   J2000.0 RA,Dec (rad)
 *    dr2000,dd2000  double   J2000.0 proper motions (rad/Jul.yr)
 *    p2000          double   parallax (arcsec)
 *    v2000          double   radial velocity (km/s, +ve = moving away)
 *
 * Returned: (all B1950.0, FK4)
 *    r1950,d1950    double   B1950.0 RA,Dec (rad)
 *    dr1950,dd1950  double   B1950.0 proper motions (rad/trop.yr)
 *    p1950          double   parallax (arcsec)
 *    v1950          double   radial velocity (km/s, +ve = moving away)
 *
 * Notes:
 *
 * 1) The proper motions in RA are dRA/dt rather than cos(Dec)*dRA/dt,
 *    and are per year rather than per century.
 *
 * 2) The conversion is somewhat complicated, for several reasons:
 *
 *    . Change of standard epoch from J2000.0 to B1950.0.
 *
 *    . An intermediate transition date of 1984 January 1.0 TT.
 *
 *    . A change of precession model.
 *
 *    . Change of time unit for proper motion (Julian to tropical).
 *
 *    . FK4 positions include the E-terms of aberration, to simplify
 *      the hand computation of annual aberration.  FK5 positions
 *      assume a rigorous aberration computation based on the Earth's
 *      barycentric velocity.
 *
 *    . The E-terms also affect proper motions, and in particular cause
 *      objects at large distances to exhibit fictitious proper
 *      motions.
 *
 *    The algorithm is based on Smith et al. (1989) and Yallop et al.
 *    (1989), which presented a matrix method due to Standish (1982) as
 *    developed by Aoki et al. (1983), using Kinoshita's development of
 *    Andoyer's post-Newcomb precession.  The numerical constants from
 *    Seidelmann (1992) are used canonically.
 *
 * 4) In the FK4 catalog the proper motions of stars within 10 degrees
 *    of the poles do not embody differential E-terms effects and
 *    should, strictly speaking, be handled in a different manner from
 *    stars outside these regions.  However, given the general lack of
 *    homogeneity of the star data available for routine astrometry,
 *    the difficulties of handling positions that may have been
 *    determined from astrometric fields spanning the polar and non-
 *    polar regions, the likelihood that the differential E-terms
 *    effect was not taken into account when allowing for proper motion
 *    in past astrometry, and the undesirability of a discontinuity in
 *    the algorithm, the decision has been made in this SOFA algorithm
 *    to include the effects of differential E-terms on the proper
 *    motions for all stars, whether polar or not.  At epoch J2000.0,
 *    and measuring "on the sky" rather than in terms of RA change, the
 *    errors resulting from this simplification are less than
 *    1 milliarcsecond in position and 1 milliarcsecond per century in
 *    proper motion.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *    pdp       scalar product of two p-vectors
 *    pm        modulus of p-vector
 *    pmp       p-vector minus p-vector
 *    ppp       p-vector pluus p-vector
 *    pv2s      pv-vector to spherical coordinates
 *    s2pv      spherical coordinates to pv-vector
 *    sxp       multiply p-vector by scalar
 *
 * References:
 *
 *    Aoki, S. et al., 1983, "Conversion matrix of epoch B1950.0
 *    FK4-based positions of stars to epoch J2000.0 positions in
 *    accordance with the new IAU resolutions".  Astron.Astrophys.
 *    128, 263-267.
 *
 *    Seidelmann, P.K. (ed), 1992, "Explanatory Supplement to the
 *    Astronomical Almanac", ISBN 0-935702-68-7.
 *
 *    Smith, C.A. et al., 1989, "The transformation of astrometric
 *    catalog systems to the equinox J2000.0".  Astron.J. 97, 265.
 *
 *    Standish, E.M., 1982, "Conversion of positions and proper motions
 *    from B1950.0 to the IAU system at J2000.0".  Astron.Astrophys.,
 *    115, 1, 20-22.
 *
 *    Yallop, B.D. et al., 1989, "Transformation of mean star places
 *    from FK4 B1950.0 to FK5 J2000.0 using matrices in 6-space".
 *    Astron.J. 97, 274.
 *
 * This revision:   2023 March 20
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk524(r2000, d2000, dr2000, dd2000, p2000, v2000) {
  let r1950 = 0;
  let d1950 = 0;
  let dr1950 = 0;
  let dd1950 = 0;
  let p1950 = 0;
  let v1950 = 0;
  const PMF = 100.0 * DR2AS;
  const TINY = 1e-30;
  let r;
  let d;
  let ur;
  let ud;
  let px;
  let rv;
  let pxvf;
  let w;
  let rd;
  let i;
  let j;
  let k;
  let l;
  let r0 = [[0, 0, 0], [0, 0, 0]];
  let r1 = [[0, 0, 0], [0, 0, 0]];
  let p1 = [0, 0, 0];
  let p2 = [0, 0, 0];
  let pv = [[0, 0, 0], [0, 0, 0]];
  const VF = 21.095;
  r = r2000;
  d = d2000;
  ur = dr2000 * PMF;
  ud = dd2000 * PMF;
  px = p2000;
  rv = v2000;
  pxvf = px * VF;
  w = rv * pxvf;
  r0 = s2pv(r, d, 1.0, ur, ud, w);
  for (i = 0; i < 2; i++) {
    for (j = 0; j < 3; j++) {
      w = 0.0;
      for (k = 0; k < 2; k++) {
        for (l = 0; l < 3; l++) {
          w += em[i][j][k][l] * r0[k][l];
        }
      }
      r1[i][j] = w;
    }
  }
  w = pm(r1[0]);
  p1 = sxp(pdp(r1[0], a[0]), r1[0]);
  p2 = sxp(w, a[0]);
  p1 = pmp(p2, p1);
  p1 = ppp(r1[0], p1);
  w = pm(p1);
  p1 = sxp(pdp(r1[0], a[0]), r1[0]);
  p2 = sxp(w, a[0]);
  p1 = pmp(p2, p1);
  pv[0] = ppp(r1[0], p1);
  p1 = sxp(pdp(r1[0], a[1]), pv[0]);
  p2 = sxp(w, a[1]);
  p1 = pmp(p2, p1);
  pv[1] = ppp(r1[1], p1);
  const _r1 = pv2s(pv);
  r = _r1.theta;
  d = _r1.phi;
  w = _r1.r;
  ur = _r1.td;
  ud = _r1.pd;
  rd = _r1.rd;
  if (px > TINY) {
    rv = rd / pxvf;
    px = px / w;
  }
  r1950 = anp(r);
  d1950 = d;
  dr1950 = ur / PMF;
  dd1950 = ud / PMF;
  p1950 = px;
  v1950 = rv;
  return { r1950, d1950, dr1950, dd1950, p1950, v1950 };
}
