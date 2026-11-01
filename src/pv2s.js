// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pv2s.c.
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
 * JS usage:  const { theta, phi, r, td, pd, rd } = pv2s(pv)
 *
 * Convert position/velocity from Cartesian to spherical coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    pv       double[2][3]  pv-vector
 *
 * Returned:
 *    theta    double        longitude angle (radians)
 *    phi      double        latitude angle (radians)
 *    r        double        radial distance
 *    td       double        rate of change of theta
 *    pd       double        rate of change of phi
 *    rd       double        rate of change of r
 *
 * Notes:
 *
 * 1) If the position part of pv is null, theta, phi, td and pd
 *    are indeterminate.  This is handled by extrapolating the
 *    position through unit time by using the velocity part of
 *    pv.  This moves the origin without changing the direction
 *    of the velocity component.  If the position and velocity
 *    components of pv are both null, zeroes are returned for all
 *    six results.
 *
 * 2) If the position is a pole, theta, td and pd are indeterminate.
 *    In such cases zeroes are returned for all three.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pv2s(pv) {
  let theta = 0;
  let phi = 0;
  let r = 0;
  let td = 0;
  let pd = 0;
  let rd = 0;
  let x;
  let y;
  let z;
  let xd;
  let yd;
  let zd;
  let rxy2;
  let rxy;
  let r2;
  let rtrue;
  let rw;
  let xyp;
  x = pv[0][0];
  y = pv[0][1];
  z = pv[0][2];
  xd = pv[1][0];
  yd = pv[1][1];
  zd = pv[1][2];
  rxy2 = x * x + y * y;
  r2 = rxy2 + z * z;
  rtrue = Math.sqrt(r2);
  rw = rtrue;
  if (rtrue == 0.0) {
    x = xd;
    y = yd;
    z = zd;
    rxy2 = x * x + y * y;
    r2 = rxy2 + z * z;
    rw = Math.sqrt(r2);
  }
  rxy = Math.sqrt(rxy2);
  xyp = x * xd + y * yd;
  if (rxy2 != 0.0) {
    theta = Math.atan2(y, x);
    phi = Math.atan2(z, rxy);
    td = (x * yd - y * xd) / rxy2;
    pd = (zd * rxy2 - z * xyp) / (r2 * rxy);
  } else {
    theta = 0.0;
    phi = z != 0.0 ? Math.atan2(z, rxy) : 0.0;
    td = 0.0;
    pd = 0.0;
  }
  r = rtrue;
  rd = rw != 0.0 ? (xyp + z * zd) / rw : 0.0;
  return { theta, phi, r, td, pd, rd };
}
