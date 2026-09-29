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
import { useTheme } from "../theme/ThemeContext";
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
  const { THEME, isPixel, shadow, font } = useTheme();

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
      <p style={{ color: THEME.inkSoft, fontFamily: isPixel ? font.display : undefined }} className={isPixel ? "text-xs uppercase mb-4" : "text-sm mb-4"}>
        {t.hourlyHeadingPrefix} {dayLabel} — {t.hourlyMetrics}
      </p>
      <div
        style={{ background: THEME.card, borderColor: THEME.edge, boxShadow: shadow(4) }}
        className={isPixel ? "border-4 p-4 md:p-6" : "rounded-2xl border p-4 md:p-6"}
      >
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={points} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={THEME.line} strokeDasharray={isPixel ? "4 4" : undefined} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: isPixel ? 13 : 11, fill: THEME.inkSoft, fontFamily: isPixel ? font.body : undefined }}
              axisLine={{ stroke: THEME.edge, strokeWidth: isPixel ? 2 : 1 }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="temp"
              tick={{ fontSize: isPixel ? 13 : 11, fill: THEME.inkSoft, fontFamily: isPixel ? font.body : undefined }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <YAxis yAxisId="rain" orientation="right" hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: isPixel ? THEME.card : THEME.paper,
                border: isPixel ? `3px solid ${THEME.edge}` : `1px solid ${THEME.line}`,
                borderRadius: isPixel ? 0 : 10,
                boxShadow: shadow(3),
                fontSize: isPixel ? 14 : 12,
                fontFamily: isPixel ? font.body : undefined,
              }}
            />
            <Bar
              yAxisId="rain"
              dataKey="rain"
              fill={THEME.denim}
              opacity={isPixel ? 0.4 : 0.18}
              radius={isPixel ? 0 : ([3, 3, 0, 0] as [number, number, number, number])}
              name={t.rainLegend}
            />
            <Line
              yAxisId="temp"
              dataKey="temp"
              type={isPixel ? "stepAfter" : "linear"}
              stroke={THEME.rust}
              strokeWidth={isPixel ? 3 : 2}
              strokeLinecap={isPixel ? "square" : undefined}
              dot={false}
              name={`${t.tempLegend} ${tempUnitLabel(unit)}`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
