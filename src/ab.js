// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ab.c.
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

import { SRS } from './constants.js';
import { pdp } from './pdp.js';

/**
 * JS usage:  const ppr = ab(pnat, v, s, bm1)
 *
 * Apply aberration to transform natural direction into proper
 * direction.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *   pnat    double[3]   natural direction to the source (unit vector)
 *   v       double[3]   observer barycentric velocity in units of c
 *   s       double      distance between the Sun and the observer (au)
 *   bm1     double      sqrt(1-|v|^2): reciprocal of Lorenz factor
 *
 * Returned:
 *   ppr     double[3]   proper direction to source (unit vector)
 *
 * Notes:
 *
 * 1) The algorithm is based on Expr. (7.40) in the Explanatory
 *    Supplement (Urban & Seidelmann 2013), but with the following
 *    changes:
 *
 *    o  Rigorous rather than approximate normalization is applied.
 *
 *    o  The gravitational potential term from Expr. (7) in
 *       Klioner (2003) is added, taking into account only the Sun's
 *       contribution.  This has a maximum effect of about
 *       0.4 microarcsecond.
 *
 * 2) In almost all cases, the maximum accuracy will be limited by the
 *    supplied velocity.  For example, if the SOFA epv00 function is
 *    used, errors of up to 5 microarcseconds could occur.
 *
 * References:
 *
 *    Urban, S. & Seidelmann, P. K. (eds), Explanatory Supplement to
 *    the Astronomical Almanac, 3rd ed., University Science Books
 *    (2013).
 *
 *    Klioner, Sergei A., "A practical relativistic model for micro-
 *    arcsecond astrometry in space", Astr. J. 125, 1580-1597 (2003).
 *
 * Called:
 *    pdp       scalar product of two p-vectors
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ab(pnat, v, s, bm1) {
  let ppr = [0, 0, 0];
  let i;
  let pdv;
  let w1;
  let w2;
  let r2;
  let w;
  let p = [0, 0, 0];
  let r;
  pdv = pdp(pnat, v);
  w1 = 1.0 + pdv / (1.0 + bm1);
  w2 = SRS / s;
  r2 = 0.0;
  for (i = 0; i < 3; i++) {
    w = pnat[i] * bm1 + w1 * v[i] + w2 * (v[i] - pdv * pnat[i]);
    p[i] = w;
    r2 = r2 + w * w;
  }
  r = Math.sqrt(r2);
  for (i = 0; i < 3; i++) {
    ppr[i] = p[i] / r;
  }
  return ppr;
}
