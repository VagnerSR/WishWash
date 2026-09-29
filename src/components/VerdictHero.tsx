import { Umbrella } from "lucide-react";
import { codeInfo } from "../lib/weatherCodes";
import { useTheme } from "../theme/ThemeContext";
import { formatTemp, tempUnitLabel, formatHourLabel, formatFullDate } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { ModelAgreement } from "../lib/modelAgreement";
import type { DayForecast, TempUnit, WashRecommendation } from "../types/weather";

interface VerdictHeroProps {
  recommendation: WashRecommendation;
  referenceDay: DayForecast;
  eyebrowDay: DayForecast;
  showPastFivePmNotice: boolean;
  unit: TempUnit;
  agreement: ModelAgreement | null;
}

export function VerdictHero({
  recommendation,
  referenceDay,
  eyebrowDay,
  showPastFivePmNotice,
  unit,
  agreement,
}: VerdictHeroProps) {
  const { t, localeTag } = useI18n();
  const { THEME, WASH_LEVEL_STYLE, isPixel, shadow, font, headingWeight } = useTheme();
  const style = WASH_LEVEL_STYLE[recommendation.level];
  const reason = t.washReasons[recommendation.reasonKind];
  const { Icon } = codeInfo(referenceDay.weatherCode);

  let detail = reason.detail;
  if (recommendation.rainWarning) {
    const rainPhrase = t.rainWarningDetail
      .replace("{start}", formatHourLabel(recommendation.rainWarning.startHour, localeTag))
      .replace("{end}", formatHourLabel(recommendation.rainWarning.endHour, localeTag));
    detail = detail.replace("{rainWarning}", rainPhrase);
  }

  let dayAfterNoteText: string | null = null;
  if (recommendation.dayAfterNote === "goodTwoDays") {
    dayAfterNoteText = t.dayAfterGoodNote;
  } else if (recommendation.dayAfterNote === "rainWarning" && recommendation.dayAfterRainWarning) {
    const rainPhrase = t.rainWarningDetail
      .replace("{start}", formatHourLabel(recommendation.dayAfterRainWarning.startHour, localeTag))
      .replace("{end}", formatHourLabel(recommendation.dayAfterRainWarning.endHour, localeTag));
    dayAfterNoteText = t.dayAfterRainNote.replace("{rainWarning}", rainPhrase);
  }

  const showCoveredAreaTip = recommendation.rainWarning !== null || recommendation.dayAfterNote === "rainWarning";

  return (
    <section className="mb-10 md:mb-14">
      <div
        style={{ background: style.bg, color: style.fg, borderColor: THEME.edge, boxShadow: shadow(6) }}
        className={isPixel ? "border-4 px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6" : "rounded-3xl px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6"}
      >
        <div>
          <p className={isPixel ? "text-base opacity-80 mb-2" : "text-sm opacity-80 mb-2"}>
            {t.heroEyebrowPrefix} {formatFullDate(eyebrowDay.date, localeTag)}
            {showPastFivePmNotice ? t.heroPastFivePmSuffix : ""}
          </p>
          <h2
            style={{ fontFamily: font.display, fontWeight: headingWeight }}
            className={isPixel ? "text-xl md:text-3xl leading-tight mb-3 uppercase" : "text-3xl md:text-4xl leading-tight mb-2"}
          >
            {reason.label}
          </h2>
          <p className={isPixel ? "text-base md:text-lg opacity-90" : "text-sm md:text-base opacity-90"}>{detail}</p>
          {dayAfterNoteText && <p className={isPixel ? "text-base md:text-lg opacity-90 mt-1" : "text-sm md:text-base opacity-90 mt-1"}>{dayAfterNoteText}</p>}
          {showCoveredAreaTip && (
            <p className={isPixel ? "text-base md:text-lg opacity-90 mt-1 flex items-start gap-1.5" : "text-sm md:text-base opacity-90 mt-1 flex items-start gap-1.5"}>
              <Umbrella size={16} className="shrink-0 mt-0.5" />
              <span>{t.coveredAreaTip}</span>
            </p>
          )}
          <p className={isPixel ? "text-sm md:text-base opacity-80 mt-3" : "text-xs md:text-sm opacity-80 mt-3"}>
            {t.laundryConditionsLabel}: {recommendation.laundryScore}/100
          </p>
          {agreement && (
            <p className={isPixel ? "text-sm md:text-base opacity-80" : "text-xs md:text-sm opacity-80"}>
              {t.modelConsensusLabel}: {t.confidence[agreement.level]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Icon size={56} strokeWidth={1.4} />
          <div style={{ fontFamily: font.mono }} className={isPixel ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}>
            {formatTemp(referenceDay.tMax, unit)}
            <span className={isPixel ? "text-lg align-top" : "text-xl align-top"}>{tempUnitLabel(unit)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
