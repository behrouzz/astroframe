// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file bp06.c.
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

import { DJM0, DJM00 } from './constants.js';
import { cr } from './cr.js';
import { fw2m } from './fw2m.js';
import { pfw06 } from './pfw06.js';
import { pmat06 } from './pmat06.js';
import { rxr } from './rxr.js';
import { tr } from './tr.js';

/**
 * JS usage:  const { rb, rp, rbp } = bp06(date1, date2)
 *
 * Frame bias and precession, IAU 2006.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double         TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    rb           double[3][3]   frame bias matrix (Note 2)
 *    rp           double[3][3]   precession matrix (Note 3)
 *    rbp          double[3][3]   bias-precession matrix (Note 4)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways,
 *    among others:
 *
 *            date1         date2
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
 * 2) The matrix rb transforms vectors from GCRS to mean J2000.0 by
 *    applying frame bias.
 *
 * 3) The matrix rp transforms vectors from mean J2000.0 to mean of
 *    date by applying precession.
 *
 * 4) The matrix rbp transforms vectors from GCRS to mean of date by
 *    applying frame bias then precession.  It is the product rp x rb.
 *
 * 5) It is permissible to re-use the same array in the returned
 *    arguments.  The arrays are filled in the order given.
 *
 * Called:
 *    pfw06     bias-precession F-W angles, IAU 2006
 *    fw2m      F-W angles to r-matrix
 *    pmat06    PB matrix, IAU 2006
 *    tr        transpose r-matrix
 *    rxr       product of two r-matrices
 *    cr        copy r-matrix
 *
 * References:
 *
 *    Capitaine, N. & Wallace, P.T., 2006, Astron.Astrophys. 450, 855
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
export function bp06(date1, date2) {
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let gamb;
  let phib;
  let psib;
  let epsa;
  let rbpw = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const _r1 = pfw06(DJM0, DJM00);
  gamb = _r1.gamb;
  phib = _r1.phib;
  psib = _r1.psib;
  epsa = _r1.epsa;
  rb = fw2m(gamb, phib, psib, epsa);
  rbpw = pmat06(date1, date2);
  rbt = tr(rb);
  rp = rxr(rbpw, rbt);
  rbp = cr(rbpw);
  return { rb, rp, rbp };
}
