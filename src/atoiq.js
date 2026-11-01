// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file atoiq.c.
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
 * JS usage:  const { ri, di } = atoiq(type, ob1, ob2, astrom)
 *
 * Quick observed place to CIRS, given the star-independent astrometry
 * parameters.
 *
 * Use of this function is appropriate when efficiency is important and
 * where many star positions are all to be transformed for one date.
 * The star-independent astrometry parameters can be obtained by
 * calling apio[13] or apco[13].
 *
 * Status:  support function.
 *
 * Given:
 *    type   char[]     type of coordinates: "R", "H" or "A" (Note 1)
 *    ob1    double     observed Az, HA or RA (radians; Az is N=0,E=90)
 *    ob2    double     observed ZD or Dec (radians)
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
 *    ri     double*    CIRS right ascension (CIO-based, radians)
 *    di     double*    CIRS declination (radians)
 *
 * Notes:
 *
 * 1) "Observed" Az,ZD means the position that would be seen by a
 *    perfect geodetically aligned theodolite.  This is related to
 *    the observed HA,Dec via the standard rotation, using the geodetic
 *    latitude (corrected for polar motion), while the observed HA and
 *    (CIO-based) RA are related simply through the Earth rotation
 *    angle and the site longitude.  "Observed" RA,Dec or HA,Dec thus
 *    means the position that would be seen by a perfect equatorial
 *    with its polar axis aligned to the Earth's axis of rotation.
 *
 * 2) Only the first character of the type argument is significant.
 *    "R" or "r" indicates that ob1 and ob2 are the observed right
 *    ascension (CIO-based) and declination;  "H" or "h" indicates that
 *    they are hour angle (west +ve) and declination;  anything else
 *    ("A" or "a" is recommended) indicates that ob1 and ob2 are
 *    azimuth (north zero, east 90 deg) and zenith distance.  (Zenith
 *    distance is used rather than altitude in order to reflect the
 *    fact that no allowance is made for depression of the horizon.)
 *
 * 3) The accuracy of the result is limited by the corrections for
 *    refraction, which use a simple A*tan(z) + B*tan^3(z) model.
 *    Providing the meteorological parameters are known accurately and
 *    there are no gross local effects, the predicted intermediate
 *    coordinates should be within 0.05 arcsec (optical) or 1 arcsec
 *    (radio) for a zenith distance of less than 70 degrees, better
 *    than 30 arcsec (optical or radio) at 85 degrees and better than
 *    20 arcmin (optical) or 25 arcmin (radio) at the horizon.
 *
 *    Without refraction, the complementary functions atioq and
 *    atoiq are self-consistent to better than 1 microarcsecond all
 *    over the celestial sphere.  With refraction included, consistency
 *    falls off at high zenith distances, but is still better than
 *    0.05 arcsec at 85 degrees.
 *
 * 4) It is advisable to take great care with units, as even unlikely
 *    values of the input parameters are accepted and processed in
 *    accordance with the models used.
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
export function atoiq(type, ob1, ob2, astrom) {
  let ri = 0;
  let di = 0;
  const SELMIN = 0.05;
  let c;
  let c1;
  let c2;
  let sphi;
  let cphi;
  let ce;
  let xaeo;
  let yaeo;
  let zaeo;
  let v = [0, 0, 0];
  let xmhdo;
  let ymhdo;
  let zmhdo;
  let az;
  let sz;
  let zdo;
  let refa;
  let refb;
  let tz;
  let dref;
  let zdt;
  let xaet;
  let yaet;
  let zaet;
  let xmhda;
  let ymhda;
  let zmhda;
  let f;
  let xhd;
  let yhd;
  let zhd;
  let sx;
  let cx;
  let sy;
  let cy;
  let hma;
  c = type[0];
  c1 = ob1;
  c2 = ob2;
  sphi = astrom.sphi;
  cphi = astrom.cphi;
  if (c == 'r' || c == 'R') {
    c = 'R';
  } else if (c == 'h' || c == 'H') {
    c = 'H';
  } else {
    c = 'A';
  }
  if (c == 'A') {
    ce = Math.sin(c2);
    xaeo = -Math.cos(c1) * ce;
    yaeo = Math.sin(c1) * ce;
    zaeo = Math.cos(c2);
  } else {
    if (c == 'R') {
      c1 = astrom.eral - c1;
    }
    v = s2c(-c1, c2);
    xmhdo = v[0];
    ymhdo = v[1];
    zmhdo = v[2];
    xaeo = sphi * xmhdo - cphi * zmhdo;
    yaeo = ymhdo;
    zaeo = cphi * xmhdo + sphi * zmhdo;
  }
  az = xaeo != 0.0 || yaeo != 0.0 ? Math.atan2(yaeo, xaeo) : 0.0;
  sz = Math.sqrt(xaeo * xaeo + yaeo * yaeo);
  zdo = Math.atan2(sz, zaeo);
  refa = astrom.refa;
  refb = astrom.refb;
  tz = sz / (zaeo > SELMIN ? zaeo : SELMIN);
  dref = (refa + refb * tz * tz) * tz;
  zdt = zdo + dref;
  ce = Math.sin(zdt);
  xaet = Math.cos(az) * ce;
  yaet = Math.sin(az) * ce;
  zaet = Math.cos(zdt);
  xmhda = sphi * xaet + cphi * zaet;
  ymhda = yaet;
  zmhda = -cphi * xaet + sphi * zaet;
  f = 1.0 + astrom.diurab * ymhda;
  xhd = f * xmhda;
  yhd = f * (ymhda - astrom.diurab);
  zhd = f * zmhda;
  sx = Math.sin(astrom.xpl);
  cx = Math.cos(astrom.xpl);
  sy = Math.sin(astrom.ypl);
  cy = Math.cos(astrom.ypl);
  v[0] = cx * xhd + sx * sy * yhd - sx * cy * zhd;
  v[1] = cy * yhd + sy * zhd;
  v[2] = sx * xhd - cx * sy * yhd + cx * cy * zhd;
  const _r1 = c2s(v);
  hma = _r1.theta;
  di = _r1.phi;
  ri = anp(astrom.eral + hma);
  return { ri, di };
}
