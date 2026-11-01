// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ldsun.c.
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

import { ld } from './ld.js';

/**
 * JS usage:  const p1 = ldsun(p, e, em)
 *
 * Deflection of starlight by the Sun.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    p      double[3]  direction from observer to star (unit vector)
 *    e      double[3]  direction from Sun to observer (unit vector)
 *    em     double     distance from Sun to observer (au)
 *
 * Returned:
 *    p1     double[3]  observer to deflected star (unit vector)
 *
 * Notes:
 *
 * 1) The source is presumed to be sufficiently distant that its
 *    directions seen from the Sun and the observer are essentially
 *    the same.
 *
 * 2) The deflection is restrained when the angle between the star and
 *    the center of the Sun is less than a threshold value, falling to
 *    zero deflection for zero separation.  The chosen threshold value
 *    is within the solar limb for all solar-system applications, and
 *    is about 5 arcminutes for the case of a terrestrial observer.
 *
 * 3) The arguments p and p1 can be the same array.
 *
 * Called:
 *    ld        light deflection by a solar-system body
 *
 * This revision:   2016 June 16
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ldsun(p, e, em) {
  let p1 = [0, 0, 0];
  let em2;
  let dlim;
  em2 = em * em;
  if (em2 < 1.0) {
    em2 = 1.0;
  }
  dlim = 1e-6 / (em2 > 1.0 ? em2 : 1.0);
  p1 = ld(1.0, p, p, e, em, dlim);
  return p1;
}
