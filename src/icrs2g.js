// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file icrs2g.c.
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
import { rxp } from './rxp.js';
import { s2c } from './s2c.js';

/**
 * JS usage:  const { dl, db } = icrs2g(dr, dd)
 *
 * Transformation from ICRS to Galactic coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    dr     double      ICRS right ascension (radians)
 *    dd     double      ICRS declination (radians)
 *
 * Returned:
 *    dl     double      Galactic longitude (radians)
 *    db     double      Galactic latitude (radians)
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
 * 2) The inverse transformation is performed by the function g2icrs.
 *
 * Called:
 *    anp       normalize angle into range 0 to 2pi
 *    anpm      normalize angle into range +/- pi
 *    s2c       spherical coordinates to unit vector
 *    rxp       product of r-matrix and p-vector
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
export function icrs2g(dr, dd) {
  let dl = 0;
  let db = 0;
  let v1 = [0, 0, 0];
  let v2 = [0, 0, 0];
  let r = [
  [-0.054875560416215368492398900454, -0.873437090234885048760383168409, -0.483835015548713226831774175116],
  [+0.494109427875583673525222371358, -0.444829629960011178146614061616, +0.746982244497218890527388004556],
  [-0.867666149019004701181616534570, -0.198076373431201528180486091412, +0.455983776175066922272100478348],
];
  v1 = s2c(dr, dd);
  v2 = rxp(r, v1);
  const _r1 = c2s(v2);
  dl = _r1.theta;
  db = _r1.phi;
  dl = anp(dl);
  db = anpm(db);
  return { dl, db };
}
