// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file s06.c.
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

const sp = [94.00e-6, 3808.65e-6, -122.68e-6, -72574.11e-6, 27.98e-6, 15.62e-6];
const s0 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: -2640.73e-6, c: 0.39e-6 },
  { nfa: [0, 0, 0, 0, 2, 0, 0, 0], s: -63.53e-6, c: 0.02e-6 },
  { nfa: [0, 0, 2, -2, 3, 0, 0, 0], s: -11.75e-6, c: -0.01e-6 },
  { nfa: [0, 0, 2, -2, 1, 0, 0, 0], s: -11.21e-6, c: -0.01e-6 },
  { nfa: [0, 0, 2, -2, 2, 0, 0, 0], s: 4.57e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 3, 0, 0, 0], s: -2.02e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 1, 0, 0, 0], s: -1.98e-6, c: 0.00e-6 },
  { nfa: [0, 0, 0, 0, 3, 0, 0, 0], s: 1.72e-6, c: 0.00e-6 },
  { nfa: [0, 1, 0, 0, 1, 0, 0, 0], s: 1.41e-6, c: 0.01e-6 },
  { nfa: [0, 1, 0, 0, -1, 0, 0, 0], s: 1.26e-6, c: 0.01e-6 },
  { nfa: [1, 0, 0, 0, -1, 0, 0, 0], s: 0.63e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, 0, 1, 0, 0, 0], s: 0.63e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 3, 0, 0, 0], s: -0.46e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 1, 0, 0, 0], s: -0.45e-6, c: 0.00e-6 },
  { nfa: [0, 0, 4, -4, 4, 0, 0, 0], s: -0.36e-6, c: 0.00e-6 },
  { nfa: [0, 0, 1, -1, 1, -8, 12, 0], s: 0.24e-6, c: 0.12e-6 },
  { nfa: [0, 0, 2, 0, 0, 0, 0, 0], s: -0.32e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 2, 0, 0, 0], s: -0.28e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 3, 0, 0, 0], s: -0.27e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 1, 0, 0, 0], s: -0.26e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, -2, 0, 0, 0, 0], s: 0.21e-6, c: 0.00e-6 },
  { nfa: [0, 1, -2, 2, -3, 0, 0, 0], s: -0.19e-6, c: 0.00e-6 },
  { nfa: [0, 1, -2, 2, -1, 0, 0, 0], s: -0.18e-6, c: 0.00e-6 },
  { nfa: [0, 0, 0, 0, 0, 8, -13, -1], s: 0.10e-6, c: -0.05e-6 },
  { nfa: [0, 0, 0, 2, 0, 0, 0, 0], s: -0.15e-6, c: 0.00e-6 },
  { nfa: [2, 0, -2, 0, -1, 0, 0, 0], s: 0.14e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 2, 0, 0, 0], s: 0.14e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, -2, 1, 0, 0, 0], s: -0.14e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, -2, -1, 0, 0, 0], s: -0.14e-6, c: 0.00e-6 },
  { nfa: [0, 0, 4, -2, 4, 0, 0, 0], s: -0.13e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, -2, 4, 0, 0, 0], s: 0.11e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, 0, -3, 0, 0, 0], s: -0.11e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, 0, -1, 0, 0, 0], s: -0.11e-6, c: 0.00e-6 },
];
const s1 = [
  { nfa: [0, 0, 0, 0, 2, 0, 0, 0], s: -0.07e-6, c: 3.57e-6 },
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: 1.73e-6, c: -0.03e-6 },
  { nfa: [0, 0, 2, -2, 3, 0, 0, 0], s: 0.00e-6, c: 0.48e-6 },
];
const s2 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: 743.52e-6, c: -0.17e-6 },
  { nfa: [0, 0, 2, -2, 2, 0, 0, 0], s: 56.91e-6, c: 0.06e-6 },
  { nfa: [0, 0, 2, 0, 2, 0, 0, 0], s: 9.84e-6, c: -0.01e-6 },
  { nfa: [0, 0, 0, 0, 2, 0, 0, 0], s: -8.85e-6, c: 0.01e-6 },
  { nfa: [0, 1, 0, 0, 0, 0, 0, 0], s: -6.38e-6, c: -0.05e-6 },
  { nfa: [1, 0, 0, 0, 0, 0, 0, 0], s: -3.07e-6, c: 0.00e-6 },
  { nfa: [0, 1, 2, -2, 2, 0, 0, 0], s: 2.23e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 1, 0, 0, 0], s: 1.67e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 2, 0, 0, 0], s: 1.30e-6, c: 0.00e-6 },
  { nfa: [0, 1, -2, 2, -2, 0, 0, 0], s: 0.93e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, -2, 0, 0, 0, 0], s: 0.68e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, -2, 1, 0, 0, 0], s: -0.55e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, 0, -2, 0, 0, 0], s: 0.53e-6, c: 0.00e-6 },
  { nfa: [0, 0, 0, 2, 0, 0, 0, 0], s: -0.27e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, 0, 1, 0, 0, 0], s: -0.27e-6, c: 0.00e-6 },
  { nfa: [1, 0, -2, -2, -2, 0, 0, 0], s: -0.26e-6, c: 0.00e-6 },
  { nfa: [1, 0, 0, 0, -1, 0, 0, 0], s: -0.25e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, 0, 1, 0, 0, 0], s: 0.22e-6, c: 0.00e-6 },
  { nfa: [2, 0, 0, -2, 0, 0, 0, 0], s: -0.21e-6, c: 0.00e-6 },
  { nfa: [2, 0, -2, 0, -1, 0, 0, 0], s: 0.20e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 2, 2, 0, 0, 0], s: 0.17e-6, c: 0.00e-6 },
  { nfa: [2, 0, 2, 0, 2, 0, 0, 0], s: 0.13e-6, c: 0.00e-6 },
  { nfa: [2, 0, 0, 0, 0, 0, 0, 0], s: -0.13e-6, c: 0.00e-6 },
  { nfa: [1, 0, 2, -2, 2, 0, 0, 0], s: -0.12e-6, c: 0.00e-6 },
  { nfa: [0, 0, 2, 0, 0, 0, 0, 0], s: -0.11e-6, c: 0.00e-6 },
];
const s3 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: 0.30e-6, c: -23.42e-6 },
  { nfa: [0, 0, 2, -2, 2, 0, 0, 0], s: -0.03e-6, c: -1.46e-6 },
  { nfa: [0, 0, 2, 0, 2, 0, 0, 0], s: -0.01e-6, c: -0.25e-6 },
  { nfa: [0, 0, 0, 0, 2, 0, 0, 0], s: 0.00e-6, c: 0.23e-6 },
];
const s4 = [
  { nfa: [0, 0, 0, 0, 1, 0, 0, 0], s: -0.26e-6, c: -0.01e-6 },
];
const NS0 = Math.trunc((s0.length * 1) / 1);
const NS1 = Math.trunc((s1.length * 1) / 1);
const NS2 = Math.trunc((s2.length * 1) / 1);
const NS3 = Math.trunc((s3.length * 1) / 1);
const NS4 = Math.trunc((s4.length * 1) / 1);

