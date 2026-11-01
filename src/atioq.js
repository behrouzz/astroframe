// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file atioq.c.
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

import { anp } from './anp.js';
import { c2s } from './c2s.js';
import { s2c } from './s2c.js';

/**
 * JS usage:  const { aob, zob, hob, dob, rob } = atioq(ri, di, astrom)
 *
 * Quick CIRS to observed place transformation.
 *
 * Use of this function is appropriate when efficiency is important and
 * where many star positions are all to be transformed for one date.
 * The star-independent astrometry parameters can be obtained by
 * calling apio[13] or apco[13].
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    ri     double     CIRS right ascension
 *    di     double     CIRS declination
 *    astrom aSTROM* star-independent astrometry parameters:
 *     pmt    double       PM time interval (SSB, Julian years)
 *     eb     double[3]    SSB to observer (vector, au)
 *     eh     double[3]    Sun to observer (unit vector)
 *     em     double       distance from Sun to observer (au)
 *     v      double[3]    barycentric observer velocity (vector, c)
 *     bm1    double       sqrt(1-|v|^2): reciprocal of Lorenz factor
 *     bpn    double[3][3] bias-precession-nutation matrix
 *     along  double       longitude + s' (radians)
 *     xpl    double       polar motion xp wrt local meridian (radians)
 *     ypl    double       polar motion yp wrt local meridian (radians)
 *     sphi   double       sine of geodetic latitude
 *     cphi   double       cosine of geodetic latitude
 *     diurab double       magnitude of diurnal aberration vector
 *     eral   double       "local" Earth rotation angle (radians)
 *     refa   double       refraction constant A (radians)
 *     refb   double       refraction constant B (radians)
 *
 * Returned:
 *    aob    double*    observed azimuth (radians: N=0,E=90)
 *    zob    double*    observed zenith distance (radians)
 *    hob    double*    observed hour angle (radians)
 *    dob    double*    observed declination (radians)
 *    rob    double*    observed right ascension (CIO-based, radians)
 *
 * Notes:
 *
 * 1) This function returns zenith distance rather than altitude in
 *    order to reflect the fact that no allowance is made for
 *    depression of the horizon.
 *
 * 2) The accuracy of the result is limited by the corrections for
 *    refraction, which use a simple A*tan(z) + B*tan^3(z) model.
 *    Providing the meteorological parameters are known accurately and
 *    there are no gross local effects, the predicted observed
 *    coordinates should be within 0.05 arcsec (optical) or 1 arcsec
 *    (radio) for a zenith distance of less than 70 degrees, better
 *    than 30 arcsec (optical or radio) at 85 degrees and better
 *    than 20 arcmin (optical) or 30 arcmin (radio) at the horizon.
 *
 *    Without refraction, the complementary functions atioq and
 *    atoiq are self-consistent to better than 1 microarcsecond all
 *    over the celestial sphere.  With refraction included, consistency
 *    falls off at high zenith distances, but is still better than
 *    0.05 arcsec at 85 degrees.
 *
 * 3) It is advisable to take great care with units, as even unlikely
 *    values of the input parameters are accepted and processed in
 *    accordance with the models used.
 *
 * 4) The CIRS RA,Dec is obtained from a star catalog mean place by
 *    allowing for space motion, parallax, the Sun's gravitational lens
 *    effect, annual aberration and precession-nutation.  For star
 *    positions in the ICRS, these effects can be applied by means of
 *    the atci13 (etc.) functions.  Starting from classical "mean
 *    place" systems, additional transformations will be needed first.
 *
 * 5) "Observed" Az,El means the position that would be seen by a
 *    perfect geodetically aligned theodolite.  This is obtained from
 *    the CIRS RA,Dec by allowing for Earth orientation and diurnal
 *    aberration, rotating from equator to horizon coordinates, and
 *    then adjusting for refraction.  The HA,Dec is obtained by
 *    rotating back into equatorial coordinates, and is the position
 *    that would be seen by a perfect equatorial with its polar axis
 *    aligned to the Earth's axis of rotation.  Finally, the
 *    (CIO-based) RA is obtained by subtracting the HA from the local
 *    ERA.
 *
 * 6) The star-independent CIRS-to-observed-place parameters in ASTROM
 *    may be computed with apio[13] or apco[13].  If nothing has
 *    changed significantly except the time, aper[13] may be used to
 *    perform the requisite adjustment to the astrom structure.
 *
 * Called:
 *    s2c       spherical coordinates to unit vector
 *    c2s       p-vector to spherical
 *    anp       normalize angle into range 0 to 2pi
 *
 * This revision:   2022 August 30
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function atioq(ri, di, astrom) {
  let aob = 0;
  let zob = 0;
  let hob = 0;
  let dob = 0;
  let rob = 0;
  const CELMIN = 1e-6;
  const SELMIN = 0.05;
  let v = [0, 0, 0];
  let x;
  let y;
  let z;
  let sx;
  let cx;
  let sy;
  let cy;
  let xhd;
  let yhd;
  let zhd;
  let f;
  let xhdt;
  let yhdt;
  let zhdt;
  let xaet;
  let yaet;
  let zaet;
  let azobs;
  let r;
  let tz;
  let w;
  let del;
  let cosdel;
  let xaeo;
  let yaeo;
  let zaeo;
  let zdobs;
  let hmobs;
  let dcobs;
  let raobs;
  v = s2c(ri - astrom.eral, di);
  x = v[0];
  y = v[1];
  z = v[2];
  sx = Math.sin(astrom.xpl);
  cx = Math.cos(astrom.xpl);
  sy = Math.sin(astrom.ypl);
  cy = Math.cos(astrom.ypl);
  xhd = cx * x + sx * z;
  yhd = sx * sy * x + cy * y - cx * sy * z;
  zhd = -sx * cy * x + sy * y + cx * cy * z;
  f = 1.0 - astrom.diurab * yhd;
  xhdt = f * xhd;
  yhdt = f * (yhd + astrom.diurab);
  zhdt = f * zhd;
  xaet = astrom.sphi * xhdt - astrom.cphi * zhdt;
  yaet = yhdt;
  zaet = astrom.cphi * xhdt + astrom.sphi * zhdt;
  azobs = xaet != 0.0 || yaet != 0.0 ? Math.atan2(yaet, -xaet) : 0.0;
  r = Math.sqrt(xaet * xaet + yaet * yaet);
  r = r > CELMIN ? r : CELMIN;
  z = zaet > SELMIN ? zaet : SELMIN;
  tz = r / z;
  w = astrom.refb * tz * tz;
  del = (astrom.refa + w) * tz / (1.0 + (astrom.refa + 3.0 * w) / (z * z));
  cosdel = 1.0 - del * del / 2.0;
  f = cosdel - del * z / r;
  xaeo = xaet * f;
  yaeo = yaet * f;
  zaeo = cosdel * zaet + del * r;
  zdobs = Math.atan2(Math.sqrt(xaeo * xaeo + yaeo * yaeo), zaeo);
  v[0] = astrom.sphi * xaeo + astrom.cphi * zaeo;
  v[1] = yaeo;
  v[2] = -astrom.cphi * xaeo + astrom.sphi * zaeo;
  const _r1 = c2s(v);
  hmobs = _r1.theta;
  dcobs = _r1.phi;
  raobs = astrom.eral + hmobs;
  aob = anp(azobs);
  zob = zdobs;
  hob = -hmobs;
  dob = dcobs;
  rob = anp(raobs);
  return { aob, zob, hob, dob, rob };
}
