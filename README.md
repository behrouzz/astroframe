# astroframe

JavaScript (ES modules) translation of the IAU **SOFA** (Standards of Fundamental Astronomy)
ANSI C library, release **2023-10-11**: all 247 routines for time scales, calendars, precession,
nutation, Earth rotation, frame transformations, astrometry, star catalogues and vector/matrix
maths. No dependencies, no backend, runs in modern browsers and in Node.js.

> **astroframe is a derived work. It is not software provided by, or endorsed by, the IAU SOFA
> Board.** It is distributed under the SOFA Software License (see [Licensing](#licensing)).
> Pre-release (`0.1.x`): see [Status and known limitations](#status-and-known-limitations).

## Install

Not published yet. When released:

```sh
npm install astroframe
```

Until then, from a local checkout: `npm pack` and `npm install ./astroframe-0.1.0.tgz`.

## Use (plain JavaScript, no TypeScript needed)

```js
import { dtf2d, utctai, taitt, jd2cal, a2tf, gd2gc, WGS84 } from 'astroframe';

// UTC calendar date/time -> two-part Julian Date
const { d1, d2, status } = dtf2d('UTC', 2024, 3, 20, 3, 6, 21.5);
if (status < 0) throw new Error('bad date');

// UTC -> TAI -> TT
const tai = utctai(d1, d2);           // { tai1, tai2, status }
const tt = taitt(tai.tai1, tai.tai2); // { tt1, tt2, status }

// angle (radians) -> sign, hours, minutes, seconds, fraction
const { sign, ihmsf } = a2tf(4, -3.01234);     // '-', [11, 30, 22, 6484]

// geodetic -> geocentric Cartesian (metres)
const { xyz } = gd2gc(WGS84, elong, phi, height);
```

React + Vite (verified with a production `vite build` of a plain-JS React app):

```jsx
import { useMemo } from 'react';
import { dtf2d, gmst06 } from 'astroframe';

export function Gmst({ y, m, d }) {
  const gmst = useMemo(() => {
    const { d1, d2 } = dtf2d('UTC', y, m, d, 12, 0, 0);
    return gmst06(d1, d2, d1, d2);   // radians; demo only: UT1 and TT are approximated by UTC
  }, [y, m, d]);
  return <p>GMST: {gmst.toFixed(6)} rad</p>;
}
```

Importing `from 'astroframe'` is tree-shakeable (`"sideEffects": false`): a bundle that uses only
`jd2cal` contains `jd2cal` plus the two small helpers it calls (about 0.9 kB minified), not the
whole library.

## API conventions

* **Names:** the `iau` prefix is dropped and the first letter lower-cased (`iauA2tf` -> `a2tf`,
  `iauJd2cal` -> `jd2cal`). The numerical algorithms and constants are unchanged.
  `sofam.h` macros are exported as constants: `DPI`, `D2PI`, `DR2D`, `DD2R`, `DAS2R`, `DJ00`,
  `DJM0`, `DJC`, `DAYSEC`, `DAU`, `CMPS`, `WGS84`, `GRS80`, `WGS72`, ...
* **Inputs** ("Given" in the SOFA docs) are ordinary arguments in the original order. `int`
  arguments must be integers.
* **Outputs** ("Returned"), written through pointers in C, are **returned**:

  | the C routine has ... | astroframe returns ... |
  |---|---|
  | one output, `void` return | the output itself: `const p = s2c(theta, phi)` |
  | several outputs and/or an `int` status | an object keyed by the C parameter names, plus `status` |
  | no output, `double` return | the number: `const w = pap(a, b)` |

  ```js
  const { iy, im, id, fd, status } = jd2cal(dj1, dj2);
  const { astrom, eo, status } = apco13(utc1, utc2, dut1, elong, phi, hm, xp, yp, phpa, tc, rh, wl);
  ```
* **Input/output** arguments ("Given and returned": `rx`, `ry`, `rz`) are passed in, **updated in
  place**, and also returned.
* **Status codes** keep SOFA's meaning (0 = OK, +1 = warning, negative = error). Check them: like
  the C library, routines do not throw.
* **Data layout:** vectors `[x, y, z]`; p-v pairs `[[x, y, z], [vx, vy, vz]]`; matrices arrays of
  rows `r[i][j]`; angles in radians; Julian Dates as two parts (`date1`, `date2`) for precision.
  `iauASTROM`/`iauLDBODY` are plain objects (`newAstrom()`, `newLdbody()`); routines that fill an
  astrom return it and accept an optional trailing `astrom` object to reuse. Strings replace C
  `char`s (`'+'`/`'-'`, `'UTC'`, `'R'`).
* **Docs and types:** every function carries the original SOFA documentation as JSDoc plus a
  "JS usage" line; `src/index.d.ts` contains TypeScript declarations for everything (checked with
  `tsc --strict`).

## Browser and runtime compatibility

The code is plain ES2015+ (modules, default parameters, `Math.trunc`, `Number.EPSILON`,
`Array.from`). It imports nothing but its own files and uses no Node.js, DOM, `process`,
`Buffer`, `fs`, `require` or timers (scanned, and a bundle was executed inside a bare `vm` context
with no globals besides the language builtins). Any browser or bundler that supports ES modules
should work. Tested with Node 24, Vite 7 and esbuild; other versions were not tested. The package
is **ESM-only** (`"type": "module"`); from CommonJS use `import()` (or `require(esm)` on recent
Node).

## Testing and validation

* `npm test` - SOFA's own validation suite `t_sofa_c.c`, mechanically translated (1494 checks,
  same expected values and tolerances). **One deliberate change:** the C test accepts a `NaN`
  result (its check `a != 0 && fabs(a) > fabs(dval)` is false for NaN); the JavaScript copy fails
  on NaN. That stricter check is what exposed a translator bug during review (see the report).
* `python validation/run.py` - independent differential test against the **original, unmodified C
  sources** compiled with gcc: 1000 random inputs per routine (including leap-second days, invalid
  dates and out-of-range arguments); all outputs and status codes are compared. Latest result in
  [`validation/report.md`](validation/report.md): 247 routines, 1,536,000 values, 95.6 %
  bit-identical, 117 routines bit-identical in every case, **no value differing by more than 1e-9**
  (absolute, or relative above 1). The remaining differences are last-bit effects consistent with V8's
  `Math.sin/cos/atan2...` differing from the C runtime's; the report also shows the effect of a
  deliberate 1-ulp perturbation of those functions for comparison.
  This is evidence of agreement with the C code on the sampled inputs, not a proof of identical
  results for all inputs; JavaScript results are **not guaranteed bit-identical** to C.

## Status and known limitations

* `dat` (leap seconds) is the table shipped with SOFA 2023-10-11 (last leap second 2017-01-01,
  TAI-UTC = 37 s) and returns the warning status +1 for years after 2028 (release year + 5), as in
  C. SOFA classifies `dat` as user-replaceable; decide before a public release how updated leap
  second data will be supplied (a new release, or an override mechanism).
* Earth-orientation parameters (UT1-UTC, polar motion) are inputs; astroframe does not fetch them.
* Results can differ from C in the last bits (different libm). Integer arithmetic emulates C
  `int`/`long` division and truncation, but not 32-bit overflow or undefined behaviour with huge
  arguments (for example a very large `ndp`).
* Outputs that a C routine leaves unset on an error path are `0` here.
* The independent test samples typical-range inputs plus the deliberately invalid ones listed
  above; it does not cover every extreme input.

## Regenerating

`src/*.js`, `src/index.d.ts` and `test/t_sofa.mjs` are generated from the SOFA C sources by
`tools/c2js.py` (a small C-subset parser and JavaScript emitter that tracks C types so that integer
division truncates, and that handles pointer outputs, structs and walking pointers). `npm run
generate` rebuilds them (Python 3 required) and writes `tools/audit.txt`, a list of every
type-sensitive translation (integer division, double-to-int casts) for review. Fix translation
problems in the tool, not in `src/`.

## Licensing

astroframe is **derived from SOFA software** and is licensed under the **SOFA Software License**,
reproduced unchanged in [`LICENSE-SOFA.txt`](LICENSE-SOFA.txt) (Part 1: all routines; Part 2: the
variant for the user-replaceable routine `dat`). It is not relicensed under any other license.
In line with clause 3 of that license:

* this work **uses routines and computations derived from software provided by SOFA under license
  and does not itself constitute software provided by and/or endorsed by SOFA**;
* the origin of the SOFA components is not misrepresented: the algorithms, constants and
  documentation are SOFA's (Copyright 2023 IAU SOFA Board), release 2023-10-11;
* how this work differs from the original is stated in every source file header and here:
  `iau` prefix removed from routine names; outputs returned instead of passed by pointer; arrays
  and structs as JavaScript arrays/objects; C integer semantics emulated; walking-pointer table
  access rewritten with an explicit index; no change to the numerical algorithms or constants;
* no routine name contains the prefix `iau` or `sofa`;
* the license requirements must be reproduced intact in any source distribution (the package
  includes `LICENSE-SOFA.txt`).

Acknowledgement (appreciated by SOFA): www.iausofa.org.
