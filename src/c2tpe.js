// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file c2tpe.c.
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

import { c2teqx } from './c2teqx.js';
import { ee00 } from './ee00.js';
import { gmst00 } from './gmst00.js';
import { pn00 } from './pn00.js';
import { pom00 } from './pom00.js';
import { sp00 } from './sp00.js';

/**
 * JS usage:  const rc2t = c2tpe(tta, ttb, uta, utb, dpsi, deps, xp, yp)
 *
 * Form the celestial to terrestrial matrix given the date, the UT1,
 * the nutation and the polar motion.  IAU 2000.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    tta,ttb    double        TT as a 2-part Julian Date (Note 1)
 *    uta,utb    double        UT1 as a 2-part Julian Date (Note 1)
 *    dpsi,deps  double        nutation (Note 2)
 *    xp,yp      double        coordinates of the pole (radians, Note 3)
 *
 * Returned:
 *    rc2t       double[3][3]  celestial-to-terrestrial matrix (Note 4)
 *
 * Notes:
 *
 * 1) The TT and UT1 dates tta+ttb and uta+utb are Julian Dates,
 *    apportioned in any convenient way between the arguments uta and
 *    utb.  For example, JD(UT1)=2450123.7 could be expressed in any of
 *    these ways, among others:
 *
 *            uta            utb
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution is
 *    acceptable.  The J2000 and MJD methods are good compromises
 *    between resolution and convenience.  In the case of uta,utb, the
 *    date & time method is best matched to the Earth rotation angle
 *    algorithm used:  maximum precision is delivered when the uta
 *    argument is for 0hrs UT1 on the day in question and the utb
 *    argument lies in the range 0 to 1, or vice versa.
 *
 * 2) The caller is responsible for providing the nutation components;
 *    they are in longitude and obliquity, in radians and are with
 *    respect to the equinox and ecliptic of date.  For high-accuracy
 *    applications, free core nutation should be included as well as
 *    any other relevant corrections to the position of the CIP.
 *
 * 3) The arguments xp and yp are the coordinates (in radians) of the
 *    Celestial Intermediate Pole with respect to the International
 *    Terrestrial Reference System (see IERS Conventions 2003),
 *    measured along the meridians 0 and 90 deg west respectively.
 *
 * 4) The matrix rc2t transforms from celestial to terrestrial
 *    coordinates:
 *
 *       [TRS] = RPOM * R_3(GST) * RBPN * [CRS]
 *
 *             = rc2t * [CRS]
 *
 *    where [CRS] is a vector in the Geocentric Celestial Reference
 *    System and [TRS] is a vector in the International Terrestrial
 *    Reference System (see IERS Conventions 2003), RBPN is the
 *    bias-precession-nutation matrix, GST is the Greenwich (apparent)
 *    Sidereal Time and RPOM is the polar motion matrix.
 *
 * 5) Although its name does not include "00", This function is in fact
 *    specific to the IAU 2000 models.
 *
 * Called:
 *    pn00      bias/precession/nutation results, IAU 2000
 *    gmst00    Greenwich mean sidereal time, IAU 2000
 *    sp00      the TIO locator s', IERS 2000
 *    ee00      equation of the equinoxes, IAU 2000
 *    pom00     polar motion matrix
 *    c2teqx    form equinox-based celestial-to-terrestrial matrix
 *
 * Reference:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function c2tpe(tta, ttb, uta, utb, dpsi, deps, xp, yp) {
  let rc2t = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let epsa;
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let gmst;
  let ee;
  let sp;
  let rpom = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const _r1 = pn00(tta, ttb, dpsi, deps);
  epsa = _r1.epsa;
  rb = _r1.rb;
  rp = _r1.rp;
  rbp = _r1.rbp;
  rn = _r1.rn;
  rbpn = _r1.rbpn;
  gmst = gmst00(uta, utb, tta, ttb);
  ee = ee00(tta, ttb, epsa, dpsi);
  sp = sp00(tta, ttb);
  rpom = pom00(xp, yp, sp);
  rc2t = c2teqx(rbpn, gmst + ee, rpom);
  return rc2t;
}
