// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file ldn.c.
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

import { AULT, DAYSEC } from './constants.js';
import { gmin } from './util.js';
import { cp } from './cp.js';
import { ld } from './ld.js';
import { pdp } from './pdp.js';
import { pmp } from './pmp.js';
import { pn } from './pn.js';
import { ppsp } from './ppsp.js';

/**
 * JS usage:  const sn = ldn(n, b, ob, sc)
 *
 * +
 * - - - - - - -
 *  i a u L d n
 * - - - - - - -
 *
 * For a star, apply light deflection by multiple solar-system bodies,
 * as part of transforming coordinate direction into natural direction.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    n    int           number of bodies (note 1)
 *    b    lDBODY[n]  data for each of the n bodies (Notes 1,2):
 *     bm   double         mass of the body (solar masses, Note 3)
 *     dl   double         deflection limiter (Note 4)
 *     pv   [2][3]         barycentric PV of the body (au, au/day)
 *    ob   double[3]     barycentric position of the observer (au)
 *    sc   double[3]     observer to star coord direction (unit vector)
 *
 * Returned:
 *    sn    double[3]      observer to deflected star (unit vector)
 *
 * 1) The array b contains n entries, one for each body to be
 *    considered.  If n = 0, no gravitational light deflection will be
 *    applied, not even for the Sun.
 *
 * 2) The array b should include an entry for the Sun as well as for
 *    any planet or other body to be taken into account.  The entries
 *    should be in the order in which the light passes the body.
 *
 * 3) In the entry in the b array for body i, the mass parameter
 *    b[i].bm can, as required, be adjusted in order to allow for such
 *    effects as quadrupole field.
 *
 * 4) The deflection limiter parameter b[i].dl is phi^2/2, where phi is
 *    the angular separation (in radians) between star and body at
 *    which limiting is applied.  As phi shrinks below the chosen
 *    threshold, the deflection is artificially reduced, reaching zero
 *    for phi = 0.   Example values suitable for a terrestrial
 *    observer, together with masses, are as follows:
 *
 *       body i     b[i].bm        b[i].dl
 *
 *       Sun        1.0            6e-6
 *       Jupiter    0.00095435     3e-9
 *       Saturn     0.00028574     3e-10
 *
 * 5) For cases where the starlight passes the body before reaching the
 *    observer, the body is placed back along its barycentric track by
 *    the light time from that point to the observer.  For cases where
 *    the body is "behind" the observer no such shift is applied.  If
 *    a different treatment is preferred, the user has the option of
 *    instead using the ld function.  Similarly, ld can be used
 *    for cases where the source is nearby, not a star.
 *
 * 6) The returned vector sn is not normalized, but the consequential
 *    departure from unit magnitude is always negligible.
 *
 * 7) The arguments sc and sn can be the same array.
 *
 * 8) For efficiency, validation is omitted.  The supplied masses must
 *    be greater than zero, the position and velocity vectors must be
 *    right, and the deflection limiter greater than zero.
 *
 * Reference:
 *
 *    Urban, S. & Seidelmann, P. K. (eds), Explanatory Supplement to
 *    the Astronomical Almanac, 3rd ed., University Science Books
 *    (2013), Section 7.2.4.
 *
 * Called:
 *    cp        copy p-vector
 *    pdp       scalar product of two p-vectors
 *    pmp       p-vector minus p-vector
 *    ppsp      p-vector plus scaled p-vector
 *    pn        decompose p-vector into modulus and direction
 *    ld        light deflection by a solar-system body
 *
 * This revision:   2021 February 24
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function ldn(n, b, ob, sc) {
  let sn = [0, 0, 0];
  const CR = AULT / DAYSEC;
  let i;
  let v = [0, 0, 0];
  let dt;
  let ev = [0, 0, 0];
  let em;
  let e = [0, 0, 0];
  sn = cp(sc);
  for (i = 0; i < n; i++) {
    v = pmp(ob, b[i].pv[0]);
    dt = pdp(sn, v) * CR;
    dt = gmin(dt, 0.0);
    ev = ppsp(v, -dt, b[i].pv[1]);
    const _r1 = pn(ev);
    em = _r1.r;
    e = _r1.u;
    sn = ld(b[i].bm, sn, sn, e, em, b[i].dl);
  }
  return sn;
}
