import type { WeatherIconSlug } from "./weatherIconSlug";

export interface CodeInfo {
  label: string;
  icon: WeatherIconSlug;
  bad: boolean;
}

const TABLE: Record<number, CodeInfo> = {
  0: { label: "Clear sky", icon: "clear-day", bad: false },
  1: { label: "Mostly clear", icon: "partly-cloudy-day", bad: false },
  2: { label: "Partly cloudy", icon: "partly-cloudy-day", bad: false },
  3: { label: "Overcast", icon: "overcast-day", bad: false },
  45: { label: "Foggy", icon: "fog-day", bad: true },
  48: { label: "Foggy", icon: "fog-day", bad: true },
  51: { label: "Light drizzle", icon: "drizzle", bad: true },
  53: { label: "Drizzle", icon: "drizzle", bad: true },
  55: { label: "Heavy drizzle", icon: "drizzle", bad: true },
  56: { label: "Freezing drizzle", icon: "drizzle", bad: true },
  57: { label: "Freezing drizzle", icon: "drizzle", bad: true },
  61: { label: "Light rain", icon: "rain", bad: true },
  63: { label: "Rain", icon: "rain", bad: true },
  65: { label: "Heavy rain", icon: "overcast-day-rain", bad: true },
  66: { label: "Freezing rain", icon: "rain", bad: true },
  67: { label: "Freezing rain", icon: "rain", bad: true },
  71: { label: "Light snow", icon: "snow", bad: true },
  73: { label: "Snow", icon: "snow", bad: true },
  75: { label: "Heavy snow", icon: "snow", bad: true },
  77: { label: "Snow grains", icon: "snow", bad: true },
  80: { label: "Rain showers", icon: "partly-cloudy-day-rain", bad: true },
  81: { label: "Rain showers", icon: "partly-cloudy-day-rain", bad: true },
  82: { label: "Violent showers", icon: "overcast-day-rain", bad: true },
  85: { label: "Snow showers", icon: "partly-cloudy-day-snow", bad: true },
  86: { label: "Snow showers", icon: "partly-cloudy-day-snow", bad: true },
  95: { label: "Thunderstorm", icon: "thunderstorms-day-rain", bad: true },
  96: { label: "Thunderstorm", icon: "thunderstorms-day-rain", bad: true },
  99: { label: "Thunderstorm", icon: "thunderstorms-day-rain", bad: true },
};

export function codeInfo(code: number): CodeInfo {
  return TABLE[code] ?? { label: "Unknown", icon: "overcast-day", bad: false };
}
