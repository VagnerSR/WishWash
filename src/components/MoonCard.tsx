import { Cloud, CloudRain, Moon, Sunrise, Sunset } from "lucide-react";
import { THEME } from "../lib/theme";
import { fmtClock } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import { MoonPhaseIcon } from "./MoonPhaseIcon";
import type { MoonInfo } from "../types/weather";

interface MoonCardProps {
  moon: MoonInfo | null;
}

export function MoonCard({ moon }: MoonCardProps) {
  const { t, localeTag } = useI18n();

  if (!moon) {
    return (
      <div
        style={{ background: THEME.stormDeep, color: "#F3F4F1" }}
        className="rounded-3xl px-6 md:px-10 py-7 md:py-9 h-full flex flex-col items-center justify-center text-center gap-2"
      >
        <Moon size={40} strokeWidth={1.4} opacity={0.7} />
        <p className="text-sm opacity-80">{t.moon.unknown}</p>
      </div>
    );
  }

  const isFull = moon.phaseName === "fullMoon";
  const phaseLabel = t.moon.phaseNames[moon.phaseName];

  const showMoonrise = moon.visibility.moonriseLocalIso !== null;
  const showMoonset = moon.visibility.moonsetLocalIso !== null;

  let visibilityLine: string | null = null;
  if (moon.visibility.status === "risesLater") {
    visibilityLine = t.moon.visibleLaterTonight;
  } else if (moon.visibility.status === "belowHorizon") {
    visibilityLine = t.moon.belowHorizonTonight;
  } else if (moon.visibility.status === "alwaysUp") {
    visibilityLine = t.moon.alwaysUpTonight;
  } else if (moon.visibility.status === "alwaysDown") {
    visibilityLine = t.moon.alwaysDownTonight;
  } else if (moon.visibility.status === "unknown") {
    visibilityLine = t.moon.unknown;
  }

  return (
    <div
      style={{ background: THEME.stormDeep, color: "#F3F4F1" }}
      className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-6 md:py-8 h-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-10 justify-center gap-4"
    >
      {isFull && (
        <div
          style={{ background: THEME.gold, opacity: 0.12 }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="relative flex flex-row md:flex-col items-center gap-4 md:gap-2 md:text-center">
        <MoonPhaseIcon phase={moon.phaseFraction} size={72} />
        <div className="flex flex-col md:items-center">
          <p className="text-[11px] uppercase tracking-wide opacity-60">{t.moon.cardHeading}</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }} className="text-xl leading-tight">
            {phaseLabel}
          </h2>
          <p className="text-sm opacity-80">
            {moon.illuminationPercent}% {t.moon.illuminated}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col gap-1.5 text-sm md:min-w-[210px]">
        <p className="text-[11px] uppercase tracking-wide opacity-60">{t.moon.tonightHeading}</p>

        {showMoonrise && (
          <span className="flex items-center gap-2">
            <Sunrise size={15} className="shrink-0" />
            {t.moon.moonrise} {fmtClock(moon.visibility.moonriseLocalIso as string, localeTag)}
          </span>
        )}
        {showMoonset && (
          <span className="flex items-center gap-2">
            <Sunset size={15} className="shrink-0" />
            {t.moon.moonset} {fmtClock(moon.visibility.moonsetLocalIso as string, localeTag)}
          </span>
        )}
        {visibilityLine && <p className="opacity-90">{visibilityLine}</p>}

        {moon.night && (
          <>
            <span className="flex items-center gap-2">
              <Cloud size={15} className="shrink-0" />
              {t.moon.sky}: {t.moon.skyLevels[moon.night.skyLevel]}
            </span>
            <span className="flex items-center gap-2">
              <CloudRain size={15} className="shrink-0" />
              {t.moon.rain}: {t.moon.rainLevels[moon.night.rainLevel]}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
