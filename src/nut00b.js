// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file nut00b.c.
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

import { D2PI, DAS2R, DJ00, DJC, DMAS2R, TURNAS } from './constants.js';

const U2R = DAS2R / 1e7;
const DPPLAN = -0.135 * DMAS2R;
const DEPLAN = 0.388 * DMAS2R;
const x = [
  { nl: 0, nlp: 0, nf: 0, nd: 0, nom: 1, ps: -172064161.0, pst: -174666.0, pc: 33386.0, ec: 92052331.0, ect: 9086.0, es: 15377.0 },
  { nl: 0, nlp: 0, nf: 2, nd: -2, nom: 2, ps: -13170906.0, pst: -1675.0, pc: -13696.0, ec: 5730336.0, ect: -3015.0, es: -4587.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 2, ps: -2276413.0, pst: -234.0, pc: 2796.0, ec: 978459.0, ect: -485.0, es: 1374.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 0, nom: 2, ps: 2074554.0, pst: 207.0, pc: -698.0, ec: -897492.0, ect: 470.0, es: -291.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 0, nom: 0, ps: 1475877.0, pst: -3633.0, pc: 11817.0, ec: 73871.0, ect: -184.0, es: -1924.0 },
  { nl: 0, nlp: 1, nf: 2, nd: -2, nom: 2, ps: -516821.0, pst: 1226.0, pc: -524.0, ec: 224386.0, ect: -677.0, es: -174.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 0, ps: 711159.0, pst: 73.0, pc: -872.0, ec: -6750.0, ect: 0.0, es: 358.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 1, ps: -387298.0, pst: -367.0, pc: 380.0, ec: 200728.0, ect: 18.0, es: 318.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 2, ps: -301461.0, pst: -36.0, pc: 816.0, ec: 129025.0, ect: -63.0, es: 367.0 },
  { nl: 0, nlp: -1, nf: 2, nd: -2, nom: 2, ps: 215829.0, pst: -494.0, pc: 111.0, ec: -95929.0, ect: 299.0, es: 132.0 },
  { nl: 0, nlp: 0, nf: 2, nd: -2, nom: 1, ps: 128227.0, pst: 137.0, pc: 181.0, ec: -68982.0, ect: -9.0, es: 39.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 0, nom: 2, ps: 123457.0, pst: 11.0, pc: 19.0, ec: -53311.0, ect: 32.0, es: -4.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 2, nom: 0, ps: 156994.0, pst: 10.0, pc: -168.0, ec: -1235.0, ect: 0.0, es: 82.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 1, ps: 63110.0, pst: 63.0, pc: 27.0, ec: -33228.0, ect: 0.0, es: -9.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 0, nom: 1, ps: -57976.0, pst: -63.0, pc: -189.0, ec: 31429.0, ect: 0.0, es: -75.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 2, nom: 2, ps: -59641.0, pst: -11.0, pc: 149.0, ec: 25543.0, ect: -11.0, es: 66.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 1, ps: -51613.0, pst: -42.0, pc: 129.0, ec: 26366.0, ect: 0.0, es: 78.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 0, nom: 1, ps: 45893.0, pst: 50.0, pc: 31.0, ec: -24236.0, ect: -10.0, es: 20.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 2, nom: 0, ps: 63384.0, pst: 11.0, pc: -150.0, ec: -1220.0, ect: 0.0, es: 29.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 2, nom: 2, ps: -38571.0, pst: -1.0, pc: 158.0, ec: 16452.0, ect: -11.0, es: 68.0 },
  { nl: 0, nlp: -2, nf: 2, nd: -2, nom: 2, ps: 32481.0, pst: 0.0, pc: 0.0, ec: -13870.0, ect: 0.0, es: 0.0 },
  { nl: -2, nlp: 0, nf: 0, nd: 2, nom: 0, ps: -47722.0, pst: 0.0, pc: -18.0, ec: 477.0, ect: 0.0, es: -25.0 },
  { nl: 2, nlp: 0, nf: 2, nd: 0, nom: 2, ps: -31046.0, pst: -1.0, pc: 131.0, ec: 13238.0, ect: -11.0, es: 59.0 },
  { nl: 1, nlp: 0, nf: 2, nd: -2, nom: 2, ps: 28593.0, pst: 0.0, pc: -1.0, ec: -12338.0, ect: 10.0, es: -3.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 0, nom: 1, ps: 20441.0, pst: 21.0, pc: 10.0, ec: -10758.0, ect: 0.0, es: -3.0 },
  { nl: 2, nlp: 0, nf: 0, nd: 0, nom: 0, ps: 29243.0, pst: 0.0, pc: -74.0, ec: -609.0, ect: 0.0, es: 13.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 0, nom: 0, ps: 25887.0, pst: 0.0, pc: -66.0, ec: -550.0, ect: 0.0, es: 11.0 },
  { nl: 0, nlp: 1, nf: 0, nd: 0, nom: 1, ps: -14053.0, pst: -25.0, pc: 79.0, ec: 8551.0, ect: -2.0, es: -45.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 2, nom: 1, ps: 15164.0, pst: 10.0, pc: 11.0, ec: -8001.0, ect: 0.0, es: -1.0 },
  { nl: 0, nlp: 2, nf: 2, nd: -2, nom: 2, ps: -15794.0, pst: 72.0, pc: -16.0, ec: 6850.0, ect: -42.0, es: -5.0 },
  { nl: 0, nlp: 0, nf: -2, nd: 2, nom: 0, ps: 21783.0, pst: 0.0, pc: 13.0, ec: -167.0, ect: 0.0, es: 13.0 },
  { nl: 1, nlp: 0, nf: 0, nd: -2, nom: 1, ps: -12873.0, pst: -10.0, pc: -37.0, ec: 6953.0, ect: 0.0, es: -14.0 },
  { nl: 0, nlp: -1, nf: 0, nd: 0, nom: 1, ps: -12654.0, pst: 11.0, pc: 63.0, ec: 6415.0, ect: 0.0, es: 26.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 2, nom: 1, ps: -10204.0, pst: 0.0, pc: 25.0, ec: 5222.0, ect: 0.0, es: 15.0 },
  { nl: 0, nlp: 2, nf: 0, nd: 0, nom: 0, ps: 16707.0, pst: -85.0, pc: -10.0, ec: 168.0, ect: -1.0, es: 10.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 2, nom: 2, ps: -7691.0, pst: 0.0, pc: 44.0, ec: 3268.0, ect: 0.0, es: 19.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 0, nom: 0, ps: -11024.0, pst: 0.0, pc: -14.0, ec: 104.0, ect: 0.0, es: 2.0 },
  { nl: 0, nlp: 1, nf: 2, nd: 0, nom: 2, ps: 7566.0, pst: -21.0, pc: -11.0, ec: -3250.0, ect: 0.0, es: -5.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 2, nom: 1, ps: -6637.0, pst: -11.0, pc: 25.0, ec: 3353.0, ect: 0.0, es: 14.0 },
  { nl: 0, nlp: -1, nf: 2, nd: 0, nom: 2, ps: -7141.0, pst: 21.0, pc: 8.0, ec: 3070.0, ect: 0.0, es: 4.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 2, nom: 1, ps: -6302.0, pst: -11.0, pc: 2.0, ec: 3272.0, ect: 0.0, es: 4.0 },
  { nl: 1, nlp: 0, nf: 2, nd: -2, nom: 1, ps: 5800.0, pst: 10.0, pc: 2.0, ec: -3045.0, ect: 0.0, es: -1.0 },
  { nl: 2, nlp: 0, nf: 2, nd: -2, nom: 2, ps: 6443.0, pst: 0.0, pc: -7.0, ec: -2768.0, ect: 0.0, es: -4.0 },
  { nl: -2, nlp: 0, nf: 0, nd: 2, nom: 1, ps: -5774.0, pst: -11.0, pc: -15.0, ec: 3041.0, ect: 0.0, es: -5.0 },
  { nl: 2, nlp: 0, nf: 2, nd: 0, nom: 1, ps: -5350.0, pst: 0.0, pc: 21.0, ec: 2695.0, ect: 0.0, es: 12.0 },
  { nl: 0, nlp: -1, nf: 2, nd: -2, nom: 1, ps: -4752.0, pst: -11.0, pc: -3.0, ec: 2719.0, ect: 0.0, es: -3.0 },
  { nl: 0, nlp: 0, nf: 0, nd: -2, nom: 1, ps: -4940.0, pst: -11.0, pc: -21.0, ec: 2720.0, ect: 0.0, es: -9.0 },
  { nl: -1, nlp: -1, nf: 0, nd: 2, nom: 0, ps: 7350.0, pst: 0.0, pc: -8.0, ec: -51.0, ect: 0.0, es: 4.0 },
  { nl: 2, nlp: 0, nf: 0, nd: -2, nom: 1, ps: 4065.0, pst: 0.0, pc: 6.0, ec: -2206.0, ect: 0.0, es: 1.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 2, nom: 0, ps: 6579.0, pst: 0.0, pc: -24.0, ec: -199.0, ect: 0.0, es: 2.0 },
  { nl: 0, nlp: 1, nf: 2, nd: -2, nom: 1, ps: 3579.0, pst: 0.0, pc: 5.0, ec: -1900.0, ect: 0.0, es: 1.0 },
  { nl: 1, nlp: -1, nf: 0, nd: 0, nom: 0, ps: 4725.0, pst: 0.0, pc: -6.0, ec: -41.0, ect: 0.0, es: 3.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 0, nom: 2, ps: -3075.0, pst: 0.0, pc: -2.0, ec: 1313.0, ect: 0.0, es: -1.0 },
  { nl: 3, nlp: 0, nf: 2, nd: 0, nom: 2, ps: -2904.0, pst: 0.0, pc: 15.0, ec: 1233.0, ect: 0.0, es: 7.0 },
  { nl: 0, nlp: -1, nf: 0, nd: 2, nom: 0, ps: 4348.0, pst: 0.0, pc: -10.0, ec: -81.0, ect: 0.0, es: 2.0 },
  { nl: 1, nlp: -1, nf: 2, nd: 0, nom: 2, ps: -2878.0, pst: 0.0, pc: 8.0, ec: 1232.0, ect: 0.0, es: 4.0 },
  { nl: 0, nlp: 0, nf: 0, nd: 1, nom: 0, ps: -4230.0, pst: 0.0, pc: 5.0, ec: -20.0, ect: 0.0, es: -2.0 },
  { nl: -1, nlp: -1, nf: 2, nd: 2, nom: 2, ps: -2819.0, pst: 0.0, pc: 7.0, ec: 1207.0, ect: 0.0, es: 3.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 0, nom: 0, ps: -4056.0, pst: 0.0, pc: 5.0, ec: 40.0, ect: 0.0, es: -2.0 },
  { nl: 0, nlp: -1, nf: 2, nd: 2, nom: 2, ps: -2647.0, pst: 0.0, pc: 11.0, ec: 1129.0, ect: 0.0, es: 5.0 },
  { nl: -2, nlp: 0, nf: 0, nd: 0, nom: 1, ps: -2294.0, pst: 0.0, pc: -10.0, ec: 1266.0, ect: 0.0, es: -4.0 },
  { nl: 1, nlp: 1, nf: 2, nd: 0, nom: 2, ps: 2481.0, pst: 0.0, pc: -7.0, ec: -1062.0, ect: 0.0, es: -3.0 },
  { nl: 2, nlp: 0, nf: 0, nd: 0, nom: 1, ps: 2179.0, pst: 0.0, pc: -2.0, ec: -1129.0, ect: 0.0, es: -2.0 },
  { nl: -1, nlp: 1, nf: 0, nd: 1, nom: 0, ps: 3276.0, pst: 0.0, pc: 1.0, ec: -9.0, ect: 0.0, es: 0.0 },
  { nl: 1, nlp: 1, nf: 0, nd: 0, nom: 0, ps: -3389.0, pst: 0.0, pc: 5.0, ec: 35.0, ect: 0.0, es: -2.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 0, nom: 0, ps: 3339.0, pst: 0.0, pc: -13.0, ec: -107.0, ect: 0.0, es: 1.0 },
  { nl: -1, nlp: 0, nf: 2, nd: -2, nom: 1, ps: -1987.0, pst: 0.0, pc: -6.0, ec: 1073.0, ect: 0.0, es: -2.0 },
  { nl: 1, nlp: 0, nf: 0, nd: 0, nom: 2, ps: -1981.0, pst: 0.0, pc: 0.0, ec: 854.0, ect: 0.0, es: 0.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 1, nom: 0, ps: 4026.0, pst: 0.0, pc: -353.0, ec: -553.0, ect: 0.0, es: -139.0 },
  { nl: 0, nlp: 0, nf: 2, nd: 1, nom: 2, ps: 1660.0, pst: 0.0, pc: -5.0, ec: -710.0, ect: 0.0, es: -2.0 },
  { nl: -1, nlp: 0, nf: 2, nd: 4, nom: 2, ps: -1521.0, pst: 0.0, pc: 9.0, ec: 647.0, ect: 0.0, es: 4.0 },
  { nl: -1, nlp: 1, nf: 0, nd: 1, nom: 1, ps: 1314.0, pst: 0.0, pc: 0.0, ec: -700.0, ect: 0.0, es: 0.0 },
  { nl: 0, nlp: -2, nf: 2, nd: -2, nom: 1, ps: -1283.0, pst: 0.0, pc: 0.0, ec: 672.0, ect: 0.0, es: 0.0 },
  { nl: 1, nlp: 0, nf: 2, nd: 2, nom: 1, ps: -1331.0, pst: 0.0, pc: 8.0, ec: 663.0, ect: 0.0, es: 4.0 },
  { nl: -2, nlp: 0, nf: 2, nd: 2, nom: 2, ps: 1383.0, pst: 0.0, pc: -2.0, ec: -594.0, ect: 0.0, es: -2.0 },
  { nl: -1, nlp: 0, nf: 0, nd: 0, nom: 2, ps: 1405.0, pst: 0.0, pc: 4.0, ec: -610.0, ect: 0.0, es: 2.0 },
  { nl: 1, nlp: 1, nf: 2, nd: -2, nom: 2, ps: 1290.0, pst: 0.0, pc: 0.0, ec: -556.0, ect: 0.0, es: 0.0 },
];

