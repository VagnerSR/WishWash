import React from "react";
import { THEME, VERDICT_STYLE } from "../lib/theme";
import { codeInfo } from "../lib/weatherCodes";
import { washVerdict } from "../lib/washVerdict";
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
            const v = washVerdict(d);
            const vs = VERDICT_STYLE[v.level];
            const { Icon } = codeInfo(d.weatherCode);
            const label = dayName(i, d.date, t, localeTag);
            const badge =
              v.level === "great" ? t.dayBadge.great : v.level === "ok" ? t.dayBadge.ok : t.dayBadge.bad;
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
                  className="w-full rounded-2xl border px-2 py-4 flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium">{label}</span>
                  <Icon size={26} strokeWidth={1.5} color={THEME.denim} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-sm">
                    {formatTemp(d.tMax, unit)}&deg; / {formatTemp(d.tMin, unit)}&deg;
                  </span>
                  <span
                    style={{ background: vs.bg, color: vs.fg }}
                    className="text-[11px] px-2 py-1 rounded-full mt-1 leading-none"
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
