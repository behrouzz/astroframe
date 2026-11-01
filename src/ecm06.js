// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ecm06.c.
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

import { ir } from './ir.js';
import { obl06 } from './obl06.js';
import { pmat06 } from './pmat06.js';
import { rx } from './rx.js';
import { rxr } from './rxr.js';

/**
 * JS usage:  const rm = ecm06(date1, date2)
 *
 * ICRS equatorial to ecliptic rotation matrix, IAU 2006.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double         TT as a 2-part Julian date (Note 1)
 *
 * Returned:
 *    rm           double[3][3]   ICRS to ecliptic rotation matrix
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
 * 2) The matrix is in the sense
 *
 *       E_ep = rm x P_ICRS,
 *
 *    where P_ICRS is a vector with respect to ICRS right ascension
 *    and declination axes and E_ep is the same vector with respect to
 *    the (inertial) ecliptic and equinox of date.
 *
 *    P_ICRS is a free vector, merely a direction, typically of unit
 *    magnitude, and not bound to any particular spatial origin, such
 *    as the Earth, Sun or SSB.  No assumptions are made about whether
 *    it represents starlight and embodies astrometric effects such as
 *    parallax or aberration.  The transformation is approximately that
 *    between mean J2000.0 right ascension and declination and ecliptic
 *    longitude and latitude, with only frame bias (always less than
 *    25 mas) to disturb this classical picture.
 *
 * Called:
 *    obl06     mean obliquity, IAU 2006
 *    pmat06    PB matrix, IAU 2006
 *    ir        initialize r-matrix to identity
 *    rx        rotate around X-axis
 *    rxr       product of two r-matrices
 *
 * This revision:  2023 February 26
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ecm06(date1, date2) {
  let rm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let ob;
  let bp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let e = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  ob = obl06(date1, date2);
  bp = pmat06(date1, date2);
  e = ir();
  rx(ob, e);
  rm = rxr(e, bp);
  return rm;
}
