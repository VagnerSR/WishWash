import { useEffect, useState } from "react";
import type { Place } from "../types/weather";

export type ModelId = "ecmwf_ifs" | "ncep_gfs_seamless" | "dwd_icon_seamless";

export interface ModelDayReading {
  model: ModelId;
  weatherCode: number;
  precipMax: number;
}

interface RawDaily {
  time: string[];
  [key: string]: string[] | number[];
}

interface RawResponse {
  daily: RawDaily;
}

const MODELS: ModelId[] = ["ecmwf_ifs", "ncep_gfs_seamless", "dwd_icon_seamless"];

export function useModelComparison(place: Place | null) {
  const [readings, setReadings] = useState<ModelDayReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setLoading(true);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&daily=weather_code,precipitation_probability_max` +
      `&models=${MODELS.join(",")}` +
      `&timezone=auto&forecast_days=2`;

    fetch(url)
      .then((res) => (res.ok ? (res.json() as Promise<RawResponse>) : null))
      .then((json) => {
        if (cancelled || !json?.daily) return;
        const next: ModelDayReading[] = [];
        for (const model of MODELS) {
          const codeArr = json.daily[`weather_code_${model}`] as number[] | undefined;
          const precipArr = json.daily[`precipitation_probability_max_${model}`] as number[] | undefined;
          if (codeArr && precipArr && codeArr.length > 1 && precipArr.length > 1) {
            next.push({ model, weatherCode: codeArr[1], precipMax: precipArr[1] });
          }
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
