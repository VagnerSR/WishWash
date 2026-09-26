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
  // Open-Meteo always includes these alongside timezone=auto; not requested
  // explicitly, just read off the response when present.
  utc_offset_seconds?: number;
  timezone?: string;
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

// Purely descriptive "what will the sky look like" classification for the
// day strip. Intentionally independent from the laundry verdict below — a
// cloudy day can still be a great drying day, and vice versa.
export type SkyCondition =
  | "sunny"
  | "mostlyClear"
  | "partlyCloudy"
  | "cloudy"
  | "showersPossible"
  | "rainLikely"
  | "thunderstorms";

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

export type MoonPhaseName =
  | "newMoon"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "fullMoon"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

export type NightRainLevel = "none" | "low" | "possible" | "expected";
export type NightSkyLevel = "clear" | "mostlyClear" | "partlyCloudy" | "cloudy";

export interface NightWeatherSummary {
  maxPrecipProbability: number | null;
  hasMeasurablePrecip: boolean;
  avgCloudCover: number | null;
  rainLevel: NightRainLevel;
  skyLevel: NightSkyLevel;
}

export type MoonVisibilityStatus =
  | "upNow"
  | "risesLater"
  | "belowHorizon"
  | "alwaysUp"
  | "alwaysDown"
  | "unknown";

export interface MoonVisibility {
  status: MoonVisibilityStatus;
  moonriseLocalIso: string | null;
  moonsetLocalIso: string | null;
}

export interface MoonInfo {
  phaseName: MoonPhaseName;
  /** Continuous 0..1 cycle position (0/1 = new, 0.5 = full) for smooth icon rendering. */
  phaseFraction: number;
  illuminationPercent: number;
  visibility: MoonVisibility;
  night: NightWeatherSummary | null;
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
