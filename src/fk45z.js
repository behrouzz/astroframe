// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk45z.c.
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
import { c2s } from './c2s.js';
import { epb2jd } from './epb2jd.js';
import { epj } from './epj.js';
import { pdp } from './pdp.js';
import { pmp } from './pmp.js';
import { ppsp } from './ppsp.js';
import { pvu } from './pvu.js';
import { s2c } from './s2c.js';

const a = [-1.62557e-6, -0.31919e-6, -0.13843e-6];
const ad = [+1.245e-3, -1.580e-3, -0.659e-3];
const em = [
  [
    [+0.9999256782, -0.0111820611, -0.0048579477],
    [+0.0111820610, +0.9999374784, -0.0000271765],
    [+0.0048579479, -0.0000271474, +0.9999881997],
  ],
  [
    [-0.000551, -0.238565, +0.435739],
    [+0.238514, -0.002667, -0.008541],
    [-0.435623, +0.012254, +0.002117],
  ],
];

/**
 * JS usage:  const { r2000, d2000 } = fk45z(r1950, d1950, bepoch)
 *
 * Convert a B1950.0 FK4 star position to J2000.0 FK5, assuming zero
 * proper motion in the FK5 system.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * This function converts a star's catalog data from the old FK4
 * (Bessel-Newcomb) system to the later IAU 1976 FK5 (Fricke) system,
 * in such a way that the FK5 proper motion is zero.  Because such a
 * star has, in general, a non-zero proper motion in the FK4 system,
 * the function requires the epoch at which the position in the FK4
 * system was determined.
 *
 * Given:
 *    r1950,d1950    double   B1950.0 FK4 RA,Dec at epoch (rad)
 *    bepoch         double   Besselian epoch (e.g. 1979.3)
 *
 * Returned:
 *    r2000,d2000    double   J2000.0 FK5 RA,Dec (rad)
 *
 * Notes:
 *
 * 1) The epoch bepoch is strictly speaking Besselian, but if a
 *    Julian epoch is supplied the result will be affected only to a
 *    negligible extent.
 *
 * 2) The method is from Appendix 2 of Aoki et al. (1983), but using
 *    the constants of Seidelmann (1992).  See the function fk425
 *    for a general introduction to the FK4 to FK5 conversion.
 *
 * 3) Conversion from equinox B1950.0 FK4 to equinox J2000.0 FK5 only
 *    is provided for.  Conversions for different starting and/or
 *    ending epochs would require additional treatment for precession,
 *    proper motion and E-terms.
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
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *    c2s       p-vector to spherical
 *    epb2jd    Besselian epoch to Julian date
 *    epj       Julian date to Julian epoch
 *    pdp       scalar product of two p-vectors
 *    pmp       p-vector minus p-vector
 *    ppsp      p-vector plus scaled p-vector
 *    pvu       update a pv-vector
 *    s2c       spherical to p-vector
 *
 * This revision:   2023 March 4
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk45z(r1950, d1950, bepoch) {
  let r2000 = 0;
  let d2000 = 0;
  const PMF = 100.0 * DR2AS;
  let r0 = [0, 0, 0];
  let p = [0, 0, 0];
  let pv = [[0, 0, 0], [0, 0, 0]];
  let w;
  let djm0;
  let djm;
  let i;
  let j;
  let k;
  r0 = s2c(r1950, d1950);
  w = (bepoch - 1950) / PMF;
  p = ppsp(a, w, ad);
  p = ppsp(p, -pdp(r0, p), r0);
  p = pmp(r0, p);
  for (i = 0; i < 2; i++) {
    for (j = 0; j < 3; j++) {
      w = 0.0;
      for (k = 0; k < 3; k++) {
        w += em[i][j][k] * p[k];
      }
      pv[i][j] = w;
    }
  }
  const _r1 = epb2jd(bepoch);
  djm0 = _r1.djm0;
  djm = _r1.djm;
  w = (epj(djm0, djm) - 2000.0) / PMF;
  pv = pvu(w, pv);
  const _r2 = c2s(pv[0]);
  w = _r2.theta;
  d2000 = _r2.phi;
  r2000 = anp(w);
  return { r2000, d2000 };
}
