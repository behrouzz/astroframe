// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file nut80.c.
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

const x = [
  { nl: 0, nlp: 0, nf: 0, nd: 0, nom: 1, sp: -171996.0, spt: -174.2, ce: 92025.0, cet: 8.9 },
  { nl: 0, nlp: 0, nf: 0, nd: 0, nom: 2, sp: 2062.0, spt: 0.2, ce: -895.0, cet: 0.5 },
  { nl: -2, nlp: 0, nf: 2, nd: 0, nom: 1, sp: 46.0, spt: 0.0, ce: -24.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: -2, nd: 0, nom: 0, sp: 11.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 0, nom: 2, sp: -3.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 1, nlp: -1, nf: 0, nd: -1, nom: 0, sp: -3.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: -2, nf: 2, nd: -2, nom: 1, sp: -2.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: -2, nd: 0, nom: 1, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: -2, nom: 2, sp: -13187.0, spt: -1.6, ce: 5736.0, cet: -3.1 },
  { nl: 0, nlp: 1, nf: 0, nd: 0, nom: 0, sp: 1426.0, spt: -3.4, ce: 54.0, cet: -0.1 },
  { nl: 0, nlp: 1, nf: 2, nd: -2, nom: 2, sp: -517.0, spt: 1.2, ce: 224.0, cet: -0.6 },
  { nl: 0, nlp: -1, nf: 2, nd: -2, nom: 2, sp: 217.0, spt: -0.5, ce: -95.0, cet: 0.3 },
  { nl: 0, nlp: 0, nf: 2, nd: -2, nom: 1, sp: 129.0, spt: 0.1, ce: -70.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: -2, nom: 0, sp: 48.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: -2, nom: 0, sp: -22.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 2, nf: 0, nd: 0, nom: 0, sp: 17.0, spt: -0.1, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 0, nom: 1, sp: -15.0, spt: 0.0, ce: 9.0, cet: 0.0 },
  { nl: 0, nlp: 2, nf: 2, nd: -2, nom: 2, sp: -16.0, spt: 0.1, ce: 7.0, cet: 0.0 },
  { nl: 0, nlp: -1, nf: 0, nd: 0, nom: 1, sp: -12.0, spt: 0.0, ce: 6.0, cet: 0.0 },
  { nl: -2, nlp: 0, nf: 0, nd: 2, nom: 1, sp: -6.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 0, nlp: -1, nf: 2, nd: -2, nom: 1, sp: -5.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: -2, nom: 1, sp: 4.0, spt: 0.0, ce: -2.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 2, nd: -2, nom: 1, sp: 4.0, spt: 0.0, ce: -2.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: -1, nom: 0, sp: -4.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 2, nlp: 1, nf: 0, nd: -2, nom: 0, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: -2, nd: 2, nom: 1, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: -2, nd: 2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 0, nom: 2, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 1, nom: 1, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 2, nd: -2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 2, sp: -2274.0, spt: -0.2, ce: 977.0, cet: -0.5 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 0, sp: 712.0, spt: 0.1, ce: -7.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 1, sp: -386.0, spt: -0.4, ce: 200.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 2, sp: -301.0, spt: 0.0, ce: 129.0, cet: -0.1 },
  { nl: 1, nlp: 0, nf: 0, nd: -2, nom: 0, sp: -158.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 0, nom: 2, sp: 123.0, spt: 0.0, ce: -53.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 2, nom: 0, sp: 63.0, spt: 0.0, ce: -2.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 1, sp: 63.0, spt: 0.1, ce: -33.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 0, nom: 1, sp: -58.0, spt: -0.1, ce: 32.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 2, nom: 2, sp: -59.0, spt: 0.0, ce: 26.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 1, sp: -51.0, spt: 0.0, ce: 27.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 2, nom: 2, sp: -38.0, spt: 0.0, ce: 16.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: 0, nom: 0, sp: 29.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: -2, nom: 2, sp: 29.0, spt: 0.0, ce: -12.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 2, nd: 0, nom: 2, sp: -31.0, spt: 0.0, ce: 13.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 0, sp: 26.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 0, nom: 1, sp: 21.0, spt: 0.0, ce: -10.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 2, nom: 1, sp: 16.0, spt: 0.0, ce: -8.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: -2, nom: 1, sp: -13.0, spt: 0.0, ce: 7.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 2, nom: 1, sp: -10.0, spt: 0.0, ce: 5.0, cet: 0.0 },
  { nl: 1, nlp: 1, nf: 0, nd: -2, nom: 0, sp: -7.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 2, nd: 0, nom: 2, sp: 7.0, spt: 0.0, ce: -3.0, cet: 0.0 },
  { nl: 0, nlp: -1, nf: 2, nd: 0, nom: 2, sp: -7.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 2, nom: 2, sp: -8.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 2, nom: 0, sp: 6.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 2, nd: -2, nom: 2, sp: 6.0, spt: 0.0, ce: -3.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 2, nom: 1, sp: -6.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 2, nom: 1, sp: -7.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: -2, nom: 1, sp: 6.0, spt: 0.0, ce: -3.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 0, nd: -2, nom: 1, sp: -5.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 1, nlp: -1, nf: 0, nd: 0, nom: 0, sp: 5.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 2, nd: 0, nom: 1, sp: -5.0, spt: 0.0, ce: 3.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 0, nd: -2, nom: 0, sp: -4.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: -2, nd: 0, nom: 0, sp: 4.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 1, nom: 0, sp: -4.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 1, nf: 0, nd: 0, nom: 0, sp: -3.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 0, sp: 3.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: -1, nf: 2, nd: 0, nom: 2, sp: -3.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: -1, nlp: -1, nf: 2, nd: 2, nom: 2, sp: -3.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: -2, nlp: 0, nf: 0, nd: 0, nom: 1, sp: -2.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 3, nlp: 0, nf: 2, nd: 0, nom: 2, sp: -3.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 0, nlp: -1, nf: 2, nd: 2, nom: 2, sp: -3.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 1, nlp: 1, nf: 2, nd: 0, nom: 2, sp: 2.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: -2, nom: 1, sp: -2.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: 0, nom: 1, sp: 2.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 2, sp: -2.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 3, nlp: 0, nf: 0, nd: 0, nom: 0, sp: 2.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 1, nom: 2, sp: 2.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 0, nom: 2, sp: 1.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: -4, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 2, nom: 2, sp: 1.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 4, nom: 2, sp: -2.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: -4, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 1, nf: 2, nd: -2, nom: 2, sp: 1.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 2, nom: 1, sp: -1.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 4, nom: 2, sp: -1.0, spt: 0.0, ce: 1.0, cet: 0.0 },
  { nl: -1, nlp: 0, nf: 4, nd: 0, nom: 2, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: -1, nf: 0, nd: -2, nom: 0, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 2, nd: -2, nom: 1, sp: 1.0, spt: 0.0, ce: -1.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 2, nd: 2, nom: 2, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 2, nom: 1, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 4, nd: -2, nom: 2, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 3, nlp: 0, nf: 2, nd: -2, nom: 2, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: -2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 2, nd: 0, nom: 1, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: -1, nlp: -1, nf: 0, nd: 2, nom: 1, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: -2, nd: 0, nom: 1, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: -1, nom: 2, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: -2, nd: -2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: -1, nf: 2, nd: 0, nom: 1, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 1, nf: 0, nd: -2, nom: 1, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 1, nlp: 0, nf: -2, nd: 2, nom: 0, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 2, nlp: 0, nf: 0, nd: 2, nom: 0, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 4, nom: 2, sp: -1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 1, nom: 0, sp: 1.0, spt: 0.0, ce: 0.0, cet: 0.0 },
];

