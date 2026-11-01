// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file hd2ae.c.
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

import { D2PI } from './constants.js';

/**
 * JS usage:  const { az, el } = hd2ae(ha, dec, phi)
 *
 * Equatorial to horizon coordinates:  transform hour angle and
 * declination to azimuth and altitude.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ha       double       hour angle (local)
 *    dec      double       declination
 *    phi      double       site latitude
 *
 * Returned:
 *    *az      double       azimuth
 *    *el      double       altitude (informally, elevation)
 *
 * Notes:
 *
 * 1)  All the arguments are angles in radians.
 *
 * 2)  Azimuth is returned in the range 0-2pi;  north is zero, and east
 *     is +pi/2.  Altitude is returned in the range +/- pi/2.
 *
 * 3)  The latitude phi is pi/2 minus the angle between the Earth's
 *     rotation axis and the adopted zenith.  In many applications it
 *     will be sufficient to use the published geodetic latitude of the
 *     site.  In very precise (sub-arcsecond) applications, phi can be
 *     corrected for polar motion.
 *
 * 4)  The returned azimuth az is with respect to the rotational north
 *     pole, as opposed to the ITRS pole, and for sub-arcsecond
 *     accuracy will need to be adjusted for polar motion if it is to
 *     be with respect to north on a map of the Earth's surface.
 *
 * 5)  Should the user wish to work with respect to the astronomical
 *     zenith rather than the geodetic zenith, phi will need to be
 *     adjusted for deflection of the vertical (often tens of
 *     arcseconds), and the zero point of the hour angle ha will also
 *     be affected.
 *
 * 6)  The transformation is the same as Vh = Rz(pi)*Ry(pi/2-phi)*Ve,
 *     where Vh and Ve are lefthanded unit vectors in the (az,el) and
 *     (ha,dec) systems respectively and Ry and Rz are rotations about
 *     first the y-axis and then the z-axis.  (n.b. Rz(pi) simply
 *     reverses the signs of the x and y components.)  For efficiency,
 *     the algorithm is written out rather than calling other utility
 *     functions.  For applications that require even greater
 *     efficiency, additional savings are possible if constant terms
 *     such as functions of latitude are computed once and for all.
 *
 * 7)  Again for efficiency, no range checking of arguments is carried
 *     out.
 *
 * Last revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function hd2ae(ha, dec, phi) {
  let az = 0;
  let el = 0;
  let sh;
  let ch;
  let sd;
  let cd;
  let sp;
  let cp;
  let x;
  let y;
  let z;
  let r;
  let a;
  sh = Math.sin(ha);
  ch = Math.cos(ha);
  sd = Math.sin(dec);
  cd = Math.cos(dec);
  sp = Math.sin(phi);
  cp = Math.cos(phi);
  x = -ch * cd * sp + sd * cp;
  y = -sh * cd;
  z = ch * cd * cp + sd * sp;
  r = Math.sqrt(x * x + y * y);
  a = r != 0.0 ? Math.atan2(y, x) : 0.0;
  az = a < 0.0 ? a + D2PI : a;
  el = Math.atan2(z, r);
  return { az, el };
}
