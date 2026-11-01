// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file apio.c.
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

import { CMPS } from './constants.js';
import { newAstrom } from './types.js';
import { anpm } from './anpm.js';
import { ir } from './ir.js';
import { pvtob } from './pvtob.js';
import { rx } from './rx.js';
import { ry } from './ry.js';
import { rz } from './rz.js';

/**
 * JS usage:  const astrom = apio(sp, theta, elong, phi, hm, xp, yp, refa, refb)
 *
 * For a terrestrial observer, prepare star-independent astrometry
 * parameters for transformations between CIRS and observed
 * coordinates.  The caller supplies the Earth orientation information
 * and the refraction constants as well as the site coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    sp     double      the TIO locator s' (radians, Note 1)
 *    theta  double      Earth rotation angle (radians)
 *    elong  double      longitude (radians, east +ve, Note 2)
 *    phi    double      geodetic latitude (radians, Note 2)
 *    hm     double      height above ellipsoid (m, geodetic Note 2)
 *    xp,yp  double      polar motion coordinates (radians, Note 3)
 *    refa   double      refraction constant A (radians, Note 4)
 *    refb   double      refraction constant B (radians, Note 4)
 *
 * Returned:
 *    astrom aSTROM*  star-independent astrometry parameters:
 *     pmt    double       unchanged
 *     eb     double[3]    unchanged
 *     eh     double[3]    unchanged
 *     em     double       unchanged
 *     v      double[3]    unchanged
 *     bm1    double       unchanged
 *     bpn    double[3][3] unchanged
 *     along  double       adjusted longitude (radians)
 *     xpl    double       polar motion xp wrt local meridian (radians)
 *     ypl    double       polar motion yp wrt local meridian (radians)
 *     sphi   double       sine of geodetic latitude
 *     cphi   double       cosine of geodetic latitude
 *     diurab double       magnitude of diurnal aberration vector
 *     eral   double       "local" Earth rotation angle (radians)
 *     refa   double       refraction constant A (radians)
 *     refb   double       refraction constant B (radians)
 *
 * Notes:
 *
 * 1) sp, the TIO locator s', is a tiny quantity needed only by the
 *    most precise applications.  It can either be set to zero or
 *    predicted using the SOFA function sp00.
 *
 * 2) The geographical coordinates are with respect to the WGS84
 *    reference ellipsoid.  TAKE CARE WITH THE LONGITUDE SIGN:  the
 *    longitude required by the present function is east-positive
 *    (i.e. right-handed), in accordance with geographical convention.
 *
 * 3) The polar motion xp,yp can be obtained from IERS bulletins.  The
 *    values are the coordinates (in radians) of the Celestial
 *    Intermediate Pole with respect to the International Terrestrial
 *    Reference System (see IERS Conventions 2003), measured along the
 *    meridians 0 and 90 deg west respectively.  For many applications,
 *    xp and yp can be set to zero.
 *
 *    Internally, the polar motion is stored in a form rotated onto the
 *    local meridian.
 *
 * 4) The refraction constants refa and refb are for use in a
 *    dZ = A*tan(Z)+B*tan^3(Z) model, where Z is the observed
 *    (i.e. refracted) zenith distance and dZ is the amount of
 *    refraction.
 *
 * 5) It is advisable to take great care with units, as even unlikely
 *    values of the input parameters are accepted and processed in
 *    accordance with the models used.
 *
 * 6) In cases where the caller does not wish to provide the Earth
 *    rotation information and refraction constants, the function
 *    apio13 can be used instead of the present function.  This
 *    starts from UTC and weather readings etc. and computes suitable
 *    values using other SOFA functions.
 *
 * 7) This is one of several functions that inserts into the astrom
 *    structure star-independent parameters needed for the chain of
 *    astrometric transformations ICRS <-> GCRS <-> CIRS <-> observed.
 *
 *    The various functions support different classes of observer and
 *    portions of the transformation chain:
 *
 *         functions         observer        transformation
 *
 *      apcg apcg13    geocentric      ICRS <-> GCRS
 *      apci apci13    terrestrial     ICRS <-> CIRS
 *      apco apco13    terrestrial     ICRS <-> observed
 *      apcs apcs13    space           ICRS <-> GCRS
 *      aper aper13    terrestrial     update Earth rotation
 *      apio apio13    terrestrial     CIRS <-> observed
 *
 *    Those with names ending in "13" use contemporary SOFA models to
 *    compute the various ephemerides.  The others accept ephemerides
 *    supplied by the caller.
 *
 *    The transformation from ICRS to GCRS covers space motion,
 *    parallax, light deflection, and aberration.  From GCRS to CIRS
 *    comprises frame bias and precession-nutation.  From CIRS to
 *    observed takes account of Earth rotation, polar motion, diurnal
 *    aberration and parallax (unless subsumed into the ICRS <-> GCRS
 *    transformation), and atmospheric refraction.
 *
 * 8) The context structure astrom produced by this function is used by
 *    atioq and atoiq.
 *
 * Called:
 *    ir        initialize r-matrix to identity
 *    rz        rotate around Z-axis
 *    ry        rotate around Y-axis
 *    rx        rotate around X-axis
 *    anpm      normalize angle into range +/- pi
 *    pvtob     position/velocity of terrestrial station
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function apio(sp, theta, elong, phi, hm, xp, yp, refa, refb, astrom = newAstrom()) {
  let r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let a;
  let b;
  let eral;
  let c;
  let pv = [[0, 0, 0], [0, 0, 0]];
  r = ir();
  rz(theta + sp, r);
  ry(-xp, r);
  rx(-yp, r);
  rz(elong, r);
  a = r[0][0];
  b = r[0][1];
  eral = a != 0.0 || b != 0.0 ? Math.atan2(b, a) : 0.0;
  astrom.eral = eral;
  a = r[0][0];
  c = r[0][2];
  astrom.xpl = Math.atan2(c, Math.sqrt(a * a + b * b));
  a = r[1][2];
  b = r[2][2];
  astrom.ypl = a != 0.0 || b != 0.0 ? -Math.atan2(a, b) : 0.0;
  astrom.along = anpm(eral - theta);
  astrom.sphi = Math.sin(phi);
  astrom.cphi = Math.cos(phi);
  pv = pvtob(elong, phi, hm, xp, yp, sp, theta);
  astrom.diurab = Math.sqrt(pv[1][0] * pv[1][0] + pv[1][1] * pv[1][1]) / CMPS;
  astrom.refa = refa;
  astrom.refb = refb;
  return astrom;
}
