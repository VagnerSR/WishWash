import type { DayForecast, SkyCondition } from "../types/weather";

type SkyConditionInput = Pick<DayForecast, "weatherCode" | "precipMax" | "sunshineRatio">;

// WMO weather codes (Open-Meteo's `weather_code`) grouped by what they mean
// for this classification. https://open-meteo.com/en/docs (WMO Weather code)
const RAIN_OR_DRIZZLE_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67]);
const SHOWER_CODES = new Set([80, 81, 82, 85, 86]);

function isThunderstormCode(weatherCode: number): boolean {
  return weatherCode >= 95 && weatherCode <= 99;
}

/**
 * Classifies a day's sky/precipitation outlook into one of 7 categories for
 * display in the day strip. This is a purely descriptive weather label and
 * is intentionally independent of the laundry-drying verdict (see
 * washVerdict.ts) — a cloudy day can still be great for drying, and a sunny
 * day can still have a short unfavorable window.
 */
export function classifySkyCondition({ weatherCode, precipMax, sunshineRatio }: SkyConditionInput): SkyCondition {
  // Thunderstorms always win, regardless of anything else.
  if (isThunderstormCode(weatherCode)) {
    return "thunderstorms";
  }

  if (precipMax >= 60 || RAIN_OR_DRIZZLE_CODES.has(weatherCode)) {
    return "rainLikely";
  }

  if ((precipMax >= 35 && precipMax < 60) || SHOWER_CODES.has(weatherCode)) {
    return "showersPossible";
  }

  if (precipMax < 15 && sunshineRatio >= 0.65 && weatherCode === 0) {
    return "sunny";
  }

  if (precipMax < 20 && sunshineRatio >= 0.45 && weatherCode <= 1) {
    return "mostlyClear";
  }

  if (precipMax < 30 && sunshineRatio >= 0.25 && weatherCode === 2) {
    return "partlyCloudy";
  }

  if (precipMax < 35 && sunshineRatio < 0.25 && weatherCode === 3) {
    return "cloudy";
  }

  // None of the specific rules matched exactly (e.g. a weather code/precip/
  // sunshine combination that falls between bands) — fall back to a sensible
  // bucket from the weather code alone so every day always gets a label.
  if (weatherCode <= 1) return "mostlyClear";
  if (weatherCode === 2) return "partlyCloudy";
  return "cloudy";
}
