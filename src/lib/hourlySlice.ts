import type { HourlyWeather } from "../types/weather";

export interface DayHourlySlice {
  date: string;
  hours: number[];
  temperature: number[];
  humidity: number[];
  windSpeed: number[];
  precipProbability: number[];
  precipitation: number[];
  cloudCover: number[];
}

export function extractDaySlice(hourly: HourlyWeather, dateStr: string): DayHourlySlice | null {
  const indices: number[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i].slice(0, 10) === dateStr) indices.push(i);
  }
  if (indices.length === 0) return null;

  const maxIndex = Math.max(...indices);
  const longEnough =
    hourly.temperature_2m.length > maxIndex &&
    hourly.relative_humidity_2m.length > maxIndex &&
    hourly.wind_speed_10m.length > maxIndex &&
    hourly.precipitation_probability.length > maxIndex &&
    hourly.precipitation.length > maxIndex &&
    hourly.cloud_cover.length > maxIndex;
  if (!longEnough) return null;

  return {
    date: dateStr,
    hours: indices.map((i) => Number(hourly.time[i].slice(11, 13))),
    temperature: indices.map((i) => hourly.temperature_2m[i]),
    humidity: indices.map((i) => hourly.relative_humidity_2m[i]),
    windSpeed: indices.map((i) => hourly.wind_speed_10m[i]),
    precipProbability: indices.map((i) => hourly.precipitation_probability[i]),
    precipitation: indices.map((i) => hourly.precipitation[i]),
    cloudCover: indices.map((i) => hourly.cloud_cover[i]),
  };
}
