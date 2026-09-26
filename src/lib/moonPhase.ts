import type { ForecastResponse, MoonInfo, MoonPhaseName, MoonVisibility, Place } from "../types/weather";
import { findMoonRiseSet, getMoonIllumination, isMoonUp } from "./moonAstronomy";
import { addDays, computeNightSummary } from "./moonNight";

/**
 * Buckets a 0..1 phase cycle value into one of the 8 conventional phase
 * names. Boundaries are centered on the 8 key phase points (0, 1/8, 2/8, ...)
 * so each bucket is 1/8 (0.125) wide.
 */
export function phaseNameFromCycle(phase: number): MoonPhaseName {
  const p = ((phase % 1) + 1) % 1; // normalize into [0, 1)
  if (p < 0.0625 || p >= 0.9375) return "newMoon";
  if (p < 0.1875) return "waxingCrescent";
  if (p < 0.3125) return "firstQuarter";
  if (p < 0.4375) return "waxingGibbous";
  if (p < 0.5625) return "fullMoon";
  if (p < 0.6875) return "waningGibbous";
  if (p < 0.8125) return "lastQuarter";
  return "waningCrescent";
}

/** Converts a real UTC instant into a naive "YYYY-MM-DDTHH:mm" local string for the given offset. */
function toLocalNaiveIso(date: Date, utcOffsetSeconds: number): string {
  const shifted = new Date(date.getTime() + utcOffsetSeconds * 1000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const d = String(shifted.getUTCDate()).padStart(2, "0");
  const h = String(shifted.getUTCHours()).padStart(2, "0");
  const min = String(shifted.getUTCMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

/** Converts a "YYYY-MM-DD" local date string into the UTC instant of local midnight for that date. */
function localMidnightUtc(dateStr: string, utcOffsetSeconds: number): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - utcOffsetSeconds * 1000);
}

function computeMoonVisibility(todayDateStr: string, lat: number, lon: number, utcOffsetSeconds: number): MoonVisibility {
  const windowStart = localMidnightUtc(todayDateStr, utcOffsetSeconds); // today 00:00 local
  const eveningStart = new Date(windowStart.getTime() + 18 * 60 * 60 * 1000); // today 18:00 local
  const windowEndHours = 30; // through 06:00 the next local day

  const result = findMoonRiseSet(windowStart, windowEndHours, lat, lon);
  const moonriseLocalIso = result.rise ? toLocalNaiveIso(result.rise, utcOffsetSeconds) : null;
  const moonsetLocalIso = result.set ? toLocalNaiveIso(result.set, utcOffsetSeconds) : null;

  if (result.alwaysUp) {
    return { status: "alwaysUp", moonriseLocalIso, moonsetLocalIso };
  }
  if (result.alwaysDown) {
    return { status: "alwaysDown", moonriseLocalIso, moonsetLocalIso };
  }

  const upAtEveningStart = isMoonUp(eveningStart, lat, lon);
  if (upAtEveningStart) {
    return { status: "upNow", moonriseLocalIso, moonsetLocalIso };
  }

  if (result.rise) {
    const riseOffsetHours = (result.rise.getTime() - windowStart.getTime()) / (60 * 60 * 1000);
    if (riseOffsetHours >= 18 && riseOffsetHours <= windowEndHours) {
      return { status: "risesLater", moonriseLocalIso, moonsetLocalIso: null };
    }
  }

  return { status: "belowHorizon", moonriseLocalIso: null, moonsetLocalIso: null };
}

/**
 * Builds the full Moon card data set from a Place and the forecast response
 * the app already fetched. Returns null if required inputs are missing so
 * the card can fail gracefully without affecting the rest of the app.
 */
export function buildMoonInfo(place: Place | null, forecast: ForecastResponse | null): MoonInfo | null {
  if (!place || !forecast) return null;
  if (!forecast.daily?.time?.length) return null;

  const todayDateStr = forecast.daily.time[0];
  const utcOffsetSeconds = forecast.utc_offset_seconds ?? 0;

  let illumination;
  try {
    illumination = getMoonIllumination(new Date());
  } catch {
    return null;
  }

  const phaseName = phaseNameFromCycle(illumination.phase);
  const illuminationPercent = Math.round(illumination.fraction * 100);

  let visibility: MoonVisibility;
  try {
    visibility = computeMoonVisibility(todayDateStr, place.lat, place.lon, utcOffsetSeconds);
  } catch {
    visibility = { status: "unknown", moonriseLocalIso: null, moonsetLocalIso: null };
  }

  let night = null;
  try {
    night = forecast.hourly ? computeNightSummary(forecast.hourly, todayDateStr) : null;
  } catch {
    night = null;
  }

  return { phaseName, phaseFraction: illumination.phase, illuminationPercent, visibility, night };
}

export { addDays };
