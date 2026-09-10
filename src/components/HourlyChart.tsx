import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { THEME } from "../lib/theme";
import { fmtHour, cToF, tempUnitLabel } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { HourlyWeather, TempUnit } from "../types/weather";

interface HourlyChartProps {
  hourly: HourlyWeather;
  dayIndex: number;
  dayLabel: string;
  unit: TempUnit;
}

interface HourPoint {
  time: string;
  temp: number;
  rain: number;
}

export function HourlyChart({ hourly, dayIndex, dayLabel, unit }: HourlyChartProps) {
  const { t, localeTag } = useI18n();

  const start = dayIndex * 24;
  const end = start + 24;
  const times = hourly.time.slice(start, end);
  const temps = hourly.temperature_2m.slice(start, end);
  const rains = hourly.precipitation_probability.slice(start, end);

  const points: HourPoint[] = times.map((time, i) => ({
    time: fmtHour(time, localeTag),
    temp: Math.round(unit === "f" ? cToF(temps[i]) : temps[i]),
    rain: rains[i],
  }));

  return (
    <section>
      <p style={{ color: THEME.inkSoft }} className="text-sm mb-4">
        {t.hourlyHeadingPrefix} {dayLabel} — {t.hourlyMetrics}
      </p>
      <div
        style={{ background: THEME.card, borderColor: THEME.line }}
        className="rounded-2xl border p-4 md:p-6"
      >
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={points} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={THEME.line} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: THEME.inkSoft }}
              axisLine={{ stroke: THEME.line }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="temp"
              tick={{ fontSize: 11, fill: THEME.inkSoft }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <YAxis yAxisId="rain" orientation="right" hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: THEME.paper,
                border: `1px solid ${THEME.line}`,
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Bar
              yAxisId="rain"
              dataKey="rain"
              fill={THEME.denim}
              opacity={0.18}
              radius={[3, 3, 0, 0]}
              name={t.rainLegend}
            />
            <Line
              yAxisId="temp"
              dataKey="temp"
              stroke={THEME.rust}
              strokeWidth={2}
              dot={false}
              name={`${t.tempLegend} ${tempUnitLabel(unit)}`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
