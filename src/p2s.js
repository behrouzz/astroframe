// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file p2s.c.
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

import { c2s } from './c2s.js';
import { pm } from './pm.js';

/**
 * JS usage:  const { theta, phi, r } = p2s(p)
 *
 * P-vector to spherical polar coordinates.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    p        double[3]    p-vector
 *
 * Returned:
 *    theta    double       longitude angle (radians)
 *    phi      double       latitude angle (radians)
 *    r        double       radial distance
 *
 * Notes:
 *
 * 1) If P is null, zero theta, phi and r are returned.
 *
 * 2) At either pole, zero theta is returned.
 *
 * Called:
 *    c2s       p-vector to spherical
 *    pm        modulus of p-vector
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function p2s(p) {
  let theta = 0;
  let phi = 0;
  let r = 0;
  const _r1 = c2s(p);
  theta = _r1.theta;
  phi = _r1.phi;
  r = pm(p);
  return { theta, phi, r };
}
