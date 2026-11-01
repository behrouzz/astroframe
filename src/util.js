// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofam.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Internal helpers replacing the C macros of sofam.h and a few libc functions.

/** Truncate to nearest whole number towards zero. */
export function dint(a) {
  return a < 0.0 ? Math.ceil(a) : Math.floor(a);
}

/** Round to nearest whole number (halves away from zero). */
export function dnint(a) {
  return Math.abs(a) < 0.5 ? 0.0 : (a < 0.0 ? Math.ceil(a - 0.5) : Math.floor(a + 0.5));
}

/** Magnitude of a with the sign of b. */
export function dsign(a, b) {
  return b < 0.0 ? -Math.abs(a) : Math.abs(a);
}

/** Larger of two numbers. */
export function gmax(a, b) {
  return a > b ? a : b;
}

/** Smaller of two numbers. */
export function gmin(a, b) {
  return a < b ? a : b;
}

/** C-style strcmp: 0 when equal. */
export function strcmp(a, b) {
  return a === b ? 0 : (a < b ? -1 : 1);
}

/** Zero-filled (nested) array with the given dimensions. */
export function zeros(...dims) {
  const n = dims[0];
  const rest = dims.slice(1);
  return Array.from({ length: n }, () => (rest.length ? zeros(...rest) : 0));
}
