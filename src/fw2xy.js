// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fw2xy.c.
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

import { bpn2xy } from './bpn2xy.js';
import { fw2m } from './fw2m.js';

/**
 * JS usage:  const { x, y } = fw2xy(gamb, phib, psi, eps)
 *
 * CIP X,Y given Fukushima-Williams bias-precession-nutation angles.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    gamb     double    F-W angle gamma_bar (radians)
 *    phib     double    F-W angle phi_bar (radians)
 *    psi      double    F-W angle psi (radians)
 *    eps      double    F-W angle epsilon (radians)
 *
 * Returned:
 *    x,y      double    CIP unit vector X,Y
 *
 * Notes:
 *
 * 1) Naming the following points:
 *
 *          e = J2000.0 ecliptic pole,
 *          p = GCRS pole
 *          E = ecliptic pole of date,
 *    and   P = CIP,
 *
 *    the four Fukushima-Williams angles are as follows:
 *
 *       gamb = gamma = epE
 *       phib = phi = pE
 *       psi = psi = pEP
 *       eps = epsilon = EP
 *
 * 2) The matrix representing the combined effects of frame bias,
 *    precession and nutation is:
 *
 *       NxPxB = R_1(-epsA).R_3(-psi).R_1(phib).R_3(gamb)
 *
 *    The returned values x,y are elements [2][0] and [2][1] of the
 *    matrix.  Near J2000.0, they are essentially angles in radians.
 *
 * Called:
 *    fw2m      F-W angles to r-matrix
 *    bpn2xy    extract CIP X,Y coordinates from NPB matrix
 *
 * Reference:
 *
 *    Hilton, J. et al., 2006, Celest.Mech.Dyn.Astron. 94, 351
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fw2xy(gamb, phib, psi, eps) {
  let x = 0;
  let y = 0;
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  r = fw2m(gamb, phib, psi, eps);
  const _r1 = bpn2xy(r);
  x = _r1.x;
  y = _r1.y;
  return { x, y };
}
