// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ld.c.
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
import { gmax } from './util.js';
import { pdp } from './pdp.js';
import { pxp } from './pxp.js';

/**
 * JS usage:  const p1 = ld(bm, p, q, e, em, dlim)
 *
 * Apply light deflection by a solar-system body, as part of
 * transforming coordinate direction into natural direction.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    bm     double     mass of the gravitating body (solar masses)
 *    p      double[3]  direction from observer to source (unit vector)
 *    q      double[3]  direction from body to source (unit vector)
 *    e      double[3]  direction from body to observer (unit vector)
 *    em     double     distance from body to observer (au)
 *    dlim   double     deflection limiter (Note 4)
 *
 * Returned:
 *    p1     double[3]  observer to deflected source (unit vector)
 *
 * Notes:
 *
 * 1) The algorithm is based on Expr. (70) in Klioner (2003) and
 *    Expr. (7.63) in the Explanatory Supplement (Urban & Seidelmann
 *    2013), with some rearrangement to minimize the effects of machine
 *    precision.
 *
 * 2) The mass parameter bm can, as required, be adjusted in order to
 *    allow for such effects as quadrupole field.
 *
 * 3) The barycentric position of the deflecting body should ideally
 *    correspond to the time of closest approach of the light ray to
 *    the body.
 *
 * 4) The deflection limiter parameter dlim is phi^2/2, where phi is
 *    the angular separation (in radians) between source and body at
 *    which limiting is applied.  As phi shrinks below the chosen
 *    threshold, the deflection is artificially reduced, reaching zero
 *    for phi = 0.
 *
 * 5) The returned vector p1 is not normalized, but the consequential
 *    departure from unit magnitude is always negligible.
 *
 * 6) The arguments p and p1 can be the same array.
 *
 * 7) To accumulate total light deflection taking into account the
 *    contributions from several bodies, call the present function for
 *    each body in succession, in decreasing order of distance from the
 *    observer.
 *
 * 8) For efficiency, validation is omitted.  The supplied vectors must
 *    be of unit magnitude, and the deflection limiter non-zero and
 *    positive.
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
 *    pxp       vector product of two p-vectors
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ld(bm, p, q, e, em, dlim) {
  let p1 = [0, 0, 0];
  let i;
  let qpe = [0, 0, 0];
  let qdqpe;
  let w;
  let eq = [0, 0, 0];
  let peq = [0, 0, 0];
  for (i = 0; i < 3; i++) {
    qpe[i] = q[i] + e[i];
  }
  qdqpe = pdp(q, qpe);
  w = bm * SRS / em / gmax(qdqpe, dlim);
  eq = pxp(e, q);
  peq = pxp(p, eq);
  for (i = 0; i < 3; i++) {
    p1[i] = p[i] + w * peq[i];
  }
  return p1;
}
