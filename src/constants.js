// astroframe: derived from the IAU SOFA C library (release 2023-10-11), file sofam.h. Not software provided
// by and/or endorsed by SOFA; see README.md and LICENSE-SOFA.txt (SOFA Software License, Part 1).
// Constants from sofam.h (SOFA release 2023-10-11).

/** Pi */
export const DPI = 3.141592653589793238462643;
/** 2Pi */
export const D2PI = 6.283185307179586476925287;
/** Radians to degrees */
export const DR2D = 57.29577951308232087679815;
/** Degrees to radians */
export const DD2R = 1.745329251994329576923691e-2;
/** Radians to arcseconds */
export const DR2AS = 206264.8062470963551564734;
/** Arcseconds to radians */
export const DAS2R = 4.848136811095359935899141e-6;
/** Seconds of time to radians */
export const DS2R = 7.272205216643039903848712e-5;
/** Arcseconds in a full circle */
export const TURNAS = 1296000.0;
/** Milliarcseconds to radians */
export const DMAS2R = DAS2R / 1e3;
/** Length of tropical year B1900 (days) */
export const DTY = 365.242198781;
/** Seconds per day */
export const DAYSEC = 86400.0;
/** Days per Julian year */
export const DJY = 365.25;
/** Days per Julian century */
export const DJC = 36525.0;
/** Days per Julian millennium */
export const DJM = 365250.0;
/** Reference epoch (J2000.0), Julian Date */
export const DJ00 = 2451545.0;
/** Julian Date of Modified Julian Date zero */
export const DJM0 = 2400000.5;
/** Reference epoch (J2000.0), Modified Julian Date */
export const DJM00 = 51544.5;
/** 1977 Jan 1.0 as MJD */
export const DJM77 = 43144.0;
/** TT minus TAI (s) */
export const TTMTAI = 32.184;
/** Astronomical unit (m, IAU 2012) */
export const DAU = 149597870.7e3;
/** Speed of light (m/s) */
export const CMPS = 299792458.0;
/** Light time for 1 au (s) */
export const AULT = DAU / CMPS;
/** Speed of light (au per day) */
export const DC = DAYSEC / AULT;
/** L_G = 1 - d(TT)/d(TCG) */
export const ELG = 6.969290134e-10;
/** L_B = 1 - d(TDB)/d(TCB) */
export const ELB = 1.550519768e-8;
/** TDB (s) at TAI 1977/1/1.0 */
export const TDB0 = -6.55e-5;
/** Schwarzschild radius of the Sun (au) */
export const SRS = 1.97412574336e-8;
/** Reference ellipsoids (for eform / gc2gd / gd2gc) */
export const WGS84 = 1;
export const GRS80 = 2;
export const WGS72 = 3;
