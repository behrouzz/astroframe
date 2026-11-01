// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file tdbtcb.c.
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

import { DAYSEC, DJM0, DJM77, ELB, TDB0, TTMTAI } from './constants.js';

const t77td = DJM0 + DJM77;
const t77tf = TTMTAI / DAYSEC;
const tdb0 = TDB0 / DAYSEC;
const elbb = ELB / (1.0 - ELB);

/**
 * JS usage:  const { tcb1, tcb2, status } = tdbtcb(tdb1, tdb2)
 *
 * Time scale transformation:  Barycentric Dynamical Time, TDB, to
 * Barycentric Coordinate Time, TCB.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical.
 *
 * Given:
 *    tdb1,tdb2  double    TDB as a 2-part Julian Date
 *
 * Returned:
 *    tcb1,tcb2  double    TCB as a 2-part Julian Date
 *
 * Returned (function value):
 *               int       status:  0 = OK
 *
 * Notes:
 *
 * 1) tdb1+tdb2 is Julian Date, apportioned in any convenient way
 *    between the two arguments, for example where tdb1 is the Julian
 *    Day Number and tdb2 is the fraction of a day.  The returned
 *    tcb1,tcb2 follow suit.
 *
 * 2) The 2006 IAU General Assembly introduced a conventional linear
 *    transformation between TDB and TCB.  This transformation
 *    compensates for the drift between TCB and terrestrial time TT,
 *    and keeps TDB approximately centered on TT.  Because the
 *    relationship between TT and TCB depends on the adopted solar
 *    system ephemeris, the degree of alignment between TDB and TT over
 *    long intervals will vary according to which ephemeris is used.
 *    Former definitions of TDB attempted to avoid this problem by
 *    stipulating that TDB and TT should differ only by periodic
 *    effects.  This is a good description of the nature of the
 *    relationship but eluded precise mathematical formulation.  The
 *    conventional linear relationship adopted in 2006 sidestepped
 *    these difficulties whilst delivering a TDB that in practice was
 *    consistent with values before that date.
 *
 * 3) TDB is essentially the same as Teph, the time argument for the
 *    JPL solar system ephemerides.
 *
 * Reference:
 *
 *    IAU 2006 Resolution B3
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function tdbtcb(tdb1, tdb2) {
  let tcb1 = 0;
  let tcb2 = 0;
  let d;
  let f;
  if (Math.abs(tdb1) > Math.abs(tdb2)) {
    d = t77td - tdb1;
    f = tdb2 - tdb0;
    tcb1 = tdb1;
    tcb2 = f - (d - (f - t77tf)) * elbb;
  } else {
    d = t77td - tdb2;
    f = tdb1 - tdb0;
    tcb1 = f - (d - (f - t77tf)) * elbb;
    tcb2 = tdb2;
  }
  return { tcb1, tcb2, status: 0 };
}
