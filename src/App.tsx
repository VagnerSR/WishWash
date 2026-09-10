import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { THEME } from "./lib/theme";
import { planAheadVerdict } from "./lib/washVerdict";
import { usePlace } from "./hooks/usePlace";
import { useForecast } from "./hooks/useForecast";
import { useGeocodeSearch } from "./hooks/useGeocodeSearch";
import { useModelComparison } from "./hooks/useModelComparison";
import { agreementFor } from "./lib/modelAgreement";
import { dayName } from "./lib/format";
import { I18nProvider, useI18n } from "./i18n/I18nContext";
import { Header } from "./components/Header";
import { VerdictHero } from "./components/VerdictHero";
import { DayStrip } from "./components/DayStrip";
import { ConditionsGrid } from "./components/ConditionsGrid";
import { HourlyChart } from "./components/HourlyChart";
import type { DayForecast, GeocodeResult, TempUnit } from "./types/weather";

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

function AppContent() {
  const { t, localeTag } = useI18n();
  const [unit, setUnit] = useState<TempUnit>("c");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [place, setPlace] = usePlace();
  const { data, loading, error } = useForecast(place);
  const { suggestions, searching, search, clear } = useGeocodeSearch();
  const { readings } = useModelComparison(place);

  useEffect(() => {
    setSelectedIndex(0);
  }, [place]);

  function onQueryChange(value: string) {
    setQuery(value);
    setShowSuggestions(true);
    search(value);
  }

  function pickPlace(r: GeocodeResult) {
    setPlace(
      {
        name: r.name,
        admin: r.admin1 || "",
        country: r.country || "",
        lat: r.latitude,
        lon: r.longitude,
      },
      true
    );
    setQuery("");
    clear();
    setShowSuggestions(false);
  }

  const days: DayForecast[] =
    data?.daily.time.map((dateStr, i) => {
      const sunshine = data.daily.sunshine_duration[i] ?? 0;
      const daylight = data.daily.daylight_duration[i] ?? 1;
      return {
        date: dateStr,
        weatherCode: data.daily.weather_code[i],
        tMax: data.daily.temperature_2m_max[i],
        tMin: data.daily.temperature_2m_min[i],
        precipMax: data.daily.precipitation_probability_max[i],
        uvMax: data.daily.uv_index_max[i],
        windMax: data.daily.wind_speed_10m_max[i],
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
        sunshineRatio: daylight > 0 ? sunshine / daylight : 0,
      };
    }) ?? [];

  const today = days[0];
  const tomorrow = days[1];
  const dayAfter = days[2];
  const verdict = tomorrow ? planAheadVerdict(tomorrow, dayAfter) : null;
  const agreement = agreementFor(readings);

  const selectedDay = days[selectedIndex];
  const selectedLabel = selectedDay ? dayName(selectedIndex, selectedDay.date, t, localeTag) : "";
  const isToday = selectedIndex === 0;

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif", background: THEME.paper, color: THEME.ink, minHeight: "100vh" }}
      className="w-full"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Header
          query={query}
          onQueryChange={onQueryChange}
          suggestions={suggestions}
          searching={searching}
          showSuggestions={showSuggestions}
          onFocus={() => setShowSuggestions(true)}
          onPick={pickPlace}
          place={place}
          onToggleUnit={() => setUnit(unit === "c" ? "f" : "c")}
        />

        {loading && (
          <div className="flex items-center gap-2 py-16 justify-center" style={{ color: THEME.inkSoft }}>
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">{t.loading}</span>
          </div>
        )}

        {error && !loading && (
          <div
            style={{ background: THEME.card, borderColor: THEME.line, color: THEME.rust }}
            className="border rounded-2xl px-5 py-4 text-sm mb-8"
          >
            {error}. {t.errorSuffix}
          </div>
        )}

        {!loading && !error && data && today && tomorrow && verdict && selectedDay && (
          <>
            <VerdictHero verdict={verdict} tomorrow={tomorrow} unit={unit} agreement={agreement} />
            <DayStrip days={days} unit={unit} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
            <ConditionsGrid
              day={selectedDay}
              current={isToday ? data.current : null}
              isToday={isToday}
              dayLabel={selectedLabel}
              unit={unit}
            />
            <HourlyChart hourly={data.hourly} dayIndex={selectedIndex} dayLabel={selectedLabel} unit={unit} />
            <footer style={{ color: THEME.inkSoft }} className="text-xs mt-10 text-center">
              {t.footer}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
