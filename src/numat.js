// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file numat.c.
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

import { ir } from './ir.js';
import { rx } from './rx.js';
import { rz } from './rz.js';

/**
 * JS usage:  const rmatn = numat(epsa, dpsi, deps)
 *
 * Form the matrix of nutation.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    epsa        double         mean obliquity of date (Note 1)
 *    dpsi,deps   double         nutation (Note 2)
 *
 * Returned:
 *    rmatn       double[3][3]   nutation matrix (Note 3)
 *
 * Notes:
 *
 *
 * 1) The supplied mean obliquity epsa, must be consistent with the
 *    precession-nutation models from which dpsi and deps were obtained.
 *
 * 2) The caller is responsible for providing the nutation components;
 *    they are in longitude and obliquity, in radians and are with
 *    respect to the equinox and ecliptic of date.
 *
 * 3) The matrix operates in the sense V(true) = rmatn * V(mean),
 *    where the p-vector V(true) is with respect to the true
 *    equatorial triad of date and the p-vector V(mean) is with
 *    respect to the mean equatorial triad of date.
 *
 * Called:
 *    ir        initialize r-matrix to identity
 *    rx        rotate around X-axis
 *    rz        rotate around Z-axis
 *
 * Reference:
 *
 *    Explanatory Supplement to the Astronomical Almanac,
 *    P. Kenneth Seidelmann (ed), University Science Books (1992),
 *    Section 3.222-3 (p114).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function numat(epsa, dpsi, deps) {
  let rmatn = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  rmatn = ir();
  rx(epsa, rmatn);
  rz(-dpsi, rmatn);
  rx(-(epsa + deps), rmatn);
  return rmatn;
}
