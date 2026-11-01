// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pnm80.c.
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

import { nutm80 } from './nutm80.js';
import { pmat76 } from './pmat76.js';
import { rxr } from './rxr.js';

/**
 * JS usage:  const rmatpn = pnm80(date1, date2)
 *
 * Form the matrix of precession/nutation for a given date, IAU 1976
 * precession model, IAU 1980 nutation model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2 double       TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    rmatpn         double[3][3]   combined precession/nutation matrix
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
 * 2) The matrix operates in the sense V(date) = rmatpn * V(J2000),
 *    where the p-vector V(date) is with respect to the true equatorial
 *    triad of date date1+date2 and the p-vector V(J2000) is with
 *    respect to the mean equatorial triad of epoch J2000.0.
 *
 * Called:
 *    pmat76    precession matrix, IAU 1976
 *    nutm80    nutation matrix, IAU 1980
 *    rxr       product of two r-matrices
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 3.3 (p145).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pnm80(date1, date2) {
  let rmatpn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rmatp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rmatn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  rmatp = pmat76(date1, date2);
  rmatn = nutm80(date1, date2);
  rmatpn = rxr(rmatn, rmatp);
  return rmatpn;
}
