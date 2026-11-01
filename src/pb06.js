// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pb06.c.
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

import { pmat06 } from './pmat06.js';
import { rz } from './rz.js';

/**
 * JS usage:  const { bzeta, bz, btheta } = pb06(date1, date2)
 *
 * This function forms three Euler angles which implement general
 * precession from epoch J2000.0, using the IAU 2006 model.  Frame
 * bias (the offset between ICRS and mean J2000.0) is included.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1,date2  double   TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    bzeta        double   1st rotation: radians cw around z
 *    bz           double   3rd rotation: radians cw around z
 *    btheta       double   2nd rotation: radians ccw around y
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
 * 2) The traditional accumulated precession angles zeta_A, z_A,
 *    theta_A cannot be obtained in the usual way, namely through
 *    polynomial expressions, because of the frame bias.  The latter
 *    means that two of the angles undergo rapid changes near this
 *    date.  They are instead the results of decomposing the
 *    precession-bias matrix obtained by using the Fukushima-Williams
 *    method, which does not suffer from the problem.  The
 *    decomposition returns values which can be used in the
 *    conventional formulation and which include frame bias.
 *
 * 3) The three angles are returned in the conventional order, which
 *    is not the same as the order of the corresponding Euler
 *    rotations.  The precession-bias matrix is
 *    R_3(-z) x R_2(+theta) x R_3(-zeta).
 *
 * 4) Should zeta_A, z_A, theta_A angles be required that do not
 *    contain frame bias, they are available by calling the SOFA
 *    function p06e.
 *
 * Called:
 *    pmat06    PB matrix, IAU 2006
 *    rz        rotate around Z-axis
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pb06(date1, date2) {
  let bzeta = 0;
  let bz = 0;
  let btheta = 0;
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let y;
  let x;
  r = pmat06(date1, date2);
  y = r[1][2];
  x = -r[0][2];
  if (x < 0.0) {
    y = -y;
    x = -x;
  }
  bz = x != 0.0 || y != 0.0 ? -Math.atan2(y, x) : 0.0;
  rz(bz, r);
  y = r[0][2];
  x = r[2][2];
  btheta = x != 0.0 || y != 0.0 ? -Math.atan2(y, x) : 0.0;
  y = -r[1][0];
  x = r[1][1];
  bzeta = x != 0.0 || y != 0.0 ? -Math.atan2(y, x) : 0.0;
  return { bzeta, bz, btheta };
}
