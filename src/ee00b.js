// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ee00b.c.
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

import { ee00 } from './ee00.js';
import { nut00b } from './nut00b.js';
import { obl80 } from './obl80.js';
import { pr00 } from './pr00.js';

/**
 * JS usage:  const result = ee00b(date1, date2)
 *
 * Equation of the equinoxes, compatible with IAU 2000 resolutions but
 * using the truncated nutation model IAU 2000B.
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
 * 3) The result is compatible with the IAU 2000 resolutions except
 *    that accuracy has been compromised (1 mas) for the sake of speed.
 *    For further details, see McCarthy & Luzum (2003), IERS
 *    Conventions 2003 and Capitaine et al. (2003).
 *
 * Called:
 *    pr00      IAU 2000 precession adjustments
 *    obl80     mean obliquity, IAU 1980
 *    nut00b    nutation, IAU 2000B
 *    ee00      equation of the equinoxes, IAU 2000
 *
 * References:
 *
 *    Capitaine, N., Wallace, P.T. and McCarthy, D.D., "Expressions to
 *    implement the IAU 2000 definition of UT1", Astronomy &
 *    Astrophysics, 406, 1135-1149 (2003)
 *
 *    McCarthy, D.D. & Luzum, B.J., "An abridged model of the
 *    precession-nutation of the celestial pole", Celestial Mechanics &
 *    Dynamical Astronomy, 85, 37-49 (2003)
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
export function ee00b(date1, date2) {
  let dpsipr;
  let depspr;
  let epsa;
  let dpsi;
  let deps;
  let ee;
  const _r1 = pr00(date1, date2);
  dpsipr = _r1.dpsipr;
  depspr = _r1.depspr;
  epsa = obl80(date1, date2) + depspr;
  const _r2 = nut00b(date1, date2);
  dpsi = _r2.dpsi;
  deps = _r2.deps;
  ee = ee00(date1, date2, epsa, dpsi);
  return ee;
}
