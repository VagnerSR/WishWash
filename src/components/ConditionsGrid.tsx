import { Droplets, Gauge } from "lucide-react";
import { THEME } from "../lib/theme";
import { StatCard } from "./StatCard";
import { WeatherIcon } from "./WeatherIcon";
import { formatTemp, formatWind, tempUnitLabel, windUnitLabel, fmtClock } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { CurrentWeather, DayForecast, TempUnit } from "../types/weather";

interface ConditionsGridProps {
  day: DayForecast;
  current: CurrentWeather | null;
  isToday: boolean;
  dayLabel: string;
  unit: TempUnit;
}

export function ConditionsGrid({ day, current, isToday, dayLabel, unit }: ConditionsGridProps) {
  const { t, localeTag } = useI18n();
  const heading = isToday ? t.conditionsHeadingToday : `${t.conditionsHeadingFor} ${dayLabel}`;

  return (
    <section className="mb-10 md:mb-14">
      <p style={{ color: THEME.inkSoft }} className="text-sm mb-4">
        {heading}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {isToday && current ? (
          <>
            <StatCard
              icon={<WeatherIcon slug="thermometer" size={34} />}
              label={t.feelsLike}
              value={`${formatTemp(current.apparent_temperature, unit)}${tempUnitLabel(unit)}`}
            />
            <StatCard
              icon={<Droplets size={26} color={THEME.denim} />}
              label={t.humidity}
              value={`${Math.round(current.relative_humidity_2m)}%`}
            />
            <StatCard
              icon={<WeatherIcon slug="wind" size={34} />}
              label={t.wind}
              value={`${formatWind(current.wind_speed_10m, unit)} ${windUnitLabel(unit)}`}
            />
            <StatCard
              icon={<WeatherIcon slug="overcast-day" size={34} />}
              label={t.cloudCover}
              value={`${Math.round(current.cloud_cover)}%`}
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<WeatherIcon slug="thermometer" size={34} />}
              label={t.high}
              value={`${formatTemp(day.tMax, unit)}${tempUnitLabel(unit)}`}
            />
            <StatCard
              icon={<WeatherIcon slug="thermometer" size={34} />}
              label={t.low}
              value={`${formatTemp(day.tMin, unit)}${tempUnitLabel(unit)}`}
            />
            <StatCard
              icon={<WeatherIcon slug="wind" size={34} />}
              label={t.wind}
              value={`${formatWind(day.windMax, unit)} ${windUnitLabel(unit)}`}
            />
          </>
        )}
        <StatCard
          icon={<WeatherIcon slug="rain" size={34} />}
          label={t.rainChance}
          value={`${Math.round(day.precipMax)}%`}
        />
        <StatCard
          icon={<Gauge size={26} color={THEME.denim} />}
          label={t.uvIndex}
          value={`${Math.round(day.uvMax)}`}
        />
        <StatCard
          icon={<WeatherIcon slug="sunrise" size={34} />}
          label={t.sunrise}
          value={fmtClock(day.sunrise, localeTag)}
        />
        <StatCard
          icon={<WeatherIcon slug="sunset" size={34} />}
          label={t.sunset}
          value={fmtClock(day.sunset, localeTag)}
        />
      </div>
    </section>
  );
}
