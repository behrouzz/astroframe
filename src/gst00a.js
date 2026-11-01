// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gst00a.c.
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
import { ee00a } from './ee00a.js';
import { gmst00 } from './gmst00.js';

/**
 * JS usage:  const result = gst00a(uta, utb, tta, ttb)
 *
 * Greenwich apparent sidereal time (consistent with IAU 2000
 * resolutions).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    uta,utb    double    UT1 as a 2-part Julian Date (Notes 1,2)
 *    tta,ttb    double    TT as a 2-part Julian Date (Notes 1,2)
 *
 * Returned (function value):
 *               double    Greenwich apparent sidereal time (radians)
 *
 * Notes:
 *
 * 1) The UT1 and TT dates uta+utb and tta+ttb respectively, are both
 *    Julian Dates, apportioned in any convenient way between the
 *    argument pairs.  For example, JD(UT1)=2450123.7 could be
 *    expressed in any of these ways, among others:
 *
 *            uta            utb
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable (in the case of UT;  the TT is not at all critical
 *    in this respect).  The J2000 and MJD methods are good compromises
 *    between resolution and convenience.  For UT, the date & time
 *    method is best matched to the algorithm that is used by the Earth
 *    Rotation Angle function, called internally:  maximum precision is
 *    delivered when the uta argument is for 0hrs UT1 on the day in
 *    question and the utb argument lies in the range 0 to 1, or vice
 *    versa.
 *
 * 2) Both UT1 and TT are required, UT1 to predict the Earth rotation
 *    and TT to predict the effects of precession-nutation.  If UT1 is
 *    used for both purposes, errors of order 100 microarcseconds
 *    result.
 *
 * 3) This GAST is compatible with the IAU 2000 resolutions and must be
 *    used only in conjunction with other IAU 2000 compatible
 *    components such as precession-nutation.
 *
 * 4) The result is returned in the range 0 to 2pi.
 *
 * 5) The algorithm is from Capitaine et al. (2003) and IERS
 *    Conventions 2003.
 *
 * Called:
 *    gmst00    Greenwich mean sidereal time, IAU 2000
 *    ee00a     equation of the equinoxes, IAU 2000A
 *    anp       normalize angle into range 0 to 2pi
 *
 * References:
 *
 *    Capitaine, N., Wallace, P.T. and McCarthy, D.D., "Expressions to
 *    implement the IAU 2000 definition of UT1", Astronomy &
 *    Astrophysics, 406, 1135-1149 (2003)
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
export function gst00a(uta, utb, tta, ttb) {
  let gmst00_;
  let ee00a_;
  let gst;
  gmst00_ = gmst00(uta, utb, tta, ttb);
  ee00a_ = ee00a(tta, ttb);
  gst = anp(gmst00_ + ee00a_);
  return gst;
}
