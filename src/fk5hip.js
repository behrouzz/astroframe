// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk5hip.c.
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

import { DAS2R } from './constants.js';
import { rv2m } from './rv2m.js';

/**
 * JS usage:  const { r5h, s5h } = fk5hip()
 *
 * FK5 to Hipparcos rotation and spin.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Returned:
 *    r5h   double[3][3]  r-matrix: FK5 rotation wrt Hipparcos (Note 2)
 *    s5h   double[3]     r-vector: FK5 spin wrt Hipparcos (Note 3)
 *
 * Notes:
 *
 * 1) This function models the FK5 to Hipparcos transformation as a
 *    pure rotation and spin;  zonal errors in the FK5 catalog are not
 *    taken into account.
 *
 * 2) The r-matrix r5h operates in the sense:
 *
 *          P_Hipparcos = r5h x P_FK5
 *
 *    where P_FK5 is a p-vector in the FK5 frame, and P_Hipparcos is
 *    the equivalent Hipparcos p-vector.
 *
 * 3) The r-vector s5h represents the time derivative of the FK5 to
 *    Hipparcos rotation.  The units are radians per year (Julian,
 *    TDB).
 *
 * Called:
 *    rv2m      r-vector to r-matrix
 *
 * Reference:
 *
 *    F.Mignard & M.Froeschle, Astron.Astrophys., 354, 732-739 (2000).
 *
 * This revision:  2023 March 6
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk5hip() {
  let r5h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let s5h = [0, 0, 0];
  let v = [0, 0, 0];
  let epx;
  let epy;
  let epz;
  let omx;
  let omy;
  let omz;
  epx = -19.9e-3 * DAS2R;
  epy = -9.1e-3 * DAS2R;
  epz = 22.9e-3 * DAS2R;
  omx = -0.30e-3 * DAS2R;
  omy = 0.60e-3 * DAS2R;
  omz = 0.70e-3 * DAS2R;
  v[0] = epx;
  v[1] = epy;
  v[2] = epz;
  r5h = rv2m(v);
  s5h[0] = omx;
  s5h[1] = omy;
  s5h[2] = omz;
  return { r5h, s5h };
}
