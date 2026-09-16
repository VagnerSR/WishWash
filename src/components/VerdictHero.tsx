import { Umbrella } from "lucide-react";
import { codeInfo } from "../lib/weatherCodes";
import { WASH_LEVEL_STYLE } from "../lib/theme";
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
        style={{ background: style.bg, color: style.fg }}
        className="rounded-3xl px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <p className="text-sm opacity-80 mb-2">
            {t.heroEyebrowPrefix} {formatFullDate(eyebrowDay.date, localeTag)}
            {showPastFivePmNotice ? t.heroPastFivePmSuffix : ""}
          </p>
          <h2
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            className="text-3xl md:text-4xl leading-tight mb-2"
          >
            {reason.label}
          </h2>
          <p className="text-sm md:text-base opacity-90">{detail}</p>
          {dayAfterNoteText && <p className="text-sm md:text-base opacity-90 mt-1">{dayAfterNoteText}</p>}
          {showCoveredAreaTip && (
            <p className="text-sm md:text-base opacity-90 mt-1 flex items-start gap-1.5">
              <Umbrella size={16} className="shrink-0 mt-0.5" />
              <span>{t.coveredAreaTip}</span>
            </p>
          )}
          <p className="text-xs md:text-sm opacity-80 mt-3">
            {t.laundryConditionsLabel}: {recommendation.laundryScore}/100
          </p>
          {agreement && (
            <p className="text-xs md:text-sm opacity-80">
              {t.modelConsensusLabel}: {t.confidence[agreement.level]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Icon size={56} strokeWidth={1.4} />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-4xl md:text-5xl">
            {formatTemp(referenceDay.tMax, unit)}
            <span className="text-xl align-top">{tempUnitLabel(unit)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
