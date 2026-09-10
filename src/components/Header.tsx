import React from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { THEME } from "../lib/theme";
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

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 mb-8 md:mb-12">
      <div className="flex items-center gap-3">
        <img
          src="/wishwash-logo.png"
          alt={t.appTitle}
          className="w-11 h-11 shrink-0 object-contain"
        />
        <div>
          <h1
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            className="text-2xl md:text-3xl leading-none"
          >
            {t.appTitle}
          </h1>
          <p style={{ color: THEME.inkSoft }} className="text-sm mt-1">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="relative">
          <div
            style={{ borderColor: THEME.line, background: THEME.card }}
            className="flex items-center gap-2 rounded-full border px-3 py-2 w-56 md:w-64"
          >
            <Search size={15} color={THEME.inkSoft} />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={onFocus}
              placeholder={t.searchPlaceholder}
              style={{ color: THEME.ink }}
              className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-current placeholder:opacity-50"
            />
            {searching && <Loader2 size={14} className="animate-spin" color={THEME.inkSoft} />}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{ borderColor: THEME.line, background: THEME.card }}
              className="absolute right-0 mt-2 w-72 rounded-2xl border shadow-sm overflow-hidden z-10"
            >
              {suggestions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onPick(r)}
                  style={{ color: THEME.ink }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 flex items-center gap-2"
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

        <div className="flex items-center gap-3">
          {place && (
            <span style={{ color: THEME.inkSoft }} className="text-xs flex items-center gap-1">
              <MapPin size={12} />
              {place.name}
              {place.admin ? `, ${place.admin}` : ""}
            </span>
          )}
          <div
            style={{ borderColor: THEME.line }}
            className="flex items-center rounded-full border overflow-hidden"
          >
            <button
              onClick={() => setLocale("en")}
              style={{
                background: locale === "en" ? THEME.denim : "transparent",
                color: locale === "en" ? "#fff" : THEME.ink,
              }}
              className="text-xs px-2.5 py-1"
            >
              EN
            </button>
            <button
              onClick={() => setLocale("pt")}
              style={{
                background: locale === "pt" ? THEME.denim : "transparent",
                color: locale === "pt" ? "#fff" : THEME.ink,
              }}
              className="text-xs px-2.5 py-1"
            >
              PT
            </button>
          </div>
          <button
            onClick={onToggleUnit}
            style={{ borderColor: THEME.line, color: THEME.ink }}
            className="text-xs border rounded-full px-2.5 py-1 hover:bg-black/5"
          >
            {t.unitToggle}
          </button>
        </div>
      </div>
    </header>
  );
}
