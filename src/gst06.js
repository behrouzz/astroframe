// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file gst06.c.
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
import { bpn2xy } from './bpn2xy.js';
import { eors } from './eors.js';
import { era00 } from './era00.js';
import { s06 } from './s06.js';

/**
 * JS usage:  const result = gst06(uta, utb, tta, ttb, rnpb)
 *
 * Greenwich apparent sidereal time, IAU 2006, given the NPB matrix.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    uta,utb  double        UT1 as a 2-part Julian Date (Notes 1,2)
 *    tta,ttb  double        TT as a 2-part Julian Date (Notes 1,2)
 *    rnpb     double[3][3]  nutation x precession x bias matrix
 *
 * Returned (function value):
 *             double        Greenwich apparent sidereal time (radians)
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
 *    rotation angle function, called internally:  maximum precision is
 *    delivered when the uta argument is for 0hrs UT1 on the day in
 *    question and the utb argument lies in the range 0 to 1, or vice
 *    versa.
 *
 * 2) Both UT1 and TT are required, UT1 to predict the Earth rotation
 *    and TT to predict the effects of precession-nutation.  If UT1 is
 *    used for both purposes, errors of order 100 microarcseconds
 *    result.
 *
 * 3) Although the function uses the IAU 2006 series for s+XY/2, it is
 *    otherwise independent of the precession-nutation model and can in
 *    practice be used with any equinox-based NPB matrix.
 *
 * 4) The result is returned in the range 0 to 2pi.
 *
 * Called:
 *    bpn2xy    extract CIP X,Y coordinates from NPB matrix
 *    s06       the CIO locator s, given X,Y, IAU 2006
 *    anp       normalize angle into range 0 to 2pi
 *    era00     Earth rotation angle, IAU 2000
 *    eors      equation of the origins, given NPB matrix and s
 *
 * Reference:
 *
 *    Wallace, P.T. & Capitaine, N., 2006, Astron.Astrophys. 459, 981
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function gst06(uta, utb, tta, ttb, rnpb) {
  let x;
  let y;
  let s;
  let era;
  let eors_;
  let gst;
  const _r1 = bpn2xy(rnpb);
  x = _r1.x;
  y = _r1.y;
  s = s06(tta, ttb, x, y);
  era = era00(uta, utb);
  eors_ = eors(rnpb, s);
  gst = anp(era - eors_);
  return gst;
}
