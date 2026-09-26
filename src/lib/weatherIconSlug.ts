import type { MoonPhaseName } from "../types/weather";

export type WeatherIconSlug =
  | "clear-day"
  | "partly-cloudy-day"
  | "overcast-day"
  | "overcast-night"
  | "fog-day"
  | "drizzle"
  | "rain"
  | "overcast-day-rain"
  | "snow"
  | "partly-cloudy-day-snow"
  | "partly-cloudy-day-rain"
  | "thunderstorms-day-rain"
  | "thermometer"
  | "wind"
  | "sunrise"
  | "sunset"
  | "moonrise"
  | "moonset"
  | "moon-new"
  | "moon-waxing-crescent"
  | "moon-first-quarter"
  | "moon-waxing-gibbous"
  | "moon-full"
  | "moon-waning-gibbous"
  | "moon-last-quarter"
  | "moon-waning-crescent"
  | "not-available";

const MOON_PHASE_ICON: Record<MoonPhaseName, WeatherIconSlug> = {
  newMoon: "moon-new",
  waxingCrescent: "moon-waxing-crescent",
  firstQuarter: "moon-first-quarter",
  waxingGibbous: "moon-waxing-gibbous",
  fullMoon: "moon-full",
  waningGibbous: "moon-waning-gibbous",
  lastQuarter: "moon-last-quarter",
  waningCrescent: "moon-waning-crescent",
};

export function moonPhaseIconSlug(phaseName: MoonPhaseName): WeatherIconSlug {
  return MOON_PHASE_ICON[phaseName];
}
