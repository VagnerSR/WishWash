// Low-precision solar/lunar position formulas (public-domain astronomical
// algorithms, accurate to within a few minutes for moonrise/moonset — plenty
// for a "should I go for a night walk" weather feature).
//
// Open-Meteo does not currently expose moon_phase / moonrise / moonset, so
// this module computes them locally instead of calling a second API.

const RAD = Math.PI / 180;
const DAY_MS = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;

function toJulian(date: Date): number {
  return date.getTime() / DAY_MS - 0.5 + J1970;
}

function toDays(date: Date): number {
  return toJulian(date) - J2000;
}

function hoursLater(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Obliquity of the ecliptic
const OBLIQUITY = RAD * 23.4397;

function rightAscension(l: number, b: number): number {
  return Math.atan2(
    Math.sin(l) * Math.cos(OBLIQUITY) - Math.tan(b) * Math.sin(OBLIQUITY),
    Math.cos(l)
  );
}

function declination(l: number, b: number): number {
  return Math.asin(
    Math.sin(b) * Math.cos(OBLIQUITY) + Math.cos(b) * Math.sin(OBLIQUITY) * Math.sin(l)
  );
}

function solarMeanAnomaly(d: number): number {
  return RAD * (357.5291 + 0.98560028 * d);
}

function eclipticLongitudeSun(m: number): number {
  const center = RAD * (1.9148 * Math.sin(m) + 0.02 * Math.sin(2 * m) + 0.0003 * Math.sin(3 * m));
  const perihelion = RAD * 102.9372;
  return m + center + perihelion + Math.PI;
}

interface EquatorialCoords {
  ra: number;
  dec: number;
}

function sunCoords(d: number): EquatorialCoords {
  const m = solarMeanAnomaly(d);
  const l = eclipticLongitudeSun(m);
  return { ra: rightAscension(l, 0), dec: declination(l, 0) };
}

interface MoonCoords extends EquatorialCoords {
  dist: number;
}

function moonCoords(d: number): MoonCoords {
  const eclipticLongitude = RAD * (218.316 + 13.176396 * d);
  const meanAnomaly = RAD * (134.963 + 13.064993 * d);
  const meanDistance = RAD * (93.272 + 13.22935 * d);

  const l = eclipticLongitude + RAD * 6.289 * Math.sin(meanAnomaly);
  const b = RAD * 5.128 * Math.sin(meanDistance);
  const dist = 385001 - 20905 * Math.cos(meanAnomaly);

  return { ra: rightAscension(l, b), dec: declination(l, b), dist };
}

function siderealTime(d: number, lw: number): number {
  return RAD * (280.16 + 360.9856235 * d) - lw;
}

function moonAltitudeRad(date: Date, latDeg: number, lonDeg: number): number {
  const lw = RAD * -lonDeg;
  const phi = RAD * latDeg;
  const d = toDays(date);
  const c = moonCoords(d);
  const h = siderealTime(d, lw) - c.ra;
  return Math.asin(Math.sin(phi) * Math.sin(c.dec) + Math.cos(phi) * Math.cos(c.dec) * Math.cos(h));
}

export interface MoonIllumination {
  /** 0 (new) to 1 (full): fraction of the visible disc that is lit. */
  fraction: number;
  /** 0..1 cycle position: 0/1 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
  phase: number;
}

export function getMoonIllumination(date: Date): MoonIllumination {
  const d = toDays(date);
  const s = sunCoords(d);
  const m = moonCoords(d);

  const sunDistanceKm = 149598000;

  const phi = Math.acos(
    Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra)
  );
  const inclination = Math.atan2(sunDistanceKm * Math.sin(phi), m.dist - sunDistanceKm * Math.cos(phi));
  const angle = Math.atan2(
    Math.cos(s.dec) * Math.sin(s.ra - m.ra),
    Math.sin(s.dec) * Math.cos(m.dec) - Math.cos(s.dec) * Math.sin(m.dec) * Math.cos(s.ra - m.ra)
  );

  const fraction = (1 + Math.cos(inclination)) / 2;
  const phase = 0.5 + (0.5 * inclination * (angle < 0 ? -1 : 1)) / Math.PI;

  return { fraction, phase };
}

export interface MoonRiseSetResult {
  rise?: Date;
  set?: Date;
  alwaysUp?: boolean;
  alwaysDown?: boolean;
}

/**
 * Finds the first moonrise and first moonset within `durationHours` of
 * `start`, using the classic 2-hour quadratic-fit horizon-crossing search.
 * `start` and the returned dates are real UTC instants — timezone handling
 * happens entirely outside this function.
 */
export function findMoonRiseSet(start: Date, durationHours: number, lat: number, lon: number): MoonRiseSetResult {
  // Standard correction for atmospheric refraction + moon parallax + semi-diameter.
  const horizonCorrection = 0.133 * RAD;

  let h0 = moonAltitudeRad(start, lat, lon) - horizonCorrection;
  let rise: number | undefined;
  let set: number | undefined;
  let ye = 0;

  for (let i = 1; i <= durationHours; i += 2) {
    const h1 = moonAltitudeRad(hoursLater(start, i), lat, lon) - horizonCorrection;
    const h2 = moonAltitudeRad(hoursLater(start, i + 1), lat, lon) - horizonCorrection;

    const a = (h0 + h2) / 2 - h1;
    const b = (h2 - h0) / 2;
    const xe = -b / (2 * a);
    const yeLocal = (a * xe + b) * xe + h1;
    const d = b * b - 4 * a * h1;

    let roots = 0;
    let x1 = 0;
    let x2 = 0;

    if (d >= 0) {
      const dx = Math.sqrt(d) / (Math.abs(a) * 2);
      x1 = xe - dx;
      x2 = xe + dx;
      if (Math.abs(x1) <= 1) roots++;
      if (Math.abs(x2) <= 1) roots++;
      if (x1 < -1) x1 = x2;
    }

    if (roots === 1) {
      if (h0 < 0) rise = i + x1;
      else set = i + x1;
    } else if (roots === 2) {
      rise = i + (yeLocal < 0 ? x2 : x1);
      set = i + (yeLocal < 0 ? x1 : x2);
    }

    ye = yeLocal;
    if (rise !== undefined && set !== undefined) break;
    h0 = h2;
  }

  const result: MoonRiseSetResult = {};
  if (rise !== undefined) result.rise = hoursLater(start, rise);
  if (set !== undefined) result.set = hoursLater(start, set);
  if (rise === undefined && set === undefined) {
    if (ye > 0) result.alwaysUp = true;
    else result.alwaysDown = true;
  }
  return result;
}

export function isMoonUp(date: Date, lat: number, lon: number): boolean {
  return moonAltitudeRad(date, lat, lon) > 0;
}
