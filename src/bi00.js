// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file bi00.c.
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

import { DAS2R } from './constants.js';

/**
 * JS usage:  const { dpsibi, depsbi, dra } = bi00()
 *
 * Frame bias components of IAU 2000 precession-nutation models;  part
 * of the Mathews-Herring-Buffett (MHB2000) nutation series, with
 * additions.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Returned:
 *    dpsibi,depsbi  double  longitude and obliquity corrections
 *    dra            double  the ICRS RA of the J2000.0 mean equinox
 *
 * Notes:
 *
 * 1) The frame bias corrections in longitude and obliquity (radians)
 *    are required in order to correct for the offset between the GCRS
 *    pole and the mean J2000.0 pole.  They define, with respect to the
 *    GCRS frame, a J2000.0 mean pole that is consistent with the rest
 *    of the IAU 2000A precession-nutation model.
 *
 * 2) In addition to the displacement of the pole, the complete
 *    description of the frame bias requires also an offset in right
 *    ascension.  This is not part of the IAU 2000A model, and is from
 *    Chapront et al. (2002).  It is returned in radians.
 *
 * 3) This is a supplemented implementation of one aspect of the IAU
 *    2000A nutation model, formally adopted by the IAU General
 *    Assembly in 2000, namely MHB2000 (Mathews et al. 2002).
 *
 * References:
 *
 *    Chapront, J., Chapront-Touze, M. & Francou, G., Astron.
 *    Astrophys., 387, 700, 2002.
 *
 *    Mathews, P.M., Herring, T.A., Buffet, B.A., "Modeling of nutation
 *    and precession:  New nutation series for nonrigid Earth and
 *    insights into the Earth's interior", J.Geophys.Res., 107, B4,
 *    2002.  The MHB2000 code itself was obtained on 2002 September 9
 *    from ftp://maia.usno.navy.mil/conv2000/chapter5/IAU2000A.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function bi00() {
  let dpsibi = 0;
  let depsbi = 0;
  let dra = 0;
  const DPBIAS = -0.041775 * DAS2R;
  const DEBIAS = -0.0068192 * DAS2R;
  const DRA0 = -0.0146 * DAS2R;
  dpsibi = DPBIAS;
  depsbi = DEBIAS;
  dra = DRA0;
  return { dpsibi, depsbi, dra };
}
