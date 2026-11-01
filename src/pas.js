// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pas.c.
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
 * JS usage:  const result = pas(al, ap, bl, bp)
 *
 * Position-angle from spherical coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    al     double     longitude of point A (e.g. RA) in radians
 *    ap     double     latitude of point A (e.g. Dec) in radians
 *    bl     double     longitude of point B
 *    bp     double     latitude of point B
 *
 * Returned (function value):
 *           double     position angle of B with respect to A
 *
 * Notes:
 *
 * 1) The result is the bearing (position angle), in radians, of point
 *    B with respect to point A.  It is in the range -pi to +pi.  The
 *    sense is such that if B is a small distance "east" of point A,
 *    the bearing is approximately +pi/2.
 *
 * 2) Zero is returned if the two points are coincident.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pas(al, ap, bl, bp) {
  let dl;
  let x;
  let y;
  let pa;
  dl = bl - al;
  y = Math.sin(dl) * Math.cos(bp);
  x = Math.sin(bp) * Math.cos(ap) - Math.cos(bp) * Math.sin(ap) * Math.cos(dl);
  pa = x != 0.0 || y != 0.0 ? Math.atan2(y, x) : 0.0;
  return pa;
}
