// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pfw06.c.
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

import { DAS2R, DJ00, DJC } from './constants.js';
import { obl06 } from './obl06.js';

/**
 * JS usage:  const { gamb, phib, psib, epsa } = pfw06(date1, date2)
 *
 * Precession angles, IAU 2006 (Fukushima-Williams 4-angle formulation).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2  double   TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    gamb         double   F-W angle gamma_bar (radians)
 *    phib         double   F-W angle phi_bar (radians)
 *    psib         double   F-W angle psi_bar (radians)
 *    epsa         double   F-W angle epsilon_A (radians)
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
 * 2) Naming the following points:
 *
 *          e = J2000.0 ecliptic pole,
 *          p = GCRS pole,
 *          E = mean ecliptic pole of date,
 *    and   P = mean pole of date,
 *
 *    the four Fukushima-Williams angles are as follows:
 *
 *       gamb = gamma_bar = epE
 *       phib = phi_bar = pE
 *       psib = psi_bar = pEP
 *       epsa = epsilon_A = EP
 *
 * 3) The matrix representing the combined effects of frame bias and
 *    precession is:
 *
 *       PxB = R_1(-epsa).R_3(-psib).R_1(phib).R_3(gamb)
 *
 * 4) The matrix representing the combined effects of frame bias,
 *    precession and nutation is simply:
 *
 *       NxPxB = R_1(-epsa-dE).R_3(-psib-dP).R_1(phib).R_3(gamb)
 *
 *    where dP and dE are the nutation components with respect to the
 *    ecliptic of date.
 *
 * Reference:
 *
 *    Hilton, J. et al., 2006, Celest.Mech.Dyn.Astron. 94, 351
 *
 * Called:
 *    obl06     mean obliquity, IAU 2006
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pfw06(date1, date2) {
  let gamb = 0;
  let phib = 0;
  let psib = 0;
  let epsa = 0;
  let t;
  t = (date1 - DJ00 + date2) / DJC;
  gamb = (-0.052928 + (10.556378 + (0.4932044 + (-0.00031238 + (-0.000002788 + 0.0000000260 * t) * t) * t) * t) * t) * DAS2R;
  phib = (84381.412819 + (-46.811016 + (0.0511268 + (0.00053289 + (-0.000000440 + -0.0000000176 * t) * t) * t) * t) * t) * DAS2R;
  psib = (-0.041775 + (5038.481484 + (1.5584175 + (-0.00018522 + (-0.000026452 + -0.0000000148 * t) * t) * t) * t) * t) * DAS2R;
  epsa = obl06(date1, date2);
  return { gamb, phib, psib, epsa };
}
