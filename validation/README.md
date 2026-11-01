# Independent validation against the original SOFA C code

`python validation/run.py [--cases N] [--seed S] [--opt=-O2]` (needs gcc, node, Python 3)

1. generates seeded random inputs for all 247 routines (typical ranges, plus invalid dates,
   out-of-range selectors and UTC leap-second days);
2. builds a C driver and links it with the **unmodified** SOFA sources in `20231011/c/src`;
3. runs the same inputs (exchanged as `%.17g` text, bit-exact) through astroframe;
4. compares every returned value, array, struct field and status code, in ulps and absolute error,
   and repeats the JS run with a 1-ulp perturbation of Math.sin/cos/atan2/... to show the size of
   difference attributable to a different libm alone.

Output: `report.md`. `work/` (inputs, C and JS outputs, generated drivers) is not versioned.

Further independent checks worth adding before a public release: PyERFA (`pip install pyerfa`;
ERFA is a BSD relicensed SOFA derivative, so it is a check on compilation/platform rather than a
fully independent implementation); IERS/JPL reference values for time-scale and
Earth-orientation chains; a CI matrix over several browsers' JS engines (V8, SpiderMonkey,
JavaScriptCore have different libm implementations).

Note: the scripts expect the unmodified SOFA C release in `../20231011/c/src` (relative to this
repository), which is not included here. Download "SOFA for C, 2023-10-11" from www.iausofa.org and
unpack it so that `20231011/c/src/sofa.h` exists next to the `astroframe` folder. `npm run generate`
needs the same sources.