/**
 * JS usage:  const { dpsi, deps } = nut80(date1, date2)
 *
 * Nutation, IAU 1980 model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2   double    TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    dpsi          double    nutation in longitude (radians)
 *    deps          double    nutation in obliquity (radians)
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
 * 2) The nutation components are with respect to the ecliptic of
 *    date.
 *
 * Called:
 *    anpm      normalize angle into range +/- pi
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 3.222 (p111).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function nut80(date1, date2) {
  let dpsi = 0;
  let deps = 0;
  let t;
  let el;
  let elp;
  let f;
  let d;
  let om;
  let dp;
  let de;
  let arg;
  let s;
  let c;
  let j;
  const U2R = DAS2R / 1e4;
  const NT = Math.trunc((x.length * 1) / 1);
  t = (date1 - DJ00 + date2) / DJC;
  el = anpm((485866.733 + (715922.633 + (31.310 + 0.064 * t) * t) * t) * DAS2R + 1325.0 * t % 1.0 * D2PI);
  elp = anpm((1287099.804 + (1292581.224 + (-0.577 - 0.012 * t) * t) * t) * DAS2R + 99.0 * t % 1.0 * D2PI);
  f = anpm((335778.877 + (295263.137 + (-13.257 + 0.011 * t) * t) * t) * DAS2R + 1342.0 * t % 1.0 * D2PI);
  d = anpm((1072261.307 + (1105601.328 + (-6.891 + 0.019 * t) * t) * t) * DAS2R + 1236.0 * t % 1.0 * D2PI);
  om = anpm((450160.280 + (-482890.539 + (7.455 + 0.008 * t) * t) * t) * DAS2R + -5.0 * t % 1.0 * D2PI);
  dp = 0.0;
  de = 0.0;
  for (j = NT - 1; j >= 0; j--) {
    arg = x[j].nl * el + x[j].nlp * elp + x[j].nf * f + x[j].nd * d + x[j].nom * om;
    s = x[j].sp + x[j].spt * t;
    c = x[j].ce + x[j].cet * t;
    if (s != 0.0) {
      dp += s * Math.sin(arg);
    }
    if (c != 0.0) {
      de += c * Math.cos(arg);
    }
  }
  dpsi = dp * U2R;
  deps = de * U2R;
  return { dpsi, deps };
}
