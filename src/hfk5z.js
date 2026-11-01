// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file hfk5z.c.
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

import { DJ00, DJY } from './constants.js';
import { anp } from './anp.js';
import { fk5hip } from './fk5hip.js';
import { pv2s } from './pv2s.js';
import { pxp } from './pxp.js';
import { rv2m } from './rv2m.js';
import { rxp } from './rxp.js';
import { rxr } from './rxr.js';
import { s2c } from './s2c.js';
import { sxp } from './sxp.js';
import { trxp } from './trxp.js';

/**
 * JS usage:  const { r5, d5, dr5, dd5 } = hfk5z(rh, dh, date1, date2)
 *
 * Transform a Hipparcos star position into FK5 J2000.0, assuming
 * zero Hipparcos proper motion.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rh            double    Hipparcos RA (radians)
 *    dh            double    Hipparcos Dec (radians)
 *    date1,date2   double    TDB date (Note 1)
 *
 * Returned (all FK5, equinox J2000.0, date date1+date2):
 *    r5            double    RA (radians)
 *    d5            double    Dec (radians)
 *    dr5           double    RA proper motion (rad/year, Note 4)
 *    dd5           double    Dec proper motion (rad/year, Note 4)
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
 * 2) The proper motion in RA is dRA/dt rather than cos(Dec)*dRA/dt.
 *
 * 3) The FK5 to Hipparcos transformation is modeled as a pure rotation
 *    and spin;  zonal errors in the FK5 catalog are not taken into
 *    account.
 *
 * 4) It was the intention that Hipparcos should be a close
 *    approximation to an inertial frame, so that distant objects have
 *    zero proper motion;  such objects have (in general) non-zero
 *    proper motion in FK5, and this function returns those fictitious
 *    proper motions.
 *
 * 5) The position returned by this function is in the FK5 J2000.0
 *    reference system but at date date1+date2.
 *
 * 6) See also fk52h, h2fk5, fk5hz.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    fk5hip    FK5 to Hipparcos rotation and spin
 *    rxp       product of r-matrix and p-vector
 *    sxp       multiply p-vector by scalar
 *    rxr       product of two r-matrices
 *    trxp      product of transpose of r-matrix and p-vector
 *    pxp       vector product of two p-vectors
 *    pv2s      pv-vector to spherical
 *    anp       normalize angle into range 0 to 2pi
 *
 * Reference:
 *
 *    F.Mignard & M.Froeschle, 2000, Astron.Astrophys. 354, 732-739.
 *
 * This revision:  2023 March 7
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function hfk5z(rh, dh, date1, date2) {
  let r5 = 0;
  let d5 = 0;
  let dr5 = 0;
  let dd5 = 0;
  let t;
  let ph = [0, 0, 0];
  let r5h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let s5h = [0, 0, 0];
  let sh = [0, 0, 0];
  let vst = [0, 0, 0];
  let rst = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let r5ht = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let pv5e = [[0, 0, 0], [0, 0, 0]];
  let vv = [0, 0, 0];
  let w;
  let r;
  let v;
  t = (date1 - DJ00 + date2) / DJY;
  ph = s2c(rh, dh);
  const _r1 = fk5hip();
  r5h = _r1.r5h;
  s5h = _r1.s5h;
  sh = rxp(r5h, s5h);
  vst = sxp(t, s5h);
  rst = rv2m(vst);
  r5ht = rxr(r5h, rst);
  pv5e[0] = trxp(r5ht, ph);
  vv = pxp(sh, ph);
  pv5e[1] = trxp(r5ht, vv);
  const _r2 = pv2s(pv5e);
  w = _r2.theta;
  d5 = _r2.phi;
  r = _r2.r;
  dr5 = _r2.td;
  dd5 = _r2.pd;
  v = _r2.rd;
  r5 = anp(w);
  return { r5, d5, dr5, dd5 };
}
