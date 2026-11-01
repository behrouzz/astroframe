// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file eect00.c.
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
import { fad03 } from './fad03.js';
import { fae03 } from './fae03.js';
import { faf03 } from './faf03.js';
import { fal03 } from './fal03.js';
import { falp03 } from './falp03.js';
import { faom03 } from './faom03.js';
import { fapa03 } from './fapa03.js';
import { fave03 } from './fave03.js';

const e0 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: 2640.96e-6, c: -0.39e-6 },
  { nfa: [0, 0, 0, 0, 2, 0, 0, 0], s: 63.52e-6, c: -0.02e-6 },
  { nfa: [0, 0, 2, -2, 3, 0, 0, 0], s: 11.75e-6, c: 0.01e-6 },
  { nfa: [0, 0, 2, -2, 1, 0, 0, 0], s: 11.21e-6, c: 0.01e-6 },
  { nfa: [0, 0, 2, -2, 2, 0, 0, 0], s: -4.55e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 3, 0, 0, 0], s: 2.02e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 1, 0, 0, 0], s: 1.98e-6, c: 0.00e-6 },
  { nfa: [0, 0, 0, 0, 3, 0, 0, 0], s: -1.72e-6, c: 0.00e-6 },
  { nfa: [0, 1, 0, 0, 1, 0, 0, 0], s: -1.41e-6, c: -0.01e-6 },
  { nfa: [0, 1, 0, 0, -1, 0, 0, 0], s: -1.26e-6, c: -0.01e-6 },
  { nfa: [1, 0, 0, 0, -1, 0, 0, 0], s: -0.63e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, 0, 1, 0, 0, 0], s: -0.63e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 3, 0, 0, 0], s: 0.46e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 1, 0, 0, 0], s: 0.45e-6, c: 0.00e-6 },
  { nfa: [0, 0, 4, -4, 4, 0, 0, 0], s: 0.36e-6, c: 0.00e-6 },
  { nfa: [0, 0, 1, -1, 1, -8, 12, 0], s: -0.24e-6, c: -0.12e-6 },
  { nfa: [0, 0, 2, 0, 0, 0, 0, 0], s: 0.32e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 2, 0, 0, 0], s: 0.28e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 3, 0, 0, 0], s: 0.27e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 1, 0, 0, 0], s: 0.26e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, -2, 0, 0, 0, 0], s: -0.21e-6, c: 0.00e-6 },
  { nfa: [0, 1, -2, 2, -3, 0, 0, 0], s: 0.19e-6, c: 0.00e-6 },
  { nfa: [0, 1, -2, 2, -1, 0, 0, 0], s: 0.18e-6, c: 0.00e-6 },
  { nfa: [0, 0, 0, 0, 0, 8, -13, -1], s: -0.10e-6, c: 0.05e-6 },
  { nfa: [0, 0, 0, 2, 0, 0, 0, 0], s: 0.15e-6, c: 0.00e-6 },
  { nfa: [2, 0, -2, 0, -1, 0, 0, 0], s: -0.14e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, -2, 1, 0, 0, 0], s: 0.14e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 2, 0, 0, 0], s: -0.14e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, -2, -1, 0, 0, 0], s: 0.14e-6, c: 0.00e-6 },
  { nfa: [0, 0, 4, -2, 4, 0, 0, 0], s: 0.13e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, -2, 4, 0, 0, 0], s: -0.11e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, 0, -3, 0, 0, 0], s: 0.11e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, 0, -1, 0, 0, 0], s: 0.11e-6, c: 0.00e-6 },
];
const e1 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: -0.87e-6, c: 0.00e-6 },
];

/**
 * JS usage:  const result = eect00(date1, date2)
 *
 * Equation of the equinoxes complementary terms, consistent with
 * IAU 2000 resolutions.
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
 * Returned (function value):
 *                 double   complementary terms (Note 2)
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
 * 2) The "complementary terms" are part of the equation of the
 *    equinoxes (EE), classically the difference between apparent and
 *    mean Sidereal Time:
 *
 *       GAST = GMST + EE
 *
 *    with:
 *
 *       EE = dpsi * cos(eps)
 *
 *    where dpsi is the nutation in longitude and eps is the obliquity
 *    of date.  However, if the rotation of the Earth were constant in
 *    an inertial frame the classical formulation would lead to
 *    apparent irregularities in the UT1 timescale traceable to side-
 *    effects of precession-nutation.  In order to eliminate these
 *    effects from UT1, "complementary terms" were introduced in 1994
 *    (IAU, 1994) and took effect from 1997 (Capitaine and Gontier,
 *    1993):
 *
 *       GAST = GMST + CT + EE
 *
 *    By convention, the complementary terms are included as part of
 *    the equation of the equinoxes rather than as part of the mean
 *    Sidereal Time.  This slightly compromises the "geometrical"
 *    interpretation of mean sidereal time but is otherwise
 *    inconsequential.
 *
 *    The present function computes CT in the above expression,
 *    compatible with IAU 2000 resolutions (Capitaine et al., 2002, and
 *    IERS Conventions 2003).
 *
 * Called:
 *    fal03     mean anomaly of the Moon
 *    falp03    mean anomaly of the Sun
 *    faf03     mean argument of the latitude of the Moon
 *    fad03     mean elongation of the Moon from the Sun
 *    faom03    mean longitude of the Moon's ascending node
 *    fave03    mean longitude of Venus
 *    fae03     mean longitude of Earth
 *    fapa03    general accumulated precession in longitude
 *
 * References:
 *
 *    Capitaine, N. & Gontier, A.-M., Astron.Astrophys., 275,
 *    645-650 (1993)
 *
 *    Capitaine, N., Wallace, P.T. and McCarthy, D.D., "Expressions to
 *    implement the IAU 2000 definition of UT1", Astron.Astrophys., 406,
 *    1135-1149 (2003)
 *
 *    IAU Resolution C7, Recommendation 3 (1994)
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
export function eect00(date1, date2) {
  let t;
  let i;
  let j;
  let a;
  let s0;
  let s1;
  let fa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let eect;
  const NE0 = Math.trunc((e0.length * 1) / 1);
  const NE1 = Math.trunc((e1.length * 1) / 1);
  t = (date1 - DJ00 + date2) / DJC;
  fa[0] = fal03(t);
  fa[1] = falp03(t);
  fa[2] = faf03(t);
  fa[3] = fad03(t);
  fa[4] = faom03(t);
  fa[5] = fave03(t);
  fa[6] = fae03(t);
  fa[7] = fapa03(t);
  s0 = 0.0;
  s1 = 0.0;
  for (i = NE0 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += e0[i].nfa[j] * fa[j];
    }
    s0 += e0[i].s * Math.sin(a) + e0[i].c * Math.cos(a);
  }
  for (i = NE1 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += e1[i].nfa[j] * fa[j];
    }
    s1 += e1[i].s * Math.sin(a) + e1[i].c * Math.cos(a);
  }
  eect = (s0 + s1 * t) * DAS2R;
  return eect;
}
