// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file atci13.c.
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

import { newAstrom } from './types.js';
import { apci13 } from './apci13.js';
import { atciq } from './atciq.js';

/**
 * JS usage:  const { ri, di, eo } = atci13(rc, dc, pr, pd, px, rv, date1, date2)
 *
 * Transform ICRS star data, epoch J2000.0, to CIRS.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rc     double  ICRS right ascension at J2000.0 (radians, Note 1)
 *    dc     double  ICRS declination at J2000.0 (radians, Note 1)
 *    pr     double  RA proper motion (radians/year, Note 2)
 *    pd     double  Dec proper motion (radians/year)
 *    px     double  parallax (arcsec)
 *    rv     double  radial velocity (km/s, +ve if receding)
 *    date1  double  TDB as a 2-part...
 *    date2  double  ...Julian Date (Note 3)
 *
 * Returned:
 *    ri,di  double* CIRS geocentric RA,Dec (radians)
 *    eo     double* equation of the origins (ERA-GST, radians, Note 5)
 *
 * Notes:
 *
 * 1) Star data for an epoch other than J2000.0 (for example from the
 *    Hipparcos catalog, which has an epoch of J1991.25) will require a
 *    preliminary call to pmsafe before use.
 *
 * 2) The proper motion in RA is dRA/dt rather than cos(Dec)*dRA/dt.
 *
 * 3) The TDB date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TDB)=2450123.7 could be expressed in any of these ways, among
 *    others:
 *
 *           date1          date2
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
 *    good compromises between resolution and convenience.  For most
 *    applications of this function the choice will not be at all
 *    critical.
 *
 *    TT can be used instead of TDB without any significant impact on
 *    accuracy.
 *
 * 4) The available accuracy is better than 1 milliarcsecond, limited
 *    mainly by the precession-nutation model that is used, namely
 *    IAU 2000A/2006.  Very close to solar system bodies, additional
 *    errors of up to several milliarcseconds can occur because of
 *    unmodeled light deflection;  however, the Sun's contribution is
 *    taken into account, to first order.  The accuracy limitations of
 *    the SOFA function epv00 (used to compute Earth position and
 *    velocity) can contribute aberration errors of up to
 *    5 microarcseconds.  Light deflection at the Sun's limb is
 *    uncertain at the 0.4 mas level.
 *
 * 5) Should the transformation to (equinox based) apparent place be
 *    required rather than (CIO based) intermediate place, subtract the
 *    equation of the origins from the returned right ascension:
 *    RA = RI - EO. (The anp function can then be applied, as
 *    required, to keep the result in the conventional 0-2pi range.)
 *
 * Called:
 *    apci13    astrometry parameters, ICRS-CIRS, 2013
 *    atciq     quick ICRS to CIRS
 *
 * This revision:   2022 May 3
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function atci13(rc, dc, pr, pd, px, rv, date1, date2) {
  let ri = 0;
  let di = 0;
  let eo = 0;
  let astrom = newAstrom();
  const _r1 = apci13(date1, date2, astrom);
  astrom = _r1.astrom;
  eo = _r1.eo;
  const _r2 = atciq(rc, dc, pr, pd, px, rv, astrom);
  ri = _r2.ri;
  di = _r2.di;
  return { ri, di, eo };
}
