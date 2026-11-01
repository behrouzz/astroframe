// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file fk52h.c.
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

import { fk5hip } from './fk5hip.js';
import { ppp } from './ppp.js';
import { pvstar } from './pvstar.js';
import { pxp } from './pxp.js';
import { rxp } from './rxp.js';
import { starpv } from './starpv.js';

/**
 * JS usage:  const { rh, dh, drh, ddh, pxh, rvh } = fk52h(r5, d5, dr5, dd5, px5, rv5)
 *
 * Transform FK5 (J2000.0) star data into the Hipparcos system.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  support function.
 *
 * Given (all FK5, equinox J2000.0, epoch J2000.0):
 *    r5      double    RA (radians)
 *    d5      double    Dec (radians)
 *    dr5     double    proper motion in RA (dRA/dt, rad/Jyear)
 *    dd5     double    proper motion in Dec (dDec/dt, rad/Jyear)
 *    px5     double    parallax (arcsec)
 *    rv5     double    radial velocity (km/s, positive = receding)
 *
 * Returned (all Hipparcos, epoch J2000.0):
 *    rh      double    RA (radians)
 *    dh      double    Dec (radians)
 *    drh     double    proper motion in RA (dRA/dt, rad/Jyear)
 *    ddh     double    proper motion in Dec (dDec/dt, rad/Jyear)
 *    pxh     double    parallax (arcsec)
 *    rvh     double    radial velocity (km/s, positive = receding)
 *
 * Notes:
 *
 * 1) This function transforms FK5 star positions and proper motions
 *    into the system of the Hipparcos catalog.
 *
 * 2) The proper motions in RA are dRA/dt rather than
 *    cos(Dec)*dRA/dt, and are per year rather than per century.
 *
 * 3) The FK5 to Hipparcos transformation is modeled as a pure
 *    rotation and spin;  zonal errors in the FK5 catalog are not
 *    taken into account.
 *
 * 4) See also h2fk5, fk5hz, hfk5z.
 *
 * Called:
 *    starpv    star catalog data to space motion pv-vector
 *    fk5hip    FK5 to Hipparcos rotation and spin
 *    rxp       product of r-matrix and p-vector
 *    pxp       vector product of two p-vectors
 *    ppp       p-vector plus p-vector
 *    pvstar    space motion pv-vector to star catalog data
 *
 * Reference:
 *
 *    F.Mignard & M.Froeschle, Astron.Astrophys., 354, 732-739 (2000).
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function fk52h(r5, d5, dr5, dd5, px5, rv5) {
  let rh = 0;
  let dh = 0;
  let drh = 0;
  let ddh = 0;
  let pxh = 0;
  let rvh = 0;
  let i;
  let pv5 = [[0, 0, 0], [0, 0, 0]];
  let r5h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let s5h = [0, 0, 0];
  let wxp = [0, 0, 0];
  let vv = [0, 0, 0];
  let pvh = [[0, 0, 0], [0, 0, 0]];
  const _r1 = starpv(r5, d5, dr5, dd5, px5, rv5);
  pv5 = _r1.pv;
  _r1.status;
  const _r2 = fk5hip();
  r5h = _r2.r5h;
  s5h = _r2.s5h;
  for (i = 0; i < 3; s5h[i++] /= 365.25) {
  }
  pvh[0] = rxp(r5h, pv5[0]);
  wxp = pxp(pv5[0], s5h);
  vv = ppp(wxp, pv5[1]);
  pvh[1] = rxp(r5h, vv);
  const _r3 = pvstar(pvh);
  rh = _r3.ra;
  dh = _r3.dec;
  drh = _r3.pmr;
  ddh = _r3.pmd;
  pxh = _r3.px;
  rvh = _r3.rv;
  _r3.status;
  return { rh, dh, drh, ddh, pxh, rvh };
}
