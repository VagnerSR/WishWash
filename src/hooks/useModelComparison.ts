import { useEffect, useState } from "react";
import type { Place } from "../types/weather";

export type ModelId = "ecmwf_ifs" | "ncep_gfs_seamless" | "dwd_icon_seamless";

export interface ModelDayReading {
  model: ModelId;
  date: string;
  weatherCode: number;
  precipProbabilityMax: number;
  precipitationSum: number;
  precipitationHours: number;
  hourlyPrecipProbability: number[];
  hourlyPrecipitation: number[];
  hourlyRain: number[];
  hourlyShowers: number[];
  hourlyLocalHour: number[];
}

const MODELS: ModelId[] = ["ecmwf_ifs", "ncep_gfs_seamless", "dwd_icon_seamless"];

interface RawTable {
  time: string[];
  [key: string]: string[] | number[];
}

interface RawResponse {
  daily: RawTable;
  hourly: RawTable;
}

function readNumberArray(table: RawTable, key: string): number[] | null {
  const value = table[key];
  return Array.isArray(value) && value.every((v) => typeof v === "number") ? (value as number[]) : null;
}

function tomorrowHourIndices(hourlyTime: string[], tomorrowDate: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < hourlyTime.length; i++) {
    if (hourlyTime[i].slice(0, 10) === tomorrowDate) indices.push(i);
  }
  return indices;
}

function buildModelReading(
  model: ModelId,
  daily: RawTable,
  hourly: RawTable,
  tomorrowDate: string,
  tomorrowIndices: number[]
): ModelDayReading | null {
  const weatherCodeArr = readNumberArray(daily, `weather_code_${model}`);
  const precipProbMaxArr = readNumberArray(daily, `precipitation_probability_max_${model}`);
  const precipSumArr = readNumberArray(daily, `precipitation_sum_${model}`);
  const precipHoursArr = readNumberArray(daily, `precipitation_hours_${model}`);

  if (!weatherCodeArr || !precipProbMaxArr || !precipSumArr || !precipHoursArr) return null;
  if (
    weatherCodeArr.length < 2 ||
    precipProbMaxArr.length < 2 ||
    precipSumArr.length < 2 ||
    precipHoursArr.length < 2
  ) {
    return null;
  }

  const hourlyProbArr = readNumberArray(hourly, `precipitation_probability_${model}`);
  const hourlyPrecipArr = readNumberArray(hourly, `precipitation_${model}`);
  const hourlyRainArr = readNumberArray(hourly, `rain_${model}`);
  const hourlyShowersArr = readNumberArray(hourly, `showers_${model}`);

  if (!hourlyProbArr || !hourlyPrecipArr || !hourlyRainArr || !hourlyShowersArr) return null;
  if (tomorrowIndices.length === 0) return null;

  const maxIndex = Math.max(...tomorrowIndices);
  const longEnough =
    hourlyProbArr.length > maxIndex &&
    hourlyPrecipArr.length > maxIndex &&
    hourlyRainArr.length > maxIndex &&
    hourlyShowersArr.length > maxIndex &&
    hourly.time.length > maxIndex;
  if (!longEnough) return null;

  return {
    model,
    date: tomorrowDate,
    weatherCode: weatherCodeArr[1],
    precipProbabilityMax: precipProbMaxArr[1],
    precipitationSum: precipSumArr[1],
    precipitationHours: precipHoursArr[1],
    hourlyPrecipProbability: tomorrowIndices.map((i) => hourlyProbArr[i]),
    hourlyPrecipitation: tomorrowIndices.map((i) => hourlyPrecipArr[i]),
    hourlyRain: tomorrowIndices.map((i) => hourlyRainArr[i]),
    hourlyShowers: tomorrowIndices.map((i) => hourlyShowersArr[i]),
    hourlyLocalHour: tomorrowIndices.map((i) => Number(hourly.time[i].slice(11, 13))),
  };
}

export function useModelComparison(place: Place | null) {
  const [readings, setReadings] = useState<ModelDayReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setLoading(true);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&daily=weather_code,precipitation_probability_max,precipitation_sum,precipitation_hours` +
      `&hourly=precipitation_probability,precipitation,rain,showers` +
      `&models=${MODELS.join(",")}` +
      `&timezone=auto&forecast_days=2`;

    fetch(url)
      .then((res) => (res.ok ? (res.json() as Promise<RawResponse>) : null))
      .then((json) => {
        if (cancelled || !json?.daily || !json?.hourly) return;

        const tomorrowDate = json.daily.time[1];
        if (!tomorrowDate) {
          setReadings([]);
          return;
        }

        const tomorrowIndices = tomorrowHourIndices(json.hourly.time, tomorrowDate);

        const next: ModelDayReading[] = [];
        for (const model of MODELS) {
          const reading = buildModelReading(model, json.daily, json.hourly, tomorrowDate, tomorrowIndices);
          if (reading) next.push(reading);
        }
        setReadings(next);
      })
      .catch(() => {
        if (!cancelled) setReadings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [place]);

  return { readings, loading };
}
