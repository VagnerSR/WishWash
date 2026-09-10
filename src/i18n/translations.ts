import type { VerdictKind } from "../types/weather";

export type Locale = "en" | "pt";

interface VerdictText {
  label: string;
  detail: string;
}

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  loading: string;
  errorSuffix: string;
  heroEyebrow: string;
  verdict: Record<VerdictKind, VerdictText>;
  dayStripHeading: string;
  today: string;
  tomorrow: string;
  dayBadge: { great: string; ok: string; bad: string };
  conditionsHeadingToday: string;
  conditionsHeadingFor: string;
  high: string;
  low: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  cloudCover: string;
  rainChance: string;
  uvIndex: string;
  sunrise: string;
  sunset: string;
  hourlyHeadingPrefix: string;
  hourlyMetrics: string;
  tempLegend: string;
  rainLegend: string;
  footer: string;
  unitToggle: string;
  confidence: { dry: string; wet: string; mixed: string };
}

const en: Translations = {
  appTitle: "WishWash",
  appSubtitle: "Weather for wash day",
  searchPlaceholder: "Search a city",
  loading: "Reading the sky…",
  errorSuffix: "Try searching for a city above.",
  heroEyebrow: "Wash day check, for tomorrow",
  verdict: {
    greatDrying: { label: "Perfect for drying tomorrow", detail: "Sunny with little rain risk" },
    goodTwoDays: {
      label: "Good couple of days for laundry",
      detail: "Tomorrow and the day after both look dry",
    },
    careful: { label: "Careful", detail: "Maybe not enough time to dry the clothes" },
    keepInside: { label: "Keep it inside tomorrow", detail: "Rain looks likely tomorrow" },
    okTomorrow: { label: "Should be fine tomorrow", detail: "Mostly dry, keep an eye on the sky" },
  },
  dayStripHeading: "Next few days",
  today: "Today",
  tomorrow: "Tomorrow",
  dayBadge: { great: "Dry", ok: "Maybe", bad: "Rain" },
  conditionsHeadingToday: "Current conditions",
  conditionsHeadingFor: "Conditions for",
  high: "High",
  low: "Low",
  feelsLike: "Feels like",
  humidity: "Humidity",
  wind: "Wind",
  cloudCover: "Cloud cover",
  rainChance: "Rain chance",
  uvIndex: "UV index",
  sunrise: "Sunrise",
  sunset: "Sunset",
  hourlyHeadingPrefix: "Hourly forecast for",
  hourlyMetrics: "temperature and rain chance",
  tempLegend: "Temp",
  rainLegend: "Rain chance %",
  footer: "Data from Open-Meteo. Updated on load.",
  unitToggle: "°C / °F",
  confidence: {
    dry: "Models agree: should stay dry",
    wet: "Models agree: rain likely",
    mixed: "Models disagree — worth a second look",
  },
};

const pt: Translations = {
  appTitle: "WishWash",
  appSubtitle: "Previsão para o dia de lavar roupa",
  searchPlaceholder: "Buscar uma cidade",
  loading: "Consultando o céu…",
  errorSuffix: "Tente buscar uma cidade acima.",
  heroEyebrow: "Previsão para amanhã",
  verdict: {
    greatDrying: { label: "Ótimo para secar amanhã", detail: "Sol, com pouco risco de chuva" },
    goodTwoDays: {
      label: "Bons dois dias para lavar roupa",
      detail: "Amanhã e depois de amanhã devem ficar secos",
    },
    careful: { label: "Cuidado", detail: "Pode não dar tempo de secar a roupa" },
    keepInside: { label: "Deixe a roupa dentro de casa amanhã", detail: "Chuva é provável amanhã" },
    okTomorrow: {
      label: "Deve ficar bom amanhã",
      detail: "Tempo seco na maior parte, fique de olho no céu",
    },
  },
  dayStripHeading: "Próximos dias",
  today: "Hoje",
  tomorrow: "Amanhã",
  dayBadge: { great: "Seco", ok: "Talvez", bad: "Chuva" },
  conditionsHeadingToday: "Condições atuais",
  conditionsHeadingFor: "Condições para",
  high: "Máxima",
  low: "Mínima",
  feelsLike: "Sensação",
  humidity: "Umidade",
  wind: "Vento",
  cloudCover: "Nebulosidade",
  rainChance: "Chance de chuva",
  uvIndex: "Índice UV",
  sunrise: "Nascer do sol",
  sunset: "Pôr do sol",
  hourlyHeadingPrefix: "Previsão horária para",
  hourlyMetrics: "temperatura e chance de chuva",
  tempLegend: "Temp",
  rainLegend: "Chance de chuva %",
  footer: "Dados do Open-Meteo. Atualizado ao carregar.",
  unitToggle: "°C / °F",
  confidence: {
    dry: "Modelos concordam: deve ficar seco",
    wet: "Modelos concordam: chuva provável",
    mixed: "Modelos divergem — vale conferir de novo",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { en, pt };

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const candidates =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const lang = candidate.toLowerCase().slice(0, 2);
    if (lang === "pt") return "pt";
    if (lang === "en") return "en";
  }
  return "en";
}

export function localeTag(locale: Locale): string {
  return locale === "pt" ? "pt-BR" : "en-US";
}
