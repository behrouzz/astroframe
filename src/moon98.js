// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file moon98.c.
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

import { DAU, DD2R, DJ00, DJC } from './constants.js';
import { ir } from './ir.js';
import { pfw06 } from './pfw06.js';
import { rx } from './rx.js';
import { rxpv } from './rxpv.js';
import { rz } from './rz.js';
import { s2pv } from './s2pv.js';

const elp0 = 218.31665436;
const elp1 = 481267.88123421;
const elp2 = -0.0015786;
const elp3 = 1.0 / 538841.0;
const elp4 = -1.0 / 65194000.0;
const d0 = 297.8501921;
const d1 = 445267.1114034;
const d2 = -0.0018819;
const d3 = 1.0 / 545868.0;
const d4 = 1.0 / 113065000.0;
const em0 = 357.5291092;
const em1 = 35999.0502909;
const em2 = -0.0001536;
const em3 = 1.0 / 24490000.0;
const em4 = 0.0;
const emp0 = 134.9633964;
const emp1 = 477198.8675055;
const emp2 = 0.0087414;
const emp3 = 1.0 / 69699.0;
const emp4 = -1.0 / 14712000.0;
const f0 = 93.2720950;
const f1 = 483202.0175233;
const f2 = -0.0036539;
const f3 = 1.0 / 3526000.0;
const f4 = 1.0 / 863310000.0;
const a10 = 119.75;
const a11 = 131.849;
const a20 = 53.09;
const a21 = 479264.290;
const a30 = 313.45;
const a31 = 481266.484;
const al1 = 0.003958;
const al2 = 0.001962;
const al3 = 0.000318;
const ab1 = -0.002235;
const ab2 = 0.000382;
const ab3 = 0.000175;
const ab4 = 0.000175;
const ab5 = 0.000127;
const ab6 = -0.000115;
const r0 = 385000560.0;
const e1 = -0.002516;
const e2 = -0.0000074;
const tlr = [
  { nd: 0, nem: 0, nemp: 1, nf: 0, coefl: 6.288774, coefr: -20905355.0 },
  { nd: 2, nem: 0, nemp: -1, nf: 0, coefl: 1.274027, coefr: -3699111.0 },
  { nd: 2, nem: 0, nemp: 0, nf: 0, coefl: 0.658314, coefr: -2955968.0 },
  { nd: 0, nem: 0, nemp: 2, nf: 0, coefl: 0.213618, coefr: -569925.0 },
  { nd: 0, nem: 1, nemp: 0, nf: 0, coefl: -0.185116, coefr: 48888.0 },
  { nd: 0, nem: 0, nemp: 0, nf: 2, coefl: -0.114332, coefr: -3149.0 },
  { nd: 2, nem: 0, nemp: -2, nf: 0, coefl: 0.058793, coefr: 246158.0 },
  { nd: 2, nem: -1, nemp: -1, nf: 0, coefl: 0.057066, coefr: -152138.0 },
  { nd: 2, nem: 0, nemp: 1, nf: 0, coefl: 0.053322, coefr: -170733.0 },
  { nd: 2, nem: -1, nemp: 0, nf: 0, coefl: 0.045758, coefr: -204586.0 },
  { nd: 0, nem: 1, nemp: -1, nf: 0, coefl: -0.040923, coefr: -129620.0 },
  { nd: 1, nem: 0, nemp: 0, nf: 0, coefl: -0.034720, coefr: 108743.0 },
  { nd: 0, nem: 1, nemp: 1, nf: 0, coefl: -0.030383, coefr: 104755.0 },
  { nd: 2, nem: 0, nemp: 0, nf: -2, coefl: 0.015327, coefr: 10321.0 },
  { nd: 0, nem: 0, nemp: 1, nf: 2, coefl: -0.012528, coefr: 0.0 },
  { nd: 0, nem: 0, nemp: 1, nf: -2, coefl: 0.010980, coefr: 79661.0 },
  { nd: 4, nem: 0, nemp: -1, nf: 0, coefl: 0.010675, coefr: -34782.0 },
  { nd: 0, nem: 0, nemp: 3, nf: 0, coefl: 0.010034, coefr: -23210.0 },
  { nd: 4, nem: 0, nemp: -2, nf: 0, coefl: 0.008548, coefr: -21636.0 },
  { nd: 2, nem: 1, nemp: -1, nf: 0, coefl: -0.007888, coefr: 24208.0 },
  { nd: 2, nem: 1, nemp: 0, nf: 0, coefl: -0.006766, coefr: 30824.0 },
  { nd: 1, nem: 0, nemp: -1, nf: 0, coefl: -0.005163, coefr: -8379.0 },
  { nd: 1, nem: 1, nemp: 0, nf: 0, coefl: 0.004987, coefr: -16675.0 },
  { nd: 2, nem: -1, nemp: 1, nf: 0, coefl: 0.004036, coefr: -12831.0 },
  { nd: 2, nem: 0, nemp: 2, nf: 0, coefl: 0.003994, coefr: -10445.0 },
  { nd: 4, nem: 0, nemp: 0, nf: 0, coefl: 0.003861, coefr: -11650.0 },
  { nd: 2, nem: 0, nemp: -3, nf: 0, coefl: 0.003665, coefr: 14403.0 },
  { nd: 0, nem: 1, nemp: -2, nf: 0, coefl: -0.002689, coefr: -7003.0 },
  { nd: 2, nem: 0, nemp: -1, nf: 2, coefl: -0.002602, coefr: 0.0 },
  { nd: 2, nem: -1, nemp: -2, nf: 0, coefl: 0.002390, coefr: 10056.0 },
  { nd: 1, nem: 0, nemp: 1, nf: 0, coefl: -0.002348, coefr: 6322.0 },
  { nd: 2, nem: -2, nemp: 0, nf: 0, coefl: 0.002236, coefr: -9884.0 },
  { nd: 0, nem: 1, nemp: 2, nf: 0, coefl: -0.002120, coefr: 5751.0 },
  { nd: 0, nem: 2, nemp: 0, nf: 0, coefl: -0.002069, coefr: 0.0 },
  { nd: 2, nem: -2, nemp: -1, nf: 0, coefl: 0.002048, coefr: -4950.0 },
  { nd: 2, nem: 0, nemp: 1, nf: -2, coefl: -0.001773, coefr: 4130.0 },
  { nd: 2, nem: 0, nemp: 0, nf: 2, coefl: -0.001595, coefr: 0.0 },
  { nd: 4, nem: -1, nemp: -1, nf: 0, coefl: 0.001215, coefr: -3958.0 },
  { nd: 0, nem: 0, nemp: 2, nf: 2, coefl: -0.001110, coefr: 0.0 },
  { nd: 3, nem: 0, nemp: -1, nf: 0, coefl: -0.000892, coefr: 3258.0 },
  { nd: 2, nem: 1, nemp: 1, nf: 0, coefl: -0.000810, coefr: 2616.0 },
  { nd: 4, nem: -1, nemp: -2, nf: 0, coefl: 0.000759, coefr: -1897.0 },
  { nd: 0, nem: 2, nemp: -1, nf: 0, coefl: -0.000713, coefr: -2117.0 },
  { nd: 2, nem: 2, nemp: -1, nf: 0, coefl: -0.000700, coefr: 2354.0 },
  { nd: 2, nem: 1, nemp: -2, nf: 0, coefl: 0.000691, coefr: 0.0 },
  { nd: 2, nem: -1, nemp: 0, nf: -2, coefl: 0.000596, coefr: 0.0 },
  { nd: 4, nem: 0, nemp: 1, nf: 0, coefl: 0.000549, coefr: -1423.0 },
  { nd: 0, nem: 0, nemp: 4, nf: 0, coefl: 0.000537, coefr: -1117.0 },
  { nd: 4, nem: -1, nemp: 0, nf: 0, coefl: 0.000520, coefr: -1571.0 },
  { nd: 1, nem: 0, nemp: -2, nf: 0, coefl: -0.000487, coefr: -1739.0 },
  { nd: 2, nem: 1, nemp: 0, nf: -2, coefl: -0.000399, coefr: 0.0 },
  { nd: 0, nem: 0, nemp: 2, nf: -2, coefl: -0.000381, coefr: -4421.0 },
  { nd: 1, nem: 1, nemp: 1, nf: 0, coefl: 0.000351, coefr: 0.0 },
  { nd: 3, nem: 0, nemp: -2, nf: 0, coefl: -0.000340, coefr: 0.0 },
  { nd: 4, nem: 0, nemp: -3, nf: 0, coefl: 0.000330, coefr: 0.0 },
  { nd: 2, nem: -1, nemp: 2, nf: 0, coefl: 0.000327, coefr: 0.0 },
  { nd: 0, nem: 2, nemp: 1, nf: 0, coefl: -0.000323, coefr: 1165.0 },
  { nd: 1, nem: 1, nemp: -1, nf: 0, coefl: 0.000299, coefr: 0.0 },
  { nd: 2, nem: 0, nemp: 3, nf: 0, coefl: 0.000294, coefr: 0.0 },
  { nd: 2, nem: 0, nemp: -1, nf: -2, coefl: 0.000000, coefr: 8752.0 },
];
const NLR = Math.trunc((tlr.length * 1) / 1);
const tb = [
  { nd: 0, nem: 0, nemp: 0, nf: 1, coefb: 5.128122 },
  { nd: 0, nem: 0, nemp: 1, nf: 1, coefb: 0.280602 },
  { nd: 0, nem: 0, nemp: 1, nf: -1, coefb: 0.277693 },
  { nd: 2, nem: 0, nemp: 0, nf: -1, coefb: 0.173237 },
  { nd: 2, nem: 0, nemp: -1, nf: 1, coefb: 0.055413 },
  { nd: 2, nem: 0, nemp: -1, nf: -1, coefb: 0.046271 },
  { nd: 2, nem: 0, nemp: 0, nf: 1, coefb: 0.032573 },
  { nd: 0, nem: 0, nemp: 2, nf: 1, coefb: 0.017198 },
  { nd: 2, nem: 0, nemp: 1, nf: -1, coefb: 0.009266 },
  { nd: 0, nem: 0, nemp: 2, nf: -1, coefb: 0.008822 },
  { nd: 2, nem: -1, nemp: 0, nf: -1, coefb: 0.008216 },
  { nd: 2, nem: 0, nemp: -2, nf: -1, coefb: 0.004324 },
  { nd: 2, nem: 0, nemp: 1, nf: 1, coefb: 0.004200 },
  { nd: 2, nem: 1, nemp: 0, nf: -1, coefb: -0.003359 },
  { nd: 2, nem: -1, nemp: -1, nf: 1, coefb: 0.002463 },
  { nd: 2, nem: -1, nemp: 0, nf: 1, coefb: 0.002211 },
  { nd: 2, nem: -1, nemp: -1, nf: -1, coefb: 0.002065 },
  { nd: 0, nem: 1, nemp: -1, nf: -1, coefb: -0.001870 },
  { nd: 4, nem: 0, nemp: -1, nf: -1, coefb: 0.001828 },
  { nd: 0, nem: 1, nemp: 0, nf: 1, coefb: -0.001794 },
  { nd: 0, nem: 0, nemp: 0, nf: 3, coefb: -0.001749 },
  { nd: 0, nem: 1, nemp: -1, nf: 1, coefb: -0.001565 },
  { nd: 1, nem: 0, nemp: 0, nf: 1, coefb: -0.001491 },
  { nd: 0, nem: 1, nemp: 1, nf: 1, coefb: -0.001475 },
  { nd: 0, nem: 1, nemp: 1, nf: -1, coefb: -0.001410 },
  { nd: 0, nem: 1, nemp: 0, nf: -1, coefb: -0.001344 },
  { nd: 1, nem: 0, nemp: 0, nf: -1, coefb: -0.001335 },
  { nd: 0, nem: 0, nemp: 3, nf: 1, coefb: 0.001107 },
  { nd: 4, nem: 0, nemp: 0, nf: -1, coefb: 0.001021 },
  { nd: 4, nem: 0, nemp: -1, nf: 1, coefb: 0.000833 },
  { nd: 0, nem: 0, nemp: 1, nf: -3, coefb: 0.000777 },
  { nd: 4, nem: 0, nemp: -2, nf: 1, coefb: 0.000671 },
  { nd: 2, nem: 0, nemp: 0, nf: -3, coefb: 0.000607 },
  { nd: 2, nem: 0, nemp: 2, nf: -1, coefb: 0.000596 },
  { nd: 2, nem: -1, nemp: 1, nf: -1, coefb: 0.000491 },
  { nd: 2, nem: 0, nemp: -2, nf: 1, coefb: -0.000451 },
  { nd: 0, nem: 0, nemp: 3, nf: -1, coefb: 0.000439 },
  { nd: 2, nem: 0, nemp: 2, nf: 1, coefb: 0.000422 },
  { nd: 2, nem: 0, nemp: -3, nf: -1, coefb: 0.000421 },
  { nd: 2, nem: 1, nemp: -1, nf: 1, coefb: -0.000366 },
  { nd: 2, nem: 1, nemp: 0, nf: 1, coefb: -0.000351 },
  { nd: 4, nem: 0, nemp: 0, nf: 1, coefb: 0.000331 },
  { nd: 2, nem: -1, nemp: 1, nf: 1, coefb: 0.000315 },
  { nd: 2, nem: -2, nemp: 0, nf: -1, coefb: 0.000302 },
  { nd: 0, nem: 0, nemp: 1, nf: 3, coefb: -0.000283 },
  { nd: 2, nem: 1, nemp: 1, nf: -1, coefb: -0.000229 },
  { nd: 1, nem: 1, nemp: 0, nf: -1, coefb: 0.000223 },
  { nd: 1, nem: 1, nemp: 0, nf: 1, coefb: 0.000223 },
  { nd: 0, nem: 1, nemp: -2, nf: -1, coefb: -0.000220 },
  { nd: 2, nem: 1, nemp: -1, nf: -1, coefb: -0.000220 },
  { nd: 1, nem: 0, nemp: 1, nf: 1, coefb: -0.000185 },
  { nd: 2, nem: -1, nemp: -2, nf: -1, coefb: 0.000181 },
  { nd: 0, nem: 1, nemp: 2, nf: 1, coefb: -0.000177 },
  { nd: 4, nem: 0, nemp: -2, nf: -1, coefb: 0.000176 },
  { nd: 4, nem: -1, nemp: -1, nf: -1, coefb: 0.000166 },
  { nd: 1, nem: 0, nemp: 1, nf: -1, coefb: -0.000164 },
  { nd: 4, nem: 0, nemp: 1, nf: -1, coefb: 0.000132 },
  { nd: 1, nem: 0, nemp: -1, nf: -1, coefb: -0.000119 },
  { nd: 4, nem: -1, nemp: 0, nf: -1, coefb: 0.000115 },
  { nd: 2, nem: -2, nemp: 0, nf: 1, coefb: 0.000107 },
];
const NB = Math.trunc((tb.length * 1) / 1);

