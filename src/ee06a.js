// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ee06a.c.
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

import { anpm } from './anpm.js';
import { gmst06 } from './gmst06.js';
import { gst06a } from './gst06a.js';

/**
 * JS usage:  const result = ee06a(date1, date2)
 *
 * Equation of the equinoxes, compatible with IAU 2000 resolutions and
 * IAU 2006/2000A precession-nutation.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double    TT as a 2-part Julian Date (Note 1)
 *
 * Returned (function value):
 *                 double    equation of the equinoxes (Note 2)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways,
 *    among others:
 *
 *           date1          date2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable.  The J2000 method is best matched to the way
 *    the argument is handled internally and will deliver the
 *    optimum resolution.  The MJD method and the date & time methods
 *    are both good compromises between resolution and convenience.
 *
 * 2) The result, which is in radians, operates in the following sense:
 *
 *       Greenwich apparent ST = GMST + equation of the equinoxes
 *
 * Called:
 *    anpm      normalize angle into range +/- pi
 *    gst06a    Greenwich apparent sidereal time, IAU 2006/2000A
 *    gmst06    Greenwich mean sidereal time, IAU 2006
 *
 * Reference:
 *
 *    McCarthy, D. D., Petit, G. (eds.), 2004, IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ee06a(date1, date2) {
  let gst06a_;
  let gmst06_;
  let ee;
  gst06a_ = gst06a(0.0, 0.0, date1, date2);
  gmst06_ = gmst06(0.0, 0.0, date1, date2);
  ee = anpm(gst06a_ - gmst06_);
  return ee;
}
