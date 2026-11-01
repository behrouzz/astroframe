// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofa.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Structures of sofa.h.

/**
 * Star-independent astrometry parameters (iauASTROM).
 * @typedef {Object} Astrom
 * @property {number} pmt    PM time interval (SSB, Julian years)
 * @property {number[]} eb   SSB to observer (vector, au)
 * @property {number[]} eh   Sun to observer (unit vector)
 * @property {number} em     distance from Sun to observer (au)
 * @property {number[]} v    barycentric observer velocity (vector, c)
 * @property {number} bm1    sqrt(1-|v|^2): reciprocal of Lorenz factor
 * @property {number[][]} bpn bias-precession-nutation matrix
 * @property {number} along  longitude + s' + dERA(DUT) (radians)
 * @property {number} phi    geodetic latitude (radians)
 * @property {number} xpl    polar motion xp wrt local meridian (radians)
 * @property {number} ypl    polar motion yp wrt local meridian (radians)
 * @property {number} sphi   sine of geodetic latitude
 * @property {number} cphi   cosine of geodetic latitude
 * @property {number} diurab magnitude of diurnal aberration vector
 * @property {number} eral   "local" Earth rotation angle (radians)
 * @property {number} refa   refraction constant A (radians)
 * @property {number} refb   refraction constant B (radians)
 */

/** Create a zero-filled Astrom object. @returns {Astrom} */
export function newAstrom() {
  return {
    pmt: 0, eb: [0, 0, 0], eh: [0, 0, 0], em: 0, v: [0, 0, 0], bm1: 0,
    bpn: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    along: 0, phi: 0, xpl: 0, ypl: 0, sphi: 0, cphi: 0, diurab: 0, eral: 0, refa: 0, refb: 0,
  };
}

/**
 * Body parameters for light deflection (iauLDBODY).
 * @typedef {Object} LdBody
 * @property {number} bm    mass of the body (solar masses)
 * @property {number} dl    deflection limiter (radians^2/2)
 * @property {number[][]} pv barycentric PV of the body (au, au/day)
 */

/** Create a zero-filled LdBody object. @returns {LdBody} */
export function newLdbody() {
  return { bm: 0, dl: 0, pv: [[0, 0, 0], [0, 0, 0]] };
}