/**
 * JS usage:  const { dpsi, deps } = nut00b(date1, date2)
 *
 * Nutation, IAU 2000B model.
 *
 * This function is derived from the International Astronomical Union's
 * SOFA (Standards of Fundamental Astronomy) software collection
 *   (astroframe is a derived work, not endorsed by SOFA; see LICENSE-SOFA.txt).
 *
 * Status:  canonical model.
 *
 * Given:
 *    date1,date2   double    TT as a 2-part Julian Date (Note 1)
 *
 * Returned:
 *    dpsi,deps     double    nutation, luni-solar + planetary (Note 2)
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
 * 2) The nutation components in longitude and obliquity are in radians
 *    and with respect to the equinox and ecliptic of date.  The
 *    obliquity at J2000.0 is assumed to be the Lieske et al. (1977)
 *    value of 84381.448 arcsec.  (The errors that result from using
 *    this function with the IAU 2006 value of 84381.406 arcsec can be
 *    neglected.)
 *
 *    The nutation model consists only of luni-solar terms, but
 *    includes also a fixed offset which compensates for certain long-
 *    period planetary terms (Note 7).
 *
 * 3) This function is an implementation of the IAU 2000B abridged
 *    nutation model formally adopted by the IAU General Assembly in
 *    2000.  The function computes the MHB_2000_SHORT luni-solar
 *    nutation series (Luzum 2001), but without the associated
 *    corrections for the precession rate adjustments and the offset
 *    between the GCRS and J2000.0 mean poles.
 *
 * 4) The full IAU 2000A (MHB2000) nutation model contains nearly 1400
 *    terms.  The IAU 2000B model (McCarthy & Luzum 2003) contains only
 *    77 terms, plus additional simplifications, yet still delivers
 *    results of 1 mas accuracy at present epochs.  This combination of
 *    accuracy and size makes the IAU 2000B abridged nutation model
 *    suitable for most practical applications.
 *
 *    The function delivers a pole accurate to 1 mas from 1900 to 2100
 *    (usually better than 1 mas, very occasionally just outside
 *    1 mas).  The full IAU 2000A model, which is implemented in the
 *    function nut00a (q.v.), delivers considerably greater accuracy
 *    at current dates;  however, to realize this improved accuracy,
 *    corrections for the essentially unpredictable free-core-nutation
 *    (FCN) must also be included.
 *
 * 5) The present function provides classical nutation.  The
 *    MHB_2000_SHORT algorithm, from which it is adapted, deals also
 *    with (i) the offsets between the GCRS and mean poles and (ii) the
 *    adjustments in longitude and obliquity due to the changed
 *    precession rates.  These additional functions, namely frame bias
 *    and precession adjustments, are supported by the SOFA functions
 *    bi00  and pr00.
 *
 * 6) The MHB_2000_SHORT algorithm also provides "total" nutations,
 *    comprising the arithmetic sum of the frame bias, precession
 *    adjustments, and nutation (luni-solar + planetary).  These total
 *    nutations can be used in combination with an existing IAU 1976
 *    precession implementation, such as pmat76,  to deliver GCRS-
 *    to-true predictions of mas accuracy at current epochs.  However,
 *    for symmetry with the nut00a  function (q.v. for the reasons),
 *    the SOFA functions do not generate the "total nutations"
 *    directly.  Should they be required, they could of course easily
 *    be generated by calling bi00, pr00 and the present function
 *    and adding the results.
 *
 * 7) The IAU 2000B model includes "planetary bias" terms that are
 *    fixed in size but compensate for long-period nutations.  The
 *    amplitudes quoted in McCarthy & Luzum (2003), namely
 *    Dpsi = -1.5835 mas and Depsilon = +1.6339 mas, are optimized for
 *    the "total nutations" method described in Note 6.  The Luzum
 *    (2001) values used in this SOFA implementation, namely -0.135 mas
 *    and +0.388 mas, are optimized for the "rigorous" method, where
 *    frame bias, precession and nutation are applied separately and in
 *    that order.  During the interval 1995-2050, the SOFA
 *    implementation delivers a maximum error of 1.001 mas (not
 *    including FCN).
 *
 * References:
 *
 *    Lieske, J.H., Lederle, T., Fricke, W., Morando, B., "Expressions
 *    for the precession quantities based upon the IAU /1976/ system of
 *    astronomical constants", Astron.Astrophys. 58, 1-2, 1-16. (1977)
 *
 *    Luzum, B., private communication, 2001 (Fortran code
 *    MHB_2000_SHORT)
 *
 *    McCarthy, D.D. & Luzum, B.J., "An abridged model of the
 *    precession-nutation of the celestial pole", Cel.Mech.Dyn.Astron.
 *    85, 37-49 (2003)
 *
 *    Simon, J.-L., Bretagnon, P., Chapront, J., Chapront-Touze, M.,
 *    Francou, G., Laskar, J., Astron.Astrophys. 282, 663-683 (1994)
 *
 * This revision:  2021 May 11
 *
 * SOFA release 2023-10-11
 *
 * Copyright (C) 2023 IAU SOFA Board.  See notes at end.
 *
 */
