import { useEffect, useState } from "react";
import type { ForecastResponse, Place } from "../types/weather";

interface ForecastState {
  data: ForecastResponse | null;
  loading: boolean;
  error: string | null;
}

export function useForecast(place: Place | null): ForecastState {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,cloud_cover` +
      `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,precipitation,cloud_cover` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max,sunshine_duration,daylight_duration,sunrise,sunset` +
      `&timezone=auto&forecast_days=6`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Weather service did not respond");
        return res.json() as Promise<ForecastResponse>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Couldn't load the forecast");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [place]);

  return { data, loading, error };
}
