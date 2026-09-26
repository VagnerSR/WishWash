import type { MoonPhaseName, NightRainLevel, NightSkyLevel, SkyCondition, WashReasonKind } from "../types/weather";

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
  skyConditions: Record<SkyCondition, string>;
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
  moon: {
    cardHeading: string;
    tonightHeading: string;
    illuminated: string;
    moonrise: string;
    moonset: string;
    sky: string;
    rain: string;
    visibleLaterTonight: string;
    belowHorizonTonight: string;
    alwaysUpTonight: string;
    alwaysDownTonight: string;
    unknown: string;
    phaseNames: Record<MoonPhaseName, string>;
    rainLevels: Record<NightRainLevel, string>;
    skyLevels: Record<NightSkyLevel, string>;
  };
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
      detail: "Warm, dry, and breezy — great drying conditions, continuing into the day after.",
    },
    good: {
      label: "Good day to wash",
      detail: "Conditions look favorable for drying.",
    },
    goodRainWarning: {
      label: "Good day — watch the rain",
      detail: "There's a good dry window, but {rainWarning}",
    },
    goodButSlowQuality: {
      label: "Good day — drying may take longer",
      detail: "It's mostly dry, but cool and humid conditions may slow drying. The following day looks better.",
    },
    goodButSlowRain: {
      label: "Good day — plan for two days",
      detail: "Rain will likely limit drying, but conditions improve the day after.",
    },
    goodButSlowBoth: {
      label: "Good day — allow extra time",
      detail: "Neither day is ideal on its own, so the wash may take longer than usual to fully dry.",
    },
    borderline: {
      label: "Your call — conditions are mixed",
      detail: "The next two days are close enough to call that it's genuinely up to you.",
    },
    bad: {
      label: "Bad day to wash",
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
  skyConditions: {
    sunny: "Sunny",
    mostlyClear: "Mostly clear",
    partlyCloudy: "Partly cloudy",
    cloudy: "Cloudy",
    showersPossible: "Showers possible",
    rainLikely: "Rain likely",
    thunderstorms: "Thunderstorms",
  },
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
  moon: {
    cardHeading: "Moon",
    tonightHeading: "Tonight",
    illuminated: "illuminated",
    moonrise: "Moonrise",
    moonset: "Moonset",
    sky: "Sky",
    rain: "Rain",
    visibleLaterTonight: "Visible later tonight",
    belowHorizonTonight: "Moon below the horizon tonight",
    alwaysUpTonight: "Visible all night",
    alwaysDownTonight: "Not visible tonight",
    unknown: "Moonrise and moonset aren't available right now",
    phaseNames: {
      newMoon: "New Moon",
      waxingCrescent: "Waxing Crescent",
      firstQuarter: "First Quarter",
      waxingGibbous: "Waxing Gibbous",
      fullMoon: "Full Moon",
      waningGibbous: "Waning Gibbous",
      lastQuarter: "Last Quarter",
      waningCrescent: "Waning Crescent",
    },
    rainLevels: {
      none: "No rain expected",
      low: "Low chance of rain",
      possible: "Rain possible",
      expected: "Rain expected",
    },
    skyLevels: {
      clear: "Clear",
      mostlyClear: "Mostly clear",
      partlyCloudy: "Partly cloudy",
      cloudy: "Cloudy",
    },
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
      detail: "Quente, seco e com vento — ótimas condições de secagem, continuando no dia seguinte.",
    },
    good: {
      label: "Bom dia para lavar roupa",
      detail: "As condições parecem favoráveis para secar roupa.",
    },
    goodRainWarning: {
      label: "Bom dia — fique de olho na chuva",
      detail: "Há uma boa janela seca, mas {rainWarning}",
    },
    goodButSlowQuality: {
      label: "Bom dia — a secagem pode demorar mais",
      detail: "Fica seco na maior parte, mas frio e úmido pode deixar a secagem mais lenta. O dia seguinte deve ser melhor.",
    },
    goodButSlowRain: {
      label: "Bom dia — conte com dois dias",
      detail: "A chuva deve limitar a secagem, mas as condições melhoram no dia seguinte.",
    },
    goodButSlowBoth: {
      label: "Bom dia — reserve mais tempo",
      detail: "Nenhum dos dois dias é ideal sozinho, então a roupa pode demorar mais que o normal para secar.",
    },
    borderline: {
      label: "Você decide — condições incertas",
      detail: "Os próximos dois dias estão no limite, então a decisão é sua.",
    },
    bad: {
      label: "Dia ruim para lavar roupa",
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
  skyConditions: {
    sunny: "Ensolarado",
    mostlyClear: "Predomínio de sol",
    partlyCloudy: "Parcialmente nublado",
    cloudy: "Nublado",
    showersPossible: "Possibilidade de pancadas",
    rainLikely: "Chuva provável",
    thunderstorms: "Trovoadas",
  },
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
  moon: {
    cardHeading: "Lua",
    tonightHeading: "Hoje à noite",
    illuminated: "iluminada",
    moonrise: "Nascer da lua",
    moonset: "Pôr da lua",
    sky: "Céu",
    rain: "Chuva",
    visibleLaterTonight: "Visível mais tarde hoje à noite",
    belowHorizonTonight: "Lua abaixo do horizonte hoje à noite",
    alwaysUpTonight: "Visível a noite toda",
    alwaysDownTonight: "Não visível hoje à noite",
    unknown: "O nascer e o pôr da lua não estão disponíveis no momento",
    phaseNames: {
      newMoon: "Lua Nova",
      waxingCrescent: "Lua Crescente",
      firstQuarter: "Quarto Crescente",
      waxingGibbous: "Lua Crescente Gibosa",
      fullMoon: "Lua Cheia",
      waningGibbous: "Lua Minguante Gibosa",
      lastQuarter: "Quarto Minguante",
      waningCrescent: "Lua Minguante",
    },
    rainLevels: {
      none: "Sem previsão de chuva",
      low: "Baixa chance de chuva",
      possible: "Chuva possível",
      expected: "Chuva prevista",
    },
    skyLevels: {
      clear: "Céu limpo",
      mostlyClear: "Poucas nuvens",
      partlyCloudy: "Parcialmente nublado",
      cloudy: "Nublado",
    },
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
