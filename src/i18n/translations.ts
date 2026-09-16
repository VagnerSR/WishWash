import type { WashReasonKind } from "../types/weather";

export type Locale = "en" | "pt";

interface ReasonText {
  label: string;
  detail: string;
}

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  loading: string;
  errorSuffix: string;
  heroEyebrowPrefix: string;
  washReasons: Record<WashReasonKind, ReasonText>;
  rainWarningDetail: string;
  dayAfterGoodNote: string;
  dayAfterRainNote: string;
  coveredAreaTip: string;
  heroPastFivePmSuffix: string;
  laundryConditionsLabel: string;
  modelConsensusLabel: string;
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
  footerCredit: string;
  unitToggle: string;
  confidence: { strong: string; moderate: string; disagreement: string };
}

const en: Translations = {
  appTitle: "WishWash",
  appSubtitle: "Weather for wash day",
  searchPlaceholder: "Search a city",
  loading: "Reading the sky…",
  errorSuffix: "Try searching for a city above.",
  heroEyebrowPrefix: "Wash day check for",
  washReasons: {
    excellent: {
      label: "Great day to wash",
      detail: "Warm, dry, and breezy — great drying conditions tomorrow and the day after.",
    },
    good: {
      label: "Good day to wash",
      detail: "Conditions look favorable for drying.",
    },
    goodRainWarning: {
      label: "Good day — watch the rain",
      detail: "There's a good dry window tomorrow, but {rainWarning}",
    },
    goodButSlowQuality: {
      label: "Good day — drying may take longer",
      detail: "Tomorrow is mostly dry, but cool and humid conditions may slow drying. The following day looks better.",
    },
    goodButSlowRain: {
      label: "Good day — plan for two days",
      detail: "Rain will likely limit drying tomorrow, but conditions improve the day after.",
    },
    wait: {
      label: "Better to wait",
      detail: "Rain and limited drying opportunity are expected over the next two days.",
    },
  },
  rainWarningDetail: "rain is possible between {start} and {end}.",
  dayAfterGoodNote: "Good couple of days for laundry.",
  dayAfterRainNote: "The next day: {rainWarning}",
  coveredAreaTip: "If you're drying outdoors, consider a covered area or bring the clothes in before the rain.",
  heroPastFivePmSuffix: ", already past 5 pm — here's the forecast for tomorrow",
  laundryConditionsLabel: "Laundry conditions",
  modelConsensusLabel: "Model consensus",
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
  footerCredit: "Developed by",
  unitToggle: "°C / °F",
  confidence: {
    strong: "Strong",
    moderate: "Moderate",
    disagreement: "Disagreement",
  },
};

const pt: Translations = {
  appTitle: "WishWash",
  appSubtitle: "Previsão para o dia de lavar roupa",
  searchPlaceholder: "Buscar uma cidade",
  loading: "Consultando o céu…",
  errorSuffix: "Tente buscar uma cidade acima.",
  heroEyebrowPrefix: "Previsão para lavar roupa em",
  washReasons: {
    excellent: {
      label: "Ótimo dia para lavar roupa",
      detail: "Quente, seco e com vento — ótimas condições de secagem amanhã e depois de amanhã.",
    },
    good: {
      label: "Bom dia para lavar roupa",
      detail: "As condições parecem favoráveis para secar roupa.",
    },
    goodRainWarning: {
      label: "Bom dia — fique de olho na chuva",
      detail: "Há uma boa janela seca amanhã, mas {rainWarning}",
    },
    goodButSlowQuality: {
      label: "Bom dia — a secagem pode demorar mais",
      detail: "Amanhã fica seco na maior parte, mas frio e úmido pode deixar a secagem mais lenta. O dia seguinte deve ser melhor.",
    },
    goodButSlowRain: {
      label: "Bom dia — conte com dois dias",
      detail: "A chuva deve limitar a secagem amanhã, mas as condições melhoram no dia seguinte.",
    },
    wait: {
      label: "Melhor esperar",
      detail: "Chuva e pouca oportunidade de secagem são esperadas nos próximos dois dias.",
    },
  },
  rainWarningDetail: "há possibilidade de chuva entre {start} e {end}.",
  dayAfterGoodNote: "Bons dois dias para lavar roupa.",
  dayAfterRainNote: "No dia seguinte: {rainWarning}",
  coveredAreaTip: "Se estiver secando ao ar livre, procure um local coberto ou recolha a roupa antes da chuva.",
  heroPastFivePmSuffix: ", já passou das 17h — aqui está a previsão de amanhã",
  laundryConditionsLabel: "Condições para lavar roupa",
  modelConsensusLabel: "Consenso dos modelos",
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
  footerCredit: "Desenvolvido por",
  unitToggle: "°C / °F",
  confidence: {
    strong: "Forte",
    moderate: "Moderado",
    disagreement: "Divergência",
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