/**
 * JS usage:  const result = s06(date1, date2, x, y)
 *
 * The CIO locator s, positioning the Celestial Intermediate Origin on
 * the equator of the Celestial Intermediate Pole, given the CIP's X,Y
 * coordinates.  Compatible with IAU 2006/2000A precession-nutation.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2   double    TT as a 2-part Julian Date (Note 1)
 *    x,y           double    CIP coordinates (Note 3)
 *
 * Returned (function value):
 *                  double    the CIO locator s in radians (Note 2)
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
 * 2) The CIO locator s is the difference between the right ascensions
 *    of the same point in two systems:  the two systems are the GCRS
 *    and the CIP,CIO, and the point is the ascending node of the
 *    CIP equator.  The quantity s remains below 0.1 arcsecond
 *    throughout 1900-2100.
 *
 * 3) The series used to compute s is in fact for s+XY/2, where X and Y
 *    are the x and y components of the CIP unit vector;  this series
 *    is more compact than a direct series for s would be.  This
 *    function requires X,Y to be supplied by the caller, who is
 *    responsible for providing values that are consistent with the
 *    supplied date.
 *
 * 4) The model is consistent with the "P03" precession (Capitaine et
 *    al. 2003), adopted by IAU 2006 Resolution 1, 2006, and the
 *    IAU 2000A nutation (with P03 adjustments).
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
 *    Capitaine, N., Wallace, P.T. & Chapront, J., 2003, Astron.
 *    Astrophys. 432, 355
 *
 *    McCarthy, D.D., Petit, G. (eds.) 2004, IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function s06(date1, date2, x, y) {
  let t;
  let i;
  let j;
  let a;
  let w0;
  let w1;
  let w2;
  let w3;
  let w4;
  let w5;
  let fa = [0, 0, 0, 0, 0, 0, 0, 0];
  let s;
  t = (date1 - DJ00 + date2) / DJC;
  fa[0] = fal03(t);
  fa[1] = falp03(t);
  fa[2] = faf03(t);
  fa[3] = fad03(t);
  fa[4] = faom03(t);
  fa[5] = fave03(t);
  fa[6] = fae03(t);
  fa[7] = fapa03(t);
  w0 = sp[0];
  w1 = sp[1];
  w2 = sp[2];
  w3 = sp[3];
  w4 = sp[4];
  w5 = sp[5];
  for (i = NS0 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += s0[i].nfa[j] * fa[j];
    }
    w0 += s0[i].s * Math.sin(a) + s0[i].c * Math.cos(a);
  }
  for (i = NS1 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += s1[i].nfa[j] * fa[j];
    }
    w1 += s1[i].s * Math.sin(a) + s1[i].c * Math.cos(a);
  }
  for (i = NS2 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += s2[i].nfa[j] * fa[j];
    }
    w2 += s2[i].s * Math.sin(a) + s2[i].c * Math.cos(a);
  }
  for (i = NS3 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += s3[i].nfa[j] * fa[j];
    }
    w3 += s3[i].s * Math.sin(a) + s3[i].c * Math.cos(a);
  }
  for (i = NS4 - 1; i >= 0; i--) {
    a = 0.0;
    for (j = 0; j < 8; j++) {
      a += s4[i].nfa[j] * fa[j];
    }
    w4 += s4[i].s * Math.sin(a) + s4[i].c * Math.cos(a);
  }
  s = (w0 + (w1 + (w2 + (w3 + (w4 + w5 * t) * t) * t) * t) * t) * DAS2R - x * y / 2.0;
  return s;
}
