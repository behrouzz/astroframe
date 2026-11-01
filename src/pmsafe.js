// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pmsafe.c.
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

import { seps } from './seps.js';
import { starpm } from './starpm.js';

/**
 * JS usage:  const { ra2, dec2, pmr2, pmd2, px2, rv2, status } = pmsafe(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b)
 *
 * Star proper motion:  update star catalog data for space motion, with
 * special handling to handle the zero parallax case.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ra1    double     right ascension (radians), before
 *    dec1   double     declination (radians), before
 *    pmr1   double     RA proper motion (radians/year), before
 *    pmd1   double     Dec proper motion (radians/year), before
 *    px1    double     parallax (arcseconds), before
 *    rv1    double     radial velocity (km/s, +ve = receding), before
 *    ep1a   double     "before" epoch, part A (Note 1)
 *    ep1b   double     "before" epoch, part B (Note 1)
 *    ep2a   double     "after" epoch, part A (Note 1)
 *    ep2b   double     "after" epoch, part B (Note 1)
 *
 * Returned:
 *    ra2    double     right ascension (radians), after
 *    dec2   double     declination (radians), after
 *    pmr2   double     RA proper motion (radians/year), after
 *    pmd2   double     Dec proper motion (radians/year), after
 *    px2    double     parallax (arcseconds), after
 *    rv2    double     radial velocity (km/s, +ve = receding), after
 *
 * Returned (function value):
 *           int        status:
 *                         -1 = system error (should not occur)
 *                          0 = no warnings or errors
 *                          1 = distance overridden (Note 6)
 *                          2 = excessive velocity (Note 7)
 *                          4 = solution didn't converge (Note 8)
 *                       else = binary logical OR of the above warnings
 *
 * Notes:
 *
 * 1) The starting and ending TDB dates ep1a+ep1b and ep2a+ep2b are
 *    Julian Dates, apportioned in any convenient way between the two
 *    parts (A and B).  For example, JD(TDB)=2450123.7 could be
 *    expressed in any of these ways, among others:
 *
 *           epNa            epNb
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in cases
 *    where the loss of several decimal digits of resolution is
 *    acceptable.  The J2000 method is best matched to the way the
 *    argument is handled internally and will deliver the optimum
 *    resolution.  The MJD method and the date & time methods are both
 *    good compromises between resolution and convenience.
 *
 * 2) In accordance with normal star-catalog conventions, the object's
 *    right ascension and declination are freed from the effects of
 *    secular aberration.  The frame, which is aligned to the catalog
 *    equator and equinox, is Lorentzian and centered on the SSB.
 *
 *    The proper motions are the rate of change of the right ascension
 *    and declination at the catalog epoch and are in radians per TDB
 *    Julian year.
 *
 *    The parallax and radial velocity are in the same frame.
 *
 * 3) Care is needed with units.  The star coordinates are in radians
 *    and the proper motions in radians per Julian year, but the
 *    parallax is in arcseconds.
 *
 * 4) The RA proper motion is in terms of coordinate angle, not true
 *    angle.  If the catalog uses arcseconds for both RA and Dec proper
 *    motions, the RA proper motion will need to be divided by cos(Dec)
 *    before use.
 *
 * 5) Straight-line motion at constant speed, in the inertial frame, is
 *    assumed.
 *
 * 6) An extremely small (or zero or negative) parallax is overridden
 *    to ensure that the object is at a finite but very large distance,
 *    but not so large that the proper motion is equivalent to a large
 *    but safe speed (about 0.1c using the chosen constant).  A warning
 *    status of 1 is added to the status if this action has been taken.
 *
 * 7) If the space velocity is a significant fraction of c (see the
 *    constant VMAX in the function starpv), it is arbitrarily set
 *    to zero.  When this action occurs, 2 is added to the status.
 *
 * 8) The relativistic adjustment carried out in the starpv function
 *    involves an iterative calculation.  If the process fails to
 *    converge within a set number of iterations, 4 is added to the
 *    status.
 *
 * Called:
 *    seps      angle between two points
 *    starpm    update star catalog data for space motion
 *
 * This revision:   2023 April 7
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pmsafe(ra1, dec1, pmr1, pmd1, px1, rv1, ep1a, ep1b, ep2a, ep2b) {
  let ra2 = 0;
  let dec2 = 0;
  let pmr2 = 0;
  let pmd2 = 0;
  let px2 = 0;
  let rv2 = 0;
  const PXMIN = 5e-7;
  const F = 326.0;
  let jpx;
  let j;
  let pm;
  let px1a;
  pm = seps(ra1, dec1, ra1 + pmr1, dec1 + pmd1);
  jpx = 0;
  px1a = px1;
  pm *= F;
  if (px1a < pm) {
    jpx = 1;
    px1a = pm;
  }
  if (px1a < PXMIN) {
    jpx = 1;
    px1a = PXMIN;
  }
  const _r1 = starpm(ra1, dec1, pmr1, pmd1, px1a, rv1, ep1a, ep1b, ep2a, ep2b);
  ra2 = _r1.ra2;
  dec2 = _r1.dec2;
  pmr2 = _r1.pmr2;
  pmd2 = _r1.pmd2;
  px2 = _r1.px2;
  rv2 = _r1.rv2;
  j = _r1.status;
  if (!(j % 2)) {
    j += jpx;
  }
  return { ra2, dec2, pmr2, pmd2, px2, rv2, status: j };
}
