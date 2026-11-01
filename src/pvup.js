// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file pvup.c.
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


/**
 * JS usage:  const p = pvup(dt, pv)
 *
 * Update a pv-vector, discarding the velocity component.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  vector/matrix support function.
 *
 * Given:
 *    dt       double            time interval
 *    pv       double[2][3]      pv-vector
 *
 * Returned:
 *    p        double[3]         p-vector
 *
 * Notes:
 *
 * 1) "Update" means "refer the position component of the vector to a
 *    new date dt time units from the existing date".
 *
 * 2) The time units of dt must match those of the velocity.
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function pvup(dt, pv) {
  let p = [0, 0, 0];
  p[0] = pv[0][0] + dt * pv[1][0];
  p[1] = pv[0][1] + dt * pv[1][1];
  p[2] = pv[0][2] + dt * pv[1][2];
  return p;
}
