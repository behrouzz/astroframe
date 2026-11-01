// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file aper.c.
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
 * JS usage:  aper(theta, astrom)
 *
 * In the star-independent astrometry parameters, update only the
 * Earth rotation angle, supplied by the caller explicitly.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    theta   double      Earth rotation angle (radians, Note 2)
 *    astrom  aSTROM*  star-independent astrometry parameters:
 *     pmt    double       not used
 *     eb     double[3]    not used
 *     eh     double[3]    not used
 *     em     double       not used
 *     v      double[3]    not used
 *     bm1    double       not used
 *     bpn    double[3][3] not used
 *     along  double       longitude + s' (radians)
 *     xpl    double       not used
 *     ypl    double       not used
 *     sphi   double       not used
 *     cphi   double       not used
 *     diurab double       not used
 *     eral   double       not used
 *     refa   double       not used
 *     refb   double       not used
 *
 * Returned:
 *    astrom  aSTROM*  star-independent astrometry parameters:
 *     pmt    double       unchanged
 *     eb     double[3]    unchanged
 *     eh     double[3]    unchanged
 *     em     double       unchanged
 *     v      double[3]    unchanged
 *     bm1    double       unchanged
 *     bpn    double[3][3] unchanged
 *     along  double       unchanged
 *     xpl    double       unchanged
 *     ypl    double       unchanged
 *     sphi   double       unchanged
 *     cphi   double       unchanged
 *     diurab double       unchanged
 *     eral   double       "local" Earth rotation angle (radians)
 *     refa   double       unchanged
 *     refb   double       unchanged
 *
 * Notes:
 *
 * 1) This function exists to enable sidereal-tracking applications to
 *    avoid wasteful recomputation of the bulk of the astrometry
 *    parameters:  only the Earth rotation is updated.
 *
 * 2) For targets expressed as equinox based positions, such as
 *    classical geocentric apparent (RA,Dec), the supplied theta can be
 *    Greenwich apparent sidereal time rather than Earth rotation
 *    angle.
 *
 * 3) The function aper13 can be used instead of the present
 *    function, and starts from UT1 rather than ERA itself.
 *
 * 4) This is one of several functions that inserts into the astrom
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
 * This revision:   2013 September 25
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function aper(theta, astrom) {
  astrom.eral = theta + astrom.along;
}
