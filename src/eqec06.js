// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file eqec06.c.
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

import { anp } from './anp.js';
import { anpm } from './anpm.js';
import { c2s } from './c2s.js';
import { ecm06 } from './ecm06.js';
import { rxp } from './rxp.js';
import { s2c } from './s2c.js';

/**
 * JS usage:  const { dl, db } = eqec06(date1, date2, dr, dd)
 *
 * Transformation from ICRS equatorial coordinates to ecliptic
 * coordinates (mean equinox and ecliptic of date) using IAU 2006
 * precession model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2 double TT as a 2-part Julian date (Note 1)
 *    dr,dd       double ICRS right ascension and declination (radians)
 *
 * Returned:
 *    dl,db       double ecliptic longitude and latitude (radians)
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
 * 2) No assumptions are made about whether the coordinates represent
 *    starlight and embody astrometric effects such as parallax or
 *    aberration.
 *
 * 3) The transformation is approximately that from mean J2000.0 right
 *    ascension and declination to ecliptic longitude and latitude
 *    (mean equinox and ecliptic of date), with only frame bias (always
 *    less than 25 mas) to disturb this classical picture.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    ecm06     J2000.0 to ecliptic rotation matrix, IAU 2006
 *    rxp       product of r-matrix and p-vector
 *    c2s       unit vector to spherical coordinates
 *    anp       normalize angle into range 0 to 2pi
 *    anpm      normalize angle into range +/- pi
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function eqec06(date1, date2, dr, dd) {
  let dl = 0;
  let db = 0;
  let rm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let v1 = [0, 0, 0];
  let v2 = [0, 0, 0];
  let a;
  let b;
  v1 = s2c(dr, dd);
  rm = ecm06(date1, date2);
  v2 = rxp(rm, v1);
  const _r1 = c2s(v2);
  a = _r1.theta;
  b = _r1.phi;
  dl = anp(a);
  db = anpm(b);
  return { dl, db };
}
