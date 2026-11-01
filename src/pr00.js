// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pr00.c.
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

import { DAS2R, DJ00, DJC } from './constants.js';

const PRECOR = -0.29965 * DAS2R;
const OBLCOR = -0.02524 * DAS2R;

/**
 * JS usage:  const { dpsipr, depspr } = pr00(date1, date2)
 *
 * Precession-rate part of the IAU 2000 precession-nutation models
 * (part of MHB2000).
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2    double  TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    dpsipr,depspr  double  precession corrections (Notes 2,3)
 *
 * Notes:
 *
 * 1) The TT date date1+date2 is a Julian Date, apportioned in any
 *    convenient way between the two arguments.  For example,
 *    JD(TT)=2450123.7 could be expressed in any of these ways,
 *    among others:
 *
 *           date1          date2
 *
 *        2450123.7           0.0       (JD method)
 *        2451545.0       -1421.3       (J2000 method)
 *        2400000.5       50123.2       (MJD method)
 *        2450123.5           0.2       (date & time method)
 *
 *    The JD method is the most natural and convenient to use in
 *    cases where the loss of several decimal digits of resolution
 *    is acceptable.  The J2000 method is best matched to the way
 *    the argument is handled internally and will deliver the
 *    optimum resolution.  The MJD method and the date & time methods
 *    are both good compromises between resolution and convenience.
 *
 * 2) The precession adjustments are expressed as "nutation
 *    components", corrections in longitude and obliquity with respect
 *    to the J2000.0 equinox and ecliptic.
 *
 * 3) Although the precession adjustments are stated to be with respect
 *    to Lieske et al. (1977), the MHB2000 model does not specify which
 *    set of Euler angles are to be used and how the adjustments are to
 *    be applied.  The most literal and straightforward procedure is to
 *    adopt the 4-rotation epsilon_0, psi_A, omega_A, xi_A option, and
 *    to add dpsipr to psi_A and depspr to both omega_A and eps_A.
 *
 * 4) This is an implementation of one aspect of the IAU 2000A nutation
 *    model, formally adopted by the IAU General Assembly in 2000,
 *    namely MHB2000 (Mathews et al. 2002).
 *
 * References:
 *
 *    Lieske, J.H., Lederle, T., Fricke, W. & Morando, B., "Expressions
 *    for the precession quantities based upon the IAU (1976) System of
 *    Astronomical Constants", Astron.Astrophys., 58, 1-16 (1977)
 *
 *    Mathews, P.M., Herring, T.A., Buffet, B.A., "Modeling of nutation
 *    and precession   New nutation series for nonrigid Earth and
 *    insights into the Earth's interior", J.Geophys.Res., 107, B4,
 *    2002.  The MHB2000 code itself was obtained on 9th September 2002
 *    from ftp://maia.usno.navy.mil/conv2000/chapter5/IAU2000A.
 *
 *    Wallace, P.T., "Software for Implementing the IAU 2000
 *    Resolutions", in IERS Workshop 5.1 (2002).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pr00(date1, date2) {
  let dpsipr = 0;
  let depspr = 0;
  let t;
  t = (date1 - DJ00 + date2) / DJC;
  dpsipr = PRECOR * t;
  depspr = OBLCOR * t;
  return { dpsipr, depspr };
}
