// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pmpx.c.
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

import { AULT, DAS2R, DAU, DAYSEC, DJM, DJY } from './constants.js';
import { pdp } from './pdp.js';
import { pn } from './pn.js';

/**
 * JS usage:  const pco = pmpx(rc, dc, pr, pd, px, rv, pmt, pob)
 *
 * Proper motion and parallax.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rc,dc  double     ICRS RA,Dec at catalog epoch (radians)
 *    pr     double     RA proper motion (radians/year, Note 1)
 *    pd     double     Dec proper motion (radians/year)
 *    px     double     parallax (arcsec)
 *    rv     double     radial velocity (km/s, +ve if receding)
 *    pmt    double     proper motion time interval (SSB, Julian years)
 *    pob    double[3]  SSB to observer vector (au)
 *
 * Returned:
 *    pco    double[3]  coordinate direction (BCRS unit vector)
 *
 * Notes:
 *
 * 1) The proper motion in RA is dRA/dt rather than cos(Dec)*dRA/dt.
 *
 * 2) The proper motion time interval is for when the starlight
 *    reaches the solar system barycenter.
 *
 * 3) To avoid the need for iteration, the Roemer effect (i.e. the
 *    small annual modulation of the proper motion coming from the
 *    changing light time) is applied approximately, using the
 *    direction of the star at the catalog epoch.
 *
 * References:
 *
 *    1984 Astronomical Almanac, pp B39-B41.
 *
 *    Urban, S. & Seidelmann, P. K. (eds), Explanatory Supplement to
 *    the Astronomical Almanac, 3rd ed., University Science Books
 *    (2013), Section 7.2.
 *
 * Called:
 *    pdp       scalar product of two p-vectors
 *    pn        decompose p-vector into modulus and direction
 *
 * This revision:   2021 April 3
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pmpx(rc, dc, pr, pd, px, rv, pmt, pob) {
  let pco = [0, 0, 0];
  const VF = DAYSEC * DJM / DAU;
  const AULTY = AULT / DAYSEC / DJY;
  let i;
  let sr;
  let cr;
  let sd;
  let cd;
  let x;
  let y;
  let z;
  let p = [0, 0, 0];
  let dt;
  let pxr;
  let w;
  let pdz;
  let pm = [0, 0, 0];
  sr = Math.sin(rc);
  cr = Math.cos(rc);
  sd = Math.sin(dc);
  cd = Math.cos(dc);
  p[0] = x = cr * cd;
  p[1] = y = sr * cd;
  p[2] = z = sd;
  dt = pmt + pdp(p, pob) * AULTY;
  pxr = px * DAS2R;
  w = VF * rv * pxr;
  pdz = pd * z;
  pm[0] = -pr * y - pdz * cr + w * x;
  pm[1] = pr * x - pdz * sr + w * y;
  pm[2] = pd * cd + w * z;
  for (i = 0; i < 3; i++) {
    p[i] += dt * pm[i] - pxr * pob[i];
  }
  const _r1 = pn(p);
  w = _r1.r;
  pco = _r1.u;
  return pco;
}
