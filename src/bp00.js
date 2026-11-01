// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file bp00.c.
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
import { bi00 } from './bi00.js';
import { cr } from './cr.js';
import { ir } from './ir.js';
import { pr00 } from './pr00.js';
import { rx } from './rx.js';
import { rxr } from './rxr.js';
import { ry } from './ry.js';
import { rz } from './rz.js';

/**
 * JS usage:  const { rb, rp, rbp } = bp00(date1, date2)
 *
 * Frame bias and precession, IAU 2000.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
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
 * 3) The matrix rp transforms vectors from J2000.0 mean equator and
 *    equinox to mean equator and equinox of date by applying
 *    precession.
 *
 * 4) The matrix rbp transforms vectors from GCRS to mean equator and
 *    equinox of date by applying frame bias then precession.  It is
 *    the product rp x rb.
 *
 * 5) It is permissible to re-use the same array in the returned
 *    arguments.  The arrays are filled in the order given.
 *
 * Called:
 *    bi00      frame bias components, IAU 2000
 *    pr00      IAU 2000 precession adjustments
 *    ir        initialize r-matrix to identity
 *    rx        rotate around X-axis
 *    ry        rotate around Y-axis
 *    rz        rotate around Z-axis
 *    cr        copy r-matrix
 *    rxr       product of two r-matrices
 *
 * Reference:
 *    "Expressions for the Celestial Intermediate Pole and Celestial
 *    Ephemeris Origin consistent with the IAU 2000A precession-
 *    nutation model", Astron.Astrophys. 400, 1145-1154 (2003)
 *
 *    n.b. The celestial ephemeris origin (CEO) was renamed "celestial
 *         intermediate origin" (CIO) by IAU 2006 Resolution 2.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function bp00(date1, date2) {
  let rb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let rbp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const EPS0 = 84381.448 * DAS2R;
  let t;
  let dpsibi;
  let depsbi;
  let dra0;
  let psia77;
  let oma77;
  let chia;
  let dpsipr;
  let depspr;
  let psia;
  let oma;
  let rbw = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  t = (date1 - DJ00 + date2) / DJC;
  const _r1 = bi00();
  dpsibi = _r1.dpsibi;
  depsbi = _r1.depsbi;
  dra0 = _r1.dra;
  psia77 = (5038.7784 + (-1.07259 + -0.001147 * t) * t) * t * DAS2R;
  oma77 = EPS0 + (0.05127 + -0.007726 * t) * t * t * DAS2R;
  chia = (10.5526 + (-2.38064 + -0.001125 * t) * t) * t * DAS2R;
  const _r2 = pr00(date1, date2);
  dpsipr = _r2.dpsipr;
  depspr = _r2.depspr;
  psia = psia77 + dpsipr;
  oma = oma77 + depspr;
  rbw = ir();
  rz(dra0, rbw);
  ry(dpsibi * Math.sin(EPS0), rbw);
  rx(-depsbi, rbw);
  rb = cr(rbw);
  rp = ir();
  rx(EPS0, rp);
  rz(-psia, rp);
  rx(-oma, rp);
  rz(chia, rp);
  rbp = rxr(rp, rbw);
  return { rb, rp, rbp };
}
