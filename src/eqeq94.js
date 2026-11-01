// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file eqeq94.c.
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

import { D2PI, DAS2R, DJ00, DJC } from './constants.js';
import { anpm } from './anpm.js';
import { nut80 } from './nut80.js';
import { obl80 } from './obl80.js';

/**
 * JS usage:  const result = eqeq94(date1, date2)
 *
 * Equation of the equinoxes, IAU 1994 model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2   double     TDB date (Note 1)
 *
 * Returned (function value):
 *                  double     equation of the equinoxes (Note 2)
 *
 * Notes:
 *
 * 1) The date date1+date2 is a Julian Date, apportioned in any
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
 *    nut80     nutation, IAU 1980
 *    obl80     mean obliquity, IAU 1980
 *
 * References:
 *
 *    IAU Resolution C7, Recommendation 3 (1994).
 *
 *    Capitaine, N. & Gontier, A.-M., 1993, Astron.Astrophys., 275,
 *    645-650.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function eqeq94(date1, date2) {
  let t;
  let om;
  let dpsi;
  let deps;
  let eps0;
  let ee;
  t = (date1 - DJ00 + date2) / DJC;
  om = anpm((450160.280 + (-482890.539 + (7.455 + 0.008 * t) * t) * t) * DAS2R + -5.0 * t % 1.0 * D2PI);
  const _r1 = nut80(date1, date2);
  dpsi = _r1.dpsi;
  deps = _r1.deps;
  eps0 = obl80(date1, date2);
  ee = dpsi * Math.cos(eps0) + DAS2R * (0.00264 * Math.sin(om) + 0.000063 * Math.sin(om + om));
  return ee;
}
