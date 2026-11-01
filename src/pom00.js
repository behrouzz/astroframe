// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pom00.c.
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
import { ry } from './ry.js';
import { rz } from './rz.js';

/**
 * JS usage:  const rpom = pom00(xp, yp, sp)
 *
 * Form the matrix of polar motion for a given date, IAU 2000.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given:
 *    xp,yp    double    coordinates of the pole (radians, Note 1)
 *    sp       double    the TIO locator s' (radians, Note 2)
 *
 * Returned:
 *    rpom     double[3][3]   polar-motion matrix (Note 3)
 *
 * Notes:
 *
 * 1) The arguments xp and yp are the coordinates (in radians) of the
 *    Celestial Intermediate Pole with respect to the International
 *    Terrestrial Reference System (see IERS Conventions 2003),
 *    measured along the meridians 0 and 90 deg west respectively.
 *
 * 2) The argument sp is the TIO locator s', in radians, which
 *    positions the Terrestrial Intermediate Origin on the equator.  It
 *    is obtained from polar motion observations by numerical
 *    integration, and so is in essence unpredictable.  However, it is
 *    dominated by a secular drift of about 47 microarcseconds per
 *    century, and so can be taken into account by using s' = -47*t,
 *    where t is centuries since J2000.0.  The function sp00
 *    implements this approximation.
 *
 * 3) The matrix operates in the sense V(TRS) = rpom * V(CIP), meaning
 *    that it is the final rotation when computing the pointing
 *    direction to a celestial source.
 *
 * Called:
 *    ir        initialize r-matrix to identity
 *    rz        rotate around Z-axis
 *    ry        rotate around Y-axis
 *    rx        rotate around X-axis
 *
 * Reference:
 *
 *    McCarthy, D. D., Petit, G. (eds.), IERS Conventions (2003),
 *    IERS Technical Note No. 32, BKG (2004)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pom00(xp, yp, sp) {
  let rpom = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  rpom = ir();
  rz(sp, rpom);
  ry(-xp, rpom);
  rx(-yp, rpom);
  return rpom;
}
