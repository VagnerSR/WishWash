import { useTheme } from "../theme/ThemeContext";
import { codeInfo } from "../lib/weatherCodes";
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
  const { THEME, SKY_CONDITION_STYLE, isPixel, shadow, font } = useTheme();

  return (
    <section className="mb-10 md:mb-14">
      <p style={{ color: THEME.inkSoft, fontFamily: isPixel ? font.display : undefined }} className={isPixel ? "text-xs uppercase mb-4" : "text-sm mb-4"}>
        {t.dayStripHeading}
      </p>
      <div className="relative">
        <div
          style={{ background: THEME.edge }}
          className={isPixel ? "absolute left-0 right-0 top-[27px] h-1 hidden md:block" : "absolute left-0 right-0 top-6 h-px hidden md:block"}
        />
        <div className={isPixel ? "grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-5 relative" : "grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 relative"}>
          {days.map((d, i) => {
            const sky = classifySkyCondition(d);
            const vs = SKY_CONDITION_STYLE[sky];
            const { Icon } = codeInfo(d.weatherCode);
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
                  style={{ background: isPixel ? THEME.marigold : THEME.storm, borderColor: THEME.edge }}
                  className={isPixel ? "w-4 h-4 border-4 mb-2 hidden md:block" : "w-2 h-2 rounded-full mb-2 hidden md:block"}
                />
                <div
                  style={{
                    background: isPixel && selected ? "#FFF3B0" : THEME.card,
                    borderColor: selected ? THEME.denim : THEME.edge,
                    borderWidth: isPixel ? undefined : selected ? 2 : 1,
                    boxShadow: shadow(4, selected ? THEME.denim : THEME.edge),
                  }}
                  // Fixed height so every tile matches regardless of whether
                  // its badge text wraps to one or two lines (e.g. "Cloudy"
                  // vs "Showers possible").
                  className={isPixel ? "px-btn w-full h-[190px] border-4 px-2 py-4 flex flex-col items-center gap-2" : "w-full h-[180px] rounded-2xl border px-2 py-4 flex flex-col items-center gap-2"}
                >
                  <span style={{ fontFamily: isPixel ? font.display : undefined }} className={isPixel ? "text-xs uppercase" : "text-xs font-medium"}>{label}</span>
                  <Icon size={26} strokeWidth={1.5} color={THEME.denim} />
                  <span style={{ fontFamily: font.mono }} className={isPixel ? "text-xs" : "text-sm"}>
                    {formatTemp(d.tMax, unit)}&deg; / {formatTemp(d.tMin, unit)}&deg;
                  </span>
                  <span
                    style={{ background: vs.bg, color: vs.fg, borderColor: THEME.edge }}
                    className={isPixel ? "w-full text-sm text-center px-1.5 py-1 border-2 mt-1 leading-tight" : "w-full text-[10px] text-center px-1.5 py-1 rounded-lg mt-1 leading-tight"}
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
