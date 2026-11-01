// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file hd2pa.c.
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
 * JS usage:  const result = hd2pa(ha, dec, phi)
 *
 * Parallactic angle for a given hour angle and declination.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ha     double     hour angle
 *    dec    double     declination
 *    phi    double     site latitude
 *
 * Returned (function value):
 *           double     parallactic angle
 *
 * Notes:
 *
 * 1)  All the arguments are angles in radians.
 *
 * 2)  The parallactic angle at a point in the sky is the position
 *     angle of the vertical, i.e. the angle between the directions to
 *     the north celestial pole and to the zenith respectively.
 *
 * 3)  The result is returned in the range -pi to +pi.
 *
 * 4)  At the pole itself a zero result is returned.
 *
 * 5)  The latitude phi is pi/2 minus the angle between the Earth's
 *     rotation axis and the adopted zenith.  In many applications it
 *     will be sufficient to use the published geodetic latitude of the
 *     site.  In very precise (sub-arcsecond) applications, phi can be
 *     corrected for polar motion.
 *
 * 6)  Should the user wish to work with respect to the astronomical
 *     zenith rather than the geodetic zenith, phi will need to be
 *     adjusted for deflection of the vertical (often tens of
 *     arcseconds), and the zero point of the hour angle ha will also
 *     be affected.
 *
 * Reference:
 *    Smart, W.M., "Spherical Astronomy", Cambridge University Press,
 *    6th edition (Green, 1977), p49.
 *
 * Last revision:   2017 September 12
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function hd2pa(ha, dec, phi) {
  let cp;
  let cqsz;
  let sqsz;
  cp = Math.cos(phi);
  sqsz = cp * Math.sin(ha);
  cqsz = Math.sin(phi) * Math.cos(dec) - cp * Math.sin(dec) * Math.cos(ha);
  return sqsz != 0.0 || cqsz != 0.0 ? Math.atan2(sqsz, cqsz) : 0.0;
}