export function nut00b(date1, date2) {
  let dpsi = 0;
  let deps = 0;
  let t;
  let el;
  let elp;
  let f;
  let d;
  let om;
  let arg;
  let dp;
  let de;
  let sarg;
  let carg;
  let dpsils;
  let depsls;
  let dpsipl;
  let depspl;
  let i;
  const NLS = Math.trunc((x.length * 1) / 1);
  t = (date1 - DJ00 + date2) / DJC;
  el = (485868.249036 + 1717915923.2178 * t) % TURNAS * DAS2R;
  elp = (1287104.79305 + 129596581.0481 * t) % TURNAS * DAS2R;
  f = (335779.526232 + 1739527262.8478 * t) % TURNAS * DAS2R;
  d = (1072260.70369 + 1602961601.2090 * t) % TURNAS * DAS2R;
  om = (450160.398036 + -6962890.5431 * t) % TURNAS * DAS2R;
  dp = 0.0;
  de = 0.0;
  for (i = NLS - 1; i >= 0; i--) {
    arg = (x[i].nl * el + x[i].nlp * elp + x[i].nf * f + x[i].nd * d + x[i].nom * om) % D2PI;
    sarg = Math.sin(arg);
    carg = Math.cos(arg);
    dp += (x[i].ps + x[i].pst * t) * sarg + x[i].pc * carg;
    de += (x[i].ec + x[i].ect * t) * carg + x[i].es * sarg;
  }
  dpsils = dp * U2R;
  depsls = de * U2R;
  dpsipl = DPPLAN;
  depspl = DEPLAN;
  dpsi = dpsils + dpsipl;
  deps = depsls + depspl;
  return { dpsi, deps };
}
