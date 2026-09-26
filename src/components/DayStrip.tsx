import { THEME, SKY_CONDITION_STYLE } from "../lib/theme";
import { codeInfo } from "../lib/weatherCodes";
import { WeatherIcon } from "./WeatherIcon";
import { classifySkyCondition } from "../lib/skyCondition";
import { dayName, formatTemp } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { DayForecast, TempUnit } from "../types/weather";

interface DayStripProps {
  days: DayForecast[];
  unit: TempUnit;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function DayStrip({ days, unit, selectedIndex, onSelect }: DayStripProps) {
  const { t, localeTag } = useI18n();

  return (
    <section className="mb-10 md:mb-14">
      <p style={{ color: THEME.inkSoft }} className="text-sm mb-4">
        {t.dayStripHeading}
      </p>
      <div className="relative">
        <div
          style={{ background: THEME.line }}
          className="absolute left-0 right-0 top-6 h-px hidden md:block"
        />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 relative">
          {days.map((d, i) => {
            const sky = classifySkyCondition(d);
            const vs = SKY_CONDITION_STYLE[sky];
            const { icon } = codeInfo(d.weatherCode);
            const label = dayName(i, d.date, t, localeTag);
            const badge = t.skyConditions[sky];
            const selected = i === selectedIndex;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => onSelect(i)}
                aria-pressed={selected}
                className="flex flex-col items-center text-center"
              >
                <div
                  style={{ background: THEME.storm }}
                  className="w-2 h-2 rounded-full mb-2 hidden md:block"
                />
                <div
                  style={{
                    background: THEME.card,
                    borderColor: selected ? THEME.denim : THEME.line,
                    borderWidth: selected ? 2 : 1,
                  }}
                  // Fixed height so every tile matches regardless of whether
                  // its badge text wraps to one or two lines (e.g. "Cloudy"
                  // vs "Showers possible").
                  className="w-full h-[180px] rounded-2xl border px-2 py-4 flex flex-col items-center justify-between gap-1"
                >
                  <span className="text-xs font-medium">{label}</span>
                  <WeatherIcon slug={icon} size={52} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-sm">
                    {formatTemp(d.tMax, unit)}&deg; / {formatTemp(d.tMin, unit)}&deg;
                  </span>
                  <span
                    style={{ background: vs.bg, color: vs.fg }}
                    className="w-full text-[10px] text-center px-1.5 py-1 rounded-lg mt-1 leading-tight"
                  >
                    {badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
