import { codeInfo } from "../lib/weatherCodes";
import { VERDICT_STYLE } from "../lib/theme";
import { formatTemp, tempUnitLabel } from "../lib/format";
import { useI18n } from "../i18n/I18nContext";
import type { Agreement } from "../lib/modelAgreement";
import type { DayForecast, TempUnit, Verdict } from "../types/weather";

interface VerdictHeroProps {
  verdict: Verdict;
  tomorrow: DayForecast;
  unit: TempUnit;
  agreement: Agreement | null;
}

export function VerdictHero({ verdict, tomorrow, unit, agreement }: VerdictHeroProps) {
  const { t } = useI18n();
  const style = VERDICT_STYLE[verdict.level];
  const text = t.verdict[verdict.kind];
  const { Icon } = codeInfo(tomorrow.weatherCode);

  return (
    <section className="mb-10 md:mb-14">
      <div
        style={{ background: style.bg, color: style.fg }}
        className="rounded-3xl px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <p className="text-sm opacity-80 mb-2">{t.heroEyebrow}</p>
          <h2
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            className="text-3xl md:text-4xl leading-tight mb-2"
          >
            {text.label}
          </h2>
          <p className="text-sm md:text-base opacity-90">{text.detail}</p>
          {agreement && (
            <p className="text-xs md:text-sm opacity-80 mt-3">
              {t.confidence[agreement.level]} ({agreement.dryCount}/{agreement.total})
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Icon size={56} strokeWidth={1.4} />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-4xl md:text-5xl">
            {formatTemp(tomorrow.tMax, unit)}
            <span className="text-xl align-top">{tempUnitLabel(unit)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
