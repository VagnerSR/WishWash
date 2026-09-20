export interface Place {
  name: string;
  admin?: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface GeocodeResult {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  cloud_cover: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  cloud_cover: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
  sunshine_duration: number[];
  daylight_duration: number[];
  sunrise: string[];
  sunset: string[];
}

export interface ForecastResponse {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface DayForecast {
  date: string;
  weatherCode: number;
  tMax: number;
  tMin: number;
  precipMax: number;
  uvMax: number;
  windMax: number;
  sunrise: string;
  sunset: string;
  sunshineRatio: number;
}

export type VerdictLevel = "great" | "ok" | "bad" | "careful";
export type VerdictKind = "greatDrying" | "goodTwoDays" | "careful" | "keepInside" | "okTomorrow";

export interface Verdict {
  level: VerdictLevel;
  kind: VerdictKind;
}

export type TempUnit = "c" | "f";

export type WashLevel = "great" | "good" | "goodWithRainWarning" | "goodButSlow" | "borderline" | "bad";

export type WashReasonKind =
  | "excellent"
  | "good"
  | "goodRainWarning"
  | "goodButSlowQuality"
  | "goodButSlowRain"
  | "goodButSlowBoth"
  | "borderline"
  | "bad";

export interface RainWarning {
  startHour: number;
  endHour: number;
}

export type DayAfterNoteKind = "goodTwoDays" | "rainWarning";

export interface WashRecommendation {
  level: WashLevel;
  reasonKind: WashReasonKind;

  laundryScore: number;
  rainSafety: number;
  dryingOpportunity: number;
  dryingQuality: number;

  tomorrowOpportunity: number;
  dayAfterOpportunity: number;
  twoDayDryingOpportunity: number;

  longestDryWindowTomorrow: number;
  longestDryWindowDayAfter: number;

  rainWarning: RainWarning | null;
  dryingLikelyTakesTwoDays: boolean;

  dayAfterNote: DayAfterNoteKind | null;
  dayAfterRainWarning: RainWarning | null;
}
