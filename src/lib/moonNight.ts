import type { HourlyWeather, NightRainLevel, NightSkyLevel, NightWeatherSummary } from "../types/weather";

/** Adds `days` calendar days to a "YYYY-MM-DD" date string (date-only, no timezone ambiguity). */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Summarizes the night period — 18:00 today through 06:00 tomorrow, local time
 * — from the same hourly forecast array the rest of the app already fetched.
 * Follows the app's existing convention of comparing the naive local time
 * strings Open-Meteo returns (via timezone=auto) rather than Date/UTC math.
 */
export function computeNightSummary(hourly: HourlyWeather, todayDateStr: string): NightWeatherSummary | null {
  const tomorrowDateStr = addDays(todayDateStr, 1);
  const indices: number[] = [];

  for (let i = 0; i < hourly.time.length; i++) {
    const dateStr = hourly.time[i].slice(0, 10);
    const hour = Number(hourly.time[i].slice(11, 13));
    const inEvening = dateStr === todayDateStr && hour >= 18;
    const inEarlyMorning = dateStr === tomorrowDateStr && hour <= 6;
    if (inEvening || inEarlyMorning) indices.push(i);
  }

  if (indices.length === 0) return null;

  const maxIndex = Math.max(...indices);
  const hasArrays =
    hourly.precipitation_probability.length > maxIndex &&
    hourly.precipitation.length > maxIndex &&
    hourly.cloud_cover.length > maxIndex;
  if (!hasArrays) return null;

  let maxProb = -Infinity;
  let probCount = 0;
  let totalPrecip = 0;
  let precipCount = 0;
  let cloudSum = 0;
  let cloudCount = 0;

  for (const i of indices) {
    const prob = hourly.precipitation_probability[i];
    const precip = hourly.precipitation[i];
    const cloud = hourly.cloud_cover[i];

    if (typeof prob === "number" && !Number.isNaN(prob)) {
      maxProb = Math.max(maxProb, prob);
      probCount++;
    }
    if (typeof precip === "number" && !Number.isNaN(precip)) {
      totalPrecip += precip;
      precipCount++;
    }
    if (typeof cloud === "number" && !Number.isNaN(cloud)) {
      cloudSum += cloud;
      cloudCount++;
    }
  }

  const maxPrecipProbability = probCount > 0 ? maxProb : null;
  const avgCloudCover = cloudCount > 0 ? cloudSum / cloudCount : null;
  // A tenth of a millimetre across the whole night is the threshold for
  // "measurable" precipitation rather than model noise.
  const hasMeasurablePrecip = precipCount > 0 && totalPrecip > 0.1;

  let rainLevel: NightRainLevel;
  if (maxPrecipProbability === null) {
    rainLevel = hasMeasurablePrecip ? "possible" : "none";
  } else if (maxPrecipProbability >= 60 || (hasMeasurablePrecip && maxPrecipProbability >= 40)) {
    rainLevel = "expected";
  } else if (maxPrecipProbability >= 30) {
    rainLevel = "possible";
  } else if (maxPrecipProbability >= 10) {
    rainLevel = "low";
  } else {
    rainLevel = "none";
  }

  let skyLevel: NightSkyLevel;
  if (avgCloudCover === null) {
    skyLevel = "clear";
  } else if (avgCloudCover >= 80) {
    skyLevel = "cloudy";
  } else if (avgCloudCover >= 50) {
    skyLevel = "partlyCloudy";
  } else if (avgCloudCover >= 20) {
    skyLevel = "mostlyClear";
  } else {
    skyLevel = "clear";
  }

  return { maxPrecipProbability, hasMeasurablePrecip, avgCloudCover, rainLevel, skyLevel };
}
