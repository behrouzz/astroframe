// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file s2pv.c.
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


/**
 * JS usage:  const pv = s2pv(theta, phi, r, td, pd, rd)
 *
 * Convert position/velocity from spherical to Cartesian coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    theta    double          longitude angle (radians)
 *    phi      double          latitude angle (radians)
 *    r        double          radial distance
 *    td       double          rate of change of theta
 *    pd       double          rate of change of phi
 *    rd       double          rate of change of r
 *
 * Returned:
 *    pv       double[2][3]    pv-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function s2pv(theta, phi, r, td, pd, rd) {
  let pv = [[0, 0, 0], [0, 0, 0]];
  let st;
  let ct;
  let sp;
  let cp;
  let rcp;
  let x;
  let y;
  let rpd;
  let w;
  st = Math.sin(theta);
  ct = Math.cos(theta);
  sp = Math.sin(phi);
  cp = Math.cos(phi);
  rcp = r * cp;
  x = rcp * ct;
  y = rcp * st;
  rpd = r * pd;
  w = rpd * sp - cp * rd;
  pv[0][0] = x;
  pv[0][1] = y;
  pv[0][2] = r * sp;
  pv[1][0] = -y * td - w * ct;
  pv[1][1] = x * td - w * st;
  pv[1][2] = rpd * cp + sp * rd;
  return pv;
}