/**
 * JS usage:  const pv = moon98(date1, date2)
 *
 * Approximate geocentric position and velocity of the Moon.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * n.b. Not IAU-endorsed and without canonical status.
 *
 * Given:
 *    date1  double         TT date part A (Notes 1,4)
 *    date2  double         TT date part B (Notes 1,4)
 *
 * Returned:
 *    pv     double[2][3]   Moon p,v, GCRS (au, au/d, Note 5)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways, among
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
 *    good compromises between resolution and convenience.  The limited
 *    accuracy of the present algorithm is such that any of the methods
 *    is satisfactory.
 *
 * 2) This function is a full implementation of the algorithm
 *    published by Meeus (see reference) except that the light-time
 *    correction to the Moon's mean longitude has been omitted.
 *
 * 3) Comparisons with ELP/MPP02 over the interval 1950-2100 gave RMS
 *    errors of 2.9 arcsec in geocentric direction, 6.1 km in position
 *    and 36 mm/s in velocity.  The worst case errors were 18.3 arcsec
 *    in geocentric direction, 31.7 km in position and 172 mm/s in
 *    velocity.
 *
 * 4) The original algorithm is expressed in terms of "dynamical time",
 *    which can either be TDB or TT without any significant change in
 *    accuracy.  UT cannot be used without incurring significant errors
 *    (30 arcsec in the present era) due to the Moon's 0.5 arcsec/sec
 *    movement.
 *
 * 5) The result is with respect to the GCRS (the same as J2000.0 mean
 *    equator and equinox to within 23 mas).
 *
 * 6) Velocity is obtained by a complete analytical differentiation
 *    of the Meeus model.
 *
 * 7) The Meeus algorithm generates position and velocity in mean
 *    ecliptic coordinates of date, which the present function then
 *    rotates into GCRS.  Because the ecliptic system is precessing,
 *    there is a coupling between this spin (about 1.4 degrees per
 *    century) and the Moon position that produces a small velocity
 *    contribution.  In the present function this effect is neglected
 *    as it corresponds to a maximum difference of less than 3 mm/s and
 *    increases the RMS error by only 0.4%.
 *
 * References:
 *
 *    Meeus, J., Astronomical Algorithms, 2nd edition, Willmann-Bell,
 *    1998, p337.
 *
 *    Simon, J.L., Bretagnon, P., Chapront, J., Chapront-Touze, M.,
 *    Francou, G. & Laskar, J., Astron.Astrophys., 1994, 282, 663
 *
 * Defined in sofam.h:
 *    DAU           astronomical unit (m)
 *    DJC           days per Julian century
 *    DJ00          reference epoch (J2000.0), Julian Date
 *    DD2R          degrees to radians
 *
 * Called:
 *    s2pv      spherical coordinates to pv-vector
 *    pfw06     bias-precession F-W angles, IAU 2006
 *    ir        initialize r-matrix to identity
 *    rz        rotate around Z-axis
 *    rx        rotate around X-axis
 *    rxpv      product of r-matrix and pv-vector
 *
 * This revision:  2023 March 20
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function moon98(date1, date2) {
  let pv = [[0, 0, 0], [0, 0, 0]];
  let elp;
  let delp;
  let d;
  let dd;
  let em;
  let dem;
  let emp;
  let demp;
  let f;
  let df;
  let a1;
  let da1;
  let a2;
  let da2;
  let a3;
  let da3;
  let e;
  let de;
  let esq;
  let desq;
  let n;
  let i;
  let t;
  let elpmf;
  let delpmf;
  let vel;
  let vdel;
  let vr;
  let vdr;
  let a1mf;
  let da1mf;
  let a1pf;
  let da1pf;
  let dlpmp;
  let slpmp;
  let vb;
  let vdb;
  let v;
  let dv;
  let emn;
  let empn;
  let dn;
  let fn;
  let en;
  let den;
  let arg;
  let darg;
  let farg;
  let coeff;
  let el;
  let del;
  let r;
  let dr;
  let b;
  let db;
  let gamb;
  let phib;
  let psib;
  let epsa;
  let rm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  t = (date1 - DJ00 + date2) / DJC;
  elp = DD2R * ((elp0 + (elp1 + (elp2 + (elp3 + elp4 * t) * t) * t) * t) % 360.0);
  delp = DD2R * (elp1 + (elp2 * 2.0 + (elp3 * 3.0 + elp4 * 4.0 * t) * t) * t);
  d = DD2R * ((d0 + (d1 + (d2 + (d3 + d4 * t) * t) * t) * t) % 360.0);
  dd = DD2R * (d1 + (d2 * 2.0 + (d3 * 3.0 + d4 * 4.0 * t) * t) * t);
  em = DD2R * ((em0 + (em1 + (em2 + (em3 + em4 * t) * t) * t) * t) % 360.0);
  dem = DD2R * (em1 + (em2 * 2.0 + (em3 * 3.0 + em4 * 4.0 * t) * t) * t);
  emp = DD2R * ((emp0 + (emp1 + (emp2 + (emp3 + emp4 * t) * t) * t) * t) % 360.0);
  demp = DD2R * (emp1 + (emp2 * 2.0 + (emp3 * 3.0 + emp4 * 4.0 * t) * t) * t);
  f = DD2R * ((f0 + (f1 + (f2 + (f3 + f4 * t) * t) * t) * t) % 360.0);
  df = DD2R * (f1 + (f2 * 2.0 + (f3 * 3.0 + f4 * 4.0 * t) * t) * t);
  a1 = DD2R * (a10 + a11 * t);
  da1 = DD2R * al1;
  a2 = DD2R * (a20 + a21 * t);
  da2 = DD2R * a21;
  a3 = DD2R * (a30 + a31 * t);
  da3 = DD2R * a31;
  e = 1.0 + (e1 + e2 * t) * t;
  de = e1 + 2.0 * e2 * t;
  esq = e * e;
  desq = 2.0 * e * de;
  elpmf = elp - f;
  delpmf = delp - df;
  vel = al1 * Math.sin(a1) + al2 * Math.sin(elpmf) + al3 * Math.sin(a2);
  vdel = al1 * Math.cos(a1) * da1 + al2 * Math.cos(elpmf) * delpmf + al3 * Math.cos(a2) * da2;
  vr = 0.0;
  vdr = 0.0;
  a1mf = a1 - f;
  da1mf = da1 - df;
  a1pf = a1 + f;
  da1pf = da1 + df;
  dlpmp = elp - emp;
  slpmp = elp + emp;
  vb = ab1 * Math.sin(elp) + ab2 * Math.sin(a3) + ab3 * Math.sin(a1mf) + ab4 * Math.sin(a1pf) + ab5 * Math.sin(dlpmp) + ab6 * Math.sin(slpmp);
  vdb = ab1 * Math.cos(elp) * delp + ab2 * Math.cos(a3) * da3 + ab3 * Math.cos(a1mf) * da1mf + ab4 * Math.cos(a1pf) * da1pf + ab5 * Math.cos(dlpmp) * (delp - demp) + ab6 * Math.cos(slpmp) * (delp + demp);
  for (n = NLR - 1; n >= 0; n--) {
    dn = tlr[n].nd;
    emn = i = tlr[n].nem;
    empn = tlr[n].nemp;
    fn = tlr[n].nf;
    switch (Math.abs(i)) {
      case 1:
        en = e;
        den = de;
        break;
      case 2:
        en = esq;
        den = desq;
        break;
      default:
        en = 1.0;
        den = 0.0;
    }
    arg = dn * d + emn * em + empn * emp + fn * f;
    darg = dn * dd + emn * dem + empn * demp + fn * df;
    farg = Math.sin(arg);
    v = farg * en;
    dv = Math.cos(arg) * darg * en + farg * den;
    coeff = tlr[n].coefl;
    vel += coeff * v;
    vdel += coeff * dv;
    farg = Math.cos(arg);
    v = farg * en;
    dv = -Math.sin(arg) * darg * en + farg * den;
    coeff = tlr[n].coefr;
    vr += coeff * v;
    vdr += coeff * dv;
  }
  el = elp + DD2R * vel;
  del = (delp + DD2R * vdel) / DJC;
  r = (vr + r0) / DAU;
  dr = vdr / DAU / DJC;
  for (n = NB - 1; n >= 0; n--) {
    dn = tb[n].nd;
    emn = i = tb[n].nem;
    empn = tb[n].nemp;
    fn = tb[n].nf;
    switch (Math.abs(i)) {
      case 1:
        en = e;
        den = de;
        break;
      case 2:
        en = esq;
        den = desq;
        break;
      default:
        en = 1.0;
        den = 0.0;
    }
    arg = dn * d + emn * em + empn * emp + fn * f;
    darg = dn * dd + emn * dem + empn * demp + fn * df;
    farg = Math.sin(arg);
    v = farg * en;
    dv = Math.cos(arg) * darg * en + farg * den;
    coeff = tb[n].coefb;
    vb += coeff * v;
    vdb += coeff * dv;
  }
  b = vb * DD2R;
  db = vdb * DD2R / DJC;
  pv = s2pv(el, b, r, del, db, dr);
  const _r1 = pfw06(date1, date2);
  gamb = _r1.gamb;
  phib = _r1.phib;
  psib = _r1.psib;
  epsa = _r1.epsa;
  rm = ir();
  rz(psib, rm);
  rx(-phib, rm);
  rz(-gamb, rm);
  pv = rxpv(rm, pv);
  return pv;
}
