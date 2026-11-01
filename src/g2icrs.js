// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file g2icrs.c.
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
import { anpm } from './anpm.js';
import { c2s } from './c2s.js';
import { s2c } from './s2c.js';
import { trxp } from './trxp.js';

/**
 * JS usage:  const { dr, dd } = g2icrs(dl, db)
 *
 * Transformation from Galactic coordinates to ICRS.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    dl     double      Galactic longitude (radians)
 *    db     double      Galactic latitude (radians)
 *
 * Returned:
 *    dr     double      ICRS right ascension (radians)
 *    dd     double      ICRS declination (radians)
 *
 * Notes:
 *
 * 1) The IAU 1958 system of Galactic coordinates was defined with
 *    respect to the now obsolete reference system FK4 B1950.0.  When
 *    interpreting the system in a modern context, several factors have
 *    to be taken into account:
 *
 *    . The inclusion in FK4 positions of the E-terms of aberration.
 *
 *    . The distortion of the FK4 proper motion system by differential
 *      Galactic rotation.
 *
 *    . The use of the B1950.0 equinox rather than the now-standard
 *      J2000.0.
 *
 *    . The frame bias between ICRS and the J2000.0 mean place system.
 *
 *    The Hipparcos Catalogue (Perryman & ESA 1997) provides a rotation
 *    matrix that transforms directly between ICRS and Galactic
 *    coordinates with the above factors taken into account.  The
 *    matrix is derived from three angles, namely the ICRS coordinates
 *    of the Galactic pole and the longitude of the ascending node of
 *    the Galactic equator on the ICRS equator.  They are given in
 *    degrees to five decimal places and for canonical purposes are
 *    regarded as exact.  In the Hipparcos Catalogue the matrix
 *    elements are given to 10 decimal places (about 20 microarcsec).
 *    In the present SOFA function the matrix elements have been
 *    recomputed from the canonical three angles and are given to 30
 *    decimal places.
 *
 * 2) The inverse transformation is performed by the function icrs2g.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *    anpm      normalize angle into range +/- pi
 *    s2c       spherical coordinates to unit vector
 *    trxp      product of transpose of r-matrix and p-vector
 *    c2s       p-vector to spherical
 *
 * Reference:
 *    Perryman M.A.C. & ESA, 1997, ESA SP-1200, The Hipparcos and Tycho
 *    catalogues.  Astrometric and photometric star catalogues
 *    derived from the ESA Hipparcos Space Astrometry Mission.  ESA
 *    Publications Division, Noordwijk, Netherlands.
 *
 * This revision:   2023 April 16
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function g2icrs(dl, db) {
  let dr = 0;
  let dd = 0;
  let v1 = [0, 0, 0];
  let v2 = [0, 0, 0];
  let r = [
  [-0.054875560416215368492398900454, -0.873437090234885048760383168409, -0.483835015548713226831774175116],
  [+0.494109427875583673525222371358, -0.444829629960011178146614061616, +0.746982244497218890527388004556],
  [-0.867666149019004701181616534570, -0.198076373431201528180486091412, +0.455983776175066922272100478348],
];
  v1 = s2c(dl, db);
  v2 = trxp(r, v1);
  const _r1 = c2s(v2);
  dr = _r1.theta;
  dd = _r1.phi;
  dr = anp(dr);
  dd = anpm(dd);
  return { dr, dd };
}
