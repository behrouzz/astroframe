// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file bpn2xy.c.
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
 * JS usage:  const { x, y } = bpn2xy(rbpn)
 *
 * Extract from the bias-precession-nutation matrix the X,Y coordinates
 * of the Celestial Intermediate Pole.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    rbpn      double[3][3]  celestial-to-true matrix (Note 1)
 *
 * Returned:
 *    x,y       double        Celestial Intermediate Pole (Note 2)
 *
 * Notes:
 *
 * 1) The matrix rbpn transforms vectors from GCRS to true equator (and
 *    CIO or equinox) of date, and therefore the Celestial Intermediate
 *    Pole unit vector is the bottom row of the matrix.
 *
 * 2) The arguments x,y are components of the Celestial Intermediate
 *    Pole unit vector in the Geocentric Celestial Reference System.
 *
 * Reference:
 *
 *    "Expressions for the Celestial Intermediate Pole and Celestial
 *    Ephemeris Origin consistent with the IAU 2000A precession-
 *    nutation model", Astron.Astrophys. 400, 1145-1154
 *    (2003)
 *
 *    n.b. The celestial ephemeris origin (CEO) was renamed "celestial
 *         intermediate origin" (CIO) by IAU 2006 Resolution 2.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function bpn2xy(rbpn) {
  let x = 0;
  let y = 0;
  x = rbpn[2][0];
  y = rbpn[2][1];
  return { x, y };
}
