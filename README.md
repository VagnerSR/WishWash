# WishWash

A weather app built around one question: is tomorrow good for washing and
drying clothes outside? The hero verdict always looks ahead — it's driven by
tomorrow's forecast (checked against the day after too, so a good day
followed by rain gets flagged) rather than today's weather, since by the
time you're checking, today is already decided. Also shows a 6-day outlook,
current conditions from several data points at once, and an hourly
temperature and rain-chance chart.

The last city you search for is remembered (via `localStorage`) and shown
automatically next time you open the app, ahead of geolocation or the
default fallback city.

The interface detects the browser's language and shows English or
Portuguese; any other language falls back to English. A toggle in the
header lets you switch manually, and your choice is remembered (via
`localStorage`) ahead of auto-detection on future visits. See
`src/i18n/translations.ts` and `src/i18n/I18nContext.tsx`.

Tomorrow's forecast is cross-checked against three independent weather
services — ECMWF, NOAA GFS, and DWD ICON — via Open-Meteo's `models`
parameter. The hero card shows how many of the three agree it'll stay dry,
so a low-confidence day (models split on rain vs. no rain) reads
differently from a day all three agree on. Classification is based on
precipitation probability rather than the daily weather code, since that
code reflects the single most severe condition forecast for the day and
otherwise over-flags convective climates (frequent afternoon thunderstorm
risk, common in the tropics) as "rain" even when the actual chance is low.
See `src/hooks/useModelComparison.ts` and `src/lib/modelAgreement.ts`.

The day cards below the hero are clickable. Selecting one updates the
"Conditions" panel and the hourly chart to that day — today shows live
current-weather readings (feels like, humidity, wind, cloud cover), while
any other day shows that day's forecast high/low, wind, rain chance, UV,
and sunrise/sunset instead, since live current-condition data only exists
for today.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (hourly chart)
- lucide-react (icons)
- [Open-Meteo](https://open-meteo.com) for weather and geocoding data — free, no API key required

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build
in `dist/`.

## Project structure

```
public/
  wishwash-logo.png       header logo
  favicon.png             browser tab icon
src/
  types/weather.ts       API and domain types
  i18n/translations.ts    English and Portuguese text, locale detection
  i18n/I18nContext.tsx    React context exposing the active language
  lib/theme.ts            color tokens and verdict styling
  lib/weatherCodes.tsx    WMO weather-code -> icon/label mapping
  lib/washVerdict.ts      the "good day to wash?" logic (tomorrow + day after)
  lib/modelAgreement.ts   classifies and summarizes multi-model agreement
  lib/format.ts           unit conversion and date/time formatting
  hooks/usePlace.ts       last searched city (localStorage) > geolocation > fallback
  hooks/useForecast.ts    fetches the Open-Meteo forecast
  hooks/useModelComparison.ts  fetches tomorrow's forecast from 3 named models
  hooks/useGeocodeSearch.ts  debounced city search
  components/             UI pieces (Header, VerdictHero, DayStrip, ...)
  App.tsx                 composes everything
```

## Swapping the weather source

All API calls live in `src/hooks/useForecast.ts` and
`src/hooks/useGeocodeSearch.ts`. To use a different provider, change the
fetch URL(s) there and adjust `src/types/weather.ts` to match that
provider's response shape.
