import { MapPin, Search, Loader2 } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import type { GeocodeResult, Place } from "../types/weather";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: GeocodeResult[];
  searching: boolean;
  showSuggestions: boolean;
  onFocus: () => void;
  onPick: (result: GeocodeResult) => void;
  place: Place | null;
  onToggleUnit: () => void;
}

export function Header({
  query,
  onQueryChange,
  suggestions,
  searching,
  showSuggestions,
  onFocus,
  onPick,
  place,
  onToggleUnit,
}: HeaderProps) {
  const { t, locale, setLocale } = useI18n();
  const { THEME, isPixel, shadow, font, headingWeight, toggleMode } = useTheme();

  const pillClass = isPixel
    ? "px-btn text-xs border-4 px-2.5 py-1"
    : "text-xs border rounded-full px-2.5 py-1 hover:bg-black/5";

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-8 md:mb-12">
      <div className="flex items-center gap-3">
        {isPixel ? (
          // 384px source drawn at 96px = exactly 2 screen px per art pixel.
          <img
            src="/wishwash-logo.gif"
            alt={t.appTitle}
            width={96}
            height={96}
            className="w-24 h-24 shrink-0 object-contain -my-2"
          />
        ) : (
          <img src="/wishwash-logo.png" alt={t.appTitle} className="w-11 h-11 shrink-0 object-contain" />
        )}
        <div>
          <h1
            style={{ fontFamily: font.display, fontWeight: headingWeight }}
            className={isPixel ? "text-2xl md:text-3xl leading-none uppercase" : "text-2xl md:text-3xl leading-none"}
          >
            {t.appTitle}
          </h1>
          <p style={{ color: THEME.inkSoft }} className={isPixel ? "text-base mt-2" : "text-sm mt-1"}>
            {t.appSubtitle}
          </p>
        </div>
      </div>

      <div className={isPixel ? "flex flex-col items-end gap-3" : "flex flex-col items-end gap-2"}>
        <div className="relative">
          <div
            style={{ borderColor: THEME.edge, background: THEME.card, boxShadow: shadow(4) }}
            className={
              isPixel
                ? "flex items-center gap-2 border-4 px-3 py-2 w-56 md:w-64"
                : "flex items-center gap-2 rounded-full border px-3 py-2 w-56 md:w-64"
            }
          >
            <Search size={15} color={THEME.inkSoft} />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={onFocus}
              placeholder={t.searchPlaceholder}
              style={{ color: THEME.ink }}
              className={
                isPixel
                  ? "bg-transparent outline-none text-base flex-1 min-w-0 placeholder:text-current placeholder:opacity-50"
                  : "bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-current placeholder:opacity-50"
              }
            />
            {searching && <Loader2 size={14} className="animate-spin" color={THEME.inkSoft} />}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{ borderColor: THEME.edge, background: THEME.card, boxShadow: shadow(4) }}
              className={
                isPixel
                  ? "absolute right-0 mt-3 w-72 border-4 overflow-hidden z-10"
                  : "absolute right-0 mt-2 w-72 rounded-2xl border shadow-sm overflow-hidden z-10"
              }
            >
              {suggestions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onPick(r)}
                  style={{ color: THEME.ink }}
                  className={
                    isPixel
                      ? "w-full text-left px-4 py-2.5 text-base hover:bg-[#FFE66B] flex items-center gap-2"
                      : "w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 flex items-center gap-2"
                  }
                >
                  <MapPin size={13} color={THEME.denim} className="shrink-0" />
                  <span className="truncate">
                    {r.name}
                    {r.admin1 ? `, ${r.admin1}` : ""}
                    {r.country ? `, ${r.country}` : ""}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {place && (
            <span style={{ color: THEME.inkSoft }} className={isPixel ? "text-sm flex items-center gap-1" : "text-xs flex items-center gap-1"}>
              <MapPin size={12} />
              {place.name}
              {place.admin ? `, ${place.admin}` : ""}
            </span>
          )}
          <div
            style={{ borderColor: THEME.edge, background: isPixel ? THEME.card : undefined, boxShadow: shadow(3) }}
            className={
              isPixel
                ? "flex items-center border-4 overflow-hidden"
                : "flex items-center rounded-full border overflow-hidden"
            }
          >
            {(["en", "pt"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                style={{
                  background: locale === code ? THEME.denim : "transparent",
                  color: locale === code ? "#fff" : THEME.ink,
                  fontFamily: isPixel ? font.display : undefined,
                }}
                className="text-xs px-2.5 py-1"
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={onToggleUnit}
            style={{
              borderColor: THEME.edge,
              color: THEME.ink,
              background: isPixel ? THEME.marigold : undefined,
              boxShadow: shadow(3),
              fontFamily: isPixel ? font.display : undefined,
            }}
            className={pillClass}
          >
            {t.unitToggle}
          </button>
          <button
            onClick={toggleMode}
            aria-label={t.themeToggleLabel}
            title={t.themeToggleLabel}
            style={{
              borderColor: THEME.edge,
              color: isPixel ? "#fff" : THEME.ink,
              background: isPixel ? THEME.denim : undefined,
              boxShadow: shadow(3),
              fontFamily: isPixel ? font.display : undefined,
            }}
            className={pillClass}
          >
            {isPixel ? t.themeToClassic : t.themeToEightBit}
          </button>
        </div>
      </div>
    </header>
  );
}
