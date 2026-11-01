// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk5hz.c.
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
import { c2s } from './c2s.js';
import { fk5hip } from './fk5hip.js';
import { rv2m } from './rv2m.js';
import { rxp } from './rxp.js';
import { s2c } from './s2c.js';
import { sxp } from './sxp.js';
import { trxp } from './trxp.js';

/**
 * JS usage:  const { rh, dh } = fk5hz(r5, d5, date1, date2)
 *
 * Transform an FK5 (J2000.0) star position into the system of the
 * Hipparcos catalog, assuming zero Hipparcos proper motion.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    r5           double   FK5 RA (radians), equinox J2000.0, at date
 *    d5           double   FK5 Dec (radians), equinox J2000.0, at date
 *    date1,date2  double   TDB date (Notes 1,2)
 *
 * Returned:
 *    rh           double   Hipparcos RA (radians)
 *    dh           double   Hipparcos Dec (radians)
 *
 * Notes:
 *
 * 1) This function converts a star position from the FK5 system to
 *    the Hipparcos system, in such a way that the Hipparcos proper
 *    motion is zero.  Because such a star has, in general, a non-zero
 *    proper motion in the FK5 system, the function requires the date
 *    at which the position in the FK5 system was determined.
 *
 * 2) The TT date date1+date2 is a Julian Date, apportioned in any
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
 * 3) The FK5 to Hipparcos transformation is modeled as a pure
 *    rotation and spin;  zonal errors in the FK5 catalog are not
 *    taken into account.
 *
 * 4) The position returned by this function is in the Hipparcos
 *    reference system but at date date1+date2.
 *
 * 5) See also fk52h, h2fk5, hfk5z.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    fk5hip    FK5 to Hipparcos rotation and spin
 *    sxp       multiply p-vector by scalar
 *    rv2m      r-vector to r-matrix
 *    trxp      product of transpose of r-matrix and p-vector
 *    pxp       vector product of two p-vectors
 *    c2s       p-vector to spherical
 *    anp       normalize angle into range 0 to 2pi
 *
 * Reference:
 *
 *    F.Mignard & M.Froeschle, 2000, Astron.Astrophys. 354, 732-739.
 *
 * This revision:  2023 March 6
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk5hz(r5, d5, date1, date2) {
  let rh = 0;
  let dh = 0;
  let t;
  let p5e = [0, 0, 0];
  let r5h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let s5h = [0, 0, 0];
  let vst = [0, 0, 0];
  let rst = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let p5 = [0, 0, 0];
  let ph = [0, 0, 0];
  let w;
  t = -(date1 - DJ00 + date2) / DJY;
  p5e = s2c(r5, d5);
  const _r1 = fk5hip();
  r5h = _r1.r5h;
  s5h = _r1.s5h;
  vst = sxp(t, s5h);
  rst = rv2m(vst);
  p5 = trxp(rst, p5e);
  ph = rxp(r5h, p5);
  const _r2 = c2s(ph);
  w = _r2.theta;
  dh = _r2.phi;
  rh = anp(w);
  return { rh, dh };
}
