// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file apcs.c.
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

import { AULT, DAU, DAYSEC, DJ00, DJY } from './constants.js';
import { newAstrom } from './types.js';
import { cp } from './cp.js';
import { ir } from './ir.js';
import { pn } from './pn.js';

/**
 * JS usage:  const astrom = apcs(date1, date2, pv, ebpv, ehp)
 *
 * For an observer whose geocentric position and velocity are known,
 * prepare star-independent astrometry parameters for transformations
 * between ICRS and GCRS.  The Earth ephemeris is supplied by the
 * caller.
 *
 * The parameters produced by this function are required in the space
 * motion, parallax, light deflection and aberration parts of the
 * astrometric transformation chain.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    date1  double       TDB as a 2-part...
 *    date2  double       ...Julian Date (Note 1)
 *    pv     double[2][3] observer's geocentric pos/vel (m, m/s)
 *    ebpv   double[2][3] Earth barycentric PV (au, au/day)
 *    ehp    double[3]    Earth heliocentric P (au)
 *
 * Returned:
 *    astrom aSTROM*   star-independent astrometry parameters:
 *     pmt    double       PM time interval (SSB, Julian years)
 *     eb     double[3]    SSB to observer (vector, au)
 *     eh     double[3]    Sun to observer (unit vector)
 *     em     double       distance from Sun to observer (au)
 *     v      double[3]    barycentric observer velocity (vector, c)
 *     bm1    double       sqrt(1-|v|^2): reciprocal of Lorenz factor
 *     bpn    double[3][3] bias-precession-nutation matrix
 *     along  double       unchanged
 *     xpl    double       unchanged
 *     ypl    double       unchanged
 *     sphi   double       unchanged
 *     cphi   double       unchanged
 *     diurab double       unchanged
 *     eral   double       unchanged
 *     refa   double       unchanged
 *     refb   double       unchanged
 *
 * Notes:
 *
 * 1) The TDB date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TDB)=2450123.7 could be expressed in any of these ways, among
 *    others:
 *
 *           date1          date2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in cases
 *    where the loss of several decimal digits of resolution is
 *    acceptable.  The J2000 method is best matched to the way the
 *    argument is handled internally and will deliver the optimum
 *    resolution.  The MJD method and the date & time methods are both
 *    good compromises between resolution and convenience.  For most
 *    applications of this function the choice will not be at all
 *    critical.
 *
 *    TT can be used instead of TDB without any significant impact on
 *    accuracy.
 *
 * 2) All the vectors are with respect to BCRS axes.
 *
 * 3) Providing separate arguments for (i) the observer's geocentric
 *    position and velocity and (ii) the Earth ephemeris is done for
 *    convenience in the geocentric, terrestrial and Earth orbit cases.
 *    For deep space applications it maybe more convenient to specify
 *    zero geocentric position and velocity and to supply the
 *    observer's position and velocity information directly instead of
 *    with respect to the Earth.  However, note the different units:
 *    m and m/s for the geocentric vectors, au and au/day for the
 *    heliocentric and barycentric vectors.
 *
 * 4) In cases where the caller does not wish to provide the Earth
 *    ephemeris, the function apcs13 can be used instead of the
 *    present function.  This computes the Earth ephemeris using the
 *    SOFA function epv00.
 *
 * 5) This is one of several functions that inserts into the astrom
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
 * 6) The context structure astrom produced by this function is used by
 *    atciq* and aticq*.
 *
 * Called:
 *    cp        copy p-vector
 *    pm        modulus of p-vector
 *    pn        decompose p-vector into modulus and direction
 *    ir        initialize r-matrix to identity
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function apcs(date1, date2, pv, ebpv, ehp, astrom = newAstrom()) {
  const AUDMS = DAU / DAYSEC;
  const CR = AULT / DAYSEC;
  let i;
  let dp;
  let dv;
  let pb = [0, 0, 0];
  let vb = [0, 0, 0];
  let ph = [0, 0, 0];
  let v2;
  let w;
  astrom.pmt = (date1 - DJ00 + date2) / DJY;
  for (i = 0; i < 3; i++) {
    dp = pv[0][i] / DAU;
    dv = pv[1][i] / AUDMS;
    pb[i] = ebpv[0][i] + dp;
    vb[i] = ebpv[1][i] + dv;
    ph[i] = ehp[i] + dp;
  }
  astrom.eb = cp(pb);
  const _r1 = pn(ph);
  astrom.em = _r1.r;
  astrom.eh = _r1.u;
  v2 = 0.0;
  for (i = 0; i < 3; i++) {
    w = vb[i] * CR;
    astrom.v[i] = w;
    v2 += w * w;
  }
  astrom.bm1 = Math.sqrt(1.0 - v2);
  astrom.bpn = ir();
  return astrom;
}
