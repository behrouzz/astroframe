// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fw2m.c.
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
import { rx } from './rx.js';
import { rz } from './rz.js';

/**
 * JS usage:  const r = fw2m(gamb, phib, psi, eps)
 *
 * Form rotation matrix given the Fukushima-Williams angles.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    gamb     double         F-W angle gamma_bar (radians)
 *    phib     double         F-W angle phi_bar (radians)
 *    psi      double         F-W angle psi (radians)
 *    eps      double         F-W angle epsilon (radians)
 *
 * Returned:
 *    r        double[3][3]   rotation matrix
 *
 * Notes:
 *
 * 1) Naming the following points:
 *
 *          e = J2000.0 ecliptic pole,
 *          p = GCRS pole,
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
 *       NxPxB = R_1(-eps).R_3(-psi).R_1(phib).R_3(gamb)
 *
 * 3) The present function can construct three different matrices,
 *    depending on which angles are supplied as the arguments gamb,
 *    phib, psi and eps:
 *
 *    o  To obtain the nutation x precession x frame bias matrix,
 *       first generate the four precession angles known conventionally
 *       as gamma_bar, phi_bar, psi_bar and epsilon_A, then generate
 *       the nutation components Dpsi and Depsilon and add them to
 *       psi_bar and epsilon_A, and finally call the present function
 *       using those four angles as arguments.
 *
 *    o  To obtain the precession x frame bias matrix, generate the
 *       four precession angles and call the present function.
 *
 *    o  To obtain the frame bias matrix, generate the four precession
 *       angles for date J2000.0 and call the present function.
 *
 *    The nutation-only and precession-only matrices can if necessary
 *    be obtained by combining these three appropriately.
 *
 * Called:
 *    ir        initialize r-matrix to identity
 *    rz        rotate around Z-axis
 *    rx        rotate around X-axis
 *
 * References:
 *
 *    Capitaine, N. & Wallace, P.T., 2006, Astron.Astrophys. 450, 855
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
export function fw2m(gamb, phib, psi, eps) {
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  r = ir();
  rz(gamb, r);
  rx(phib, r);
  rz(-psi, r);
  rx(-eps, r);
  return r;
}
