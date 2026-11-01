// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file faju03.c.
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

import { D2PI } from './constants.js';

/**
 * JS usage:  const result = faju03(t)
 *
 * Fundamental argument, IERS Conventions (2003):
 * mean longitude of Jupiter.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    t     double    TDB, Julian centuries since J2000.0 (Note 1)
 *
 * Returned (function value):
 *          double    mean longitude of Jupiter, radians (Note 2)
 *
 * Notes:
 *
 * 1) Though t is strictly TDB, it is usually more convenient to use
 *    TT, which makes no significant difference.
 *
 * 2) The expression used is as adopted in IERS Conventions (2003) and
 *    comes from Souchay et al. (1999) after Simon et al. (1994).
 *
 * References:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 *    Simon, J.-L., Bretagnon, P., Chapront, J., Chapront-Touze, M.,
 *    Francou, G., Laskar, J. 1994, Astron.Astrophys. 282, 663-683
 *
 *    Souchay, J., Loysel, B., Kinoshita, H., Folgueira, M. 1999,
 *    Astron.Astrophys.Supp.Ser. 135, 111
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function faju03(t) {
  let a;
  a = (0.599546497 + 52.9690962641 * t) % D2PI;
  return a;
}
