import { hourRisk } from "./precipitationRisk";
import type { DayHourlySlice } from "./hourlySlice";
import type { DayAfterNoteKind, DayForecast, RainWarning, Verdict, WashRecommendation, WashReasonKind } from "../types/weather";

type VerdictInput = Pick<DayForecast, "weatherCode" | "precipMax" | "sunshineRatio">;

function dayVerdict({ weatherCode, precipMax, sunshineRatio }: VerdictInput): Verdict {
  if (precipMax >= 55) {
    return { level: "bad", kind: "keepInside" };
  }
  if (weatherCode <= 1 && precipMax < 20 && sunshineRatio >= 0.55) {
    return { level: "great", kind: "greatDrying" };
  }
  if (precipMax < 35) {
    return { level: "ok", kind: "okTomorrow" };
  }
  return { level: "bad", kind: "keepInside" };
}

export function washVerdict(input: VerdictInput): Verdict {
  return dayVerdict(input);
}

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;
const DRY_RISK_THRESHOLD = 0.25;
const RAIN_WARNING_THRESHOLD = 0.4;

const DAY_AFTER_RAIN_WEIGHT = 0.7;

const OPPORTUNITY_WINDOW_NORMALIZER = 12;

const MIN_MEANINGFUL_WINDOW_HOURS = 7;

const DRYING_LIKELY_TWO_DAYS_THRESHOLD = 62;
const GOOD_BUT_SLOW_MIN_OPPORTUNITY = 60;
const LONG_RAIN_WARNING_HOURS = 6;
const REASON_IMPROVEMENT_MARGIN = 10;

const BAD_THRESHOLD = 20;
const BORDERLINE_THRESHOLD = 35;
const CONVINCING_DAY_THRESHOLD = 60;
const CONVINCING_GATE_BAD_CUTOFF = 70;
const GREAT_THRESHOLD = 80;

const GREAT_QUALITY_MIN = 55;

const OPPORTUNITY_QUALITY_WEIGHT = 0.6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function isDaytimeHour(hour: number): boolean {
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
}

function qualityHour(tempC: number, relativeHumidityPct: number, windKmh: number, cloudCoverPct: number): number {
  const tempFactor = clamp01((tempC - 5) / 25);
  const humidityFactor = clamp01((85 - relativeHumidityPct) / 60);
  const windFactor = clamp01(windKmh / 15);
  const sunFactor = clamp01((100 - cloudCoverPct) / 100);
  return clamp01(0.35 * tempFactor + 0.35 * humidityFactor + 0.15 * windFactor + 0.15 * sunFactor);
}

interface DryWindowResult {
  longestWindowHours: number;
  totalOpportunity: number;
}

function calculateDryWindow(risks: number[]): DryWindowResult {
  let longest = 0;
  let current = 0;
  let totalOpportunity = 0;
  for (const risk of risks) {
    const hourValue = 1 - risk;
    totalOpportunity += hourValue;
    if (risk < DRY_RISK_THRESHOLD) {
      current += hourValue;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return { longestWindowHours: Math.round(longest), totalOpportunity };
}

function rainTimeOpportunityScore(longestWindowHours: number, totalOpportunity: number): number {
  const windowFactor = clamp01(longestWindowHours / OPPORTUNITY_WINDOW_NORMALIZER);
  const coverageFactor = clamp01(totalOpportunity / 24);
  return Math.round(100 * (0.6 * windowFactor + 0.4 * coverageFactor));
}

function dayQualityScore(qualities: number[], hoursOfDay: number[]): number {
  let weightedSum = 0;
  let weightSum = 0;
  for (let i = 0; i < qualities.length; i++) {
    const weight = isDaytimeHour(hoursOfDay[i]) ? 2 : 1;
    weightedSum += qualities[i] * weight;
    weightSum += weight;
  }
  return weightSum > 0 ? Math.round(100 * (weightedSum / weightSum)) : 50;
}

function effectiveDayOpportunity(rainTimeScore: number, qualityScore: number): number {
  return Math.round(
    clamp((1 - OPPORTUNITY_QUALITY_WEIGHT) * rainTimeScore + OPPORTUNITY_QUALITY_WEIGHT * qualityScore, 0, 100)
  );
}

function rainSafety48h(risks1: number[], hours1: number[], risks2: number[], hours2: number[]): number {
  let weightedSum = 0;
  let weightSum = 0;
  for (let i = 0; i < risks1.length; i++) {
    const weight = (isDaytimeHour(hours1[i]) ? 2 : 1) * 1.0;
    weightedSum += risks1[i] * weight;
    weightSum += weight;
  }
  for (let i = 0; i < risks2.length; i++) {
    const weight = (isDaytimeHour(hours2[i]) ? 2 : 1) * DAY_AFTER_RAIN_WEIGHT;
    weightedSum += risks2[i] * weight;
    weightSum += weight;
  }
  const averageRisk = weightSum > 0 ? weightedSum / weightSum : 0;
  return Math.round(100 * (1 - averageRisk));
}

function twoDayDryingOpportunity(tomorrowOpportunity: number, dayAfterOpportunity: number): number {
  return Math.round(100 * (1 - (1 - tomorrowOpportunity / 100) * (1 - dayAfterOpportunity / 100)));
}

function findRainWarningWindow(risks: number[], hoursOfDay: number[]): RainWarning | null {
  let longestRun = 0;
  let currentRun = 0;
  let currentStart = -1;
  let bestStart = -1;
  let bestEnd = -1;
  for (let i = 0; i < risks.length; i++) {
    if (risks[i] >= RAIN_WARNING_THRESHOLD) {
      if (currentStart === -1) currentStart = i;
      currentRun += 1;
      if (currentRun > longestRun) {
        longestRun = currentRun;
        bestStart = currentStart;
        bestEnd = i;
      }
    } else {
      currentStart = -1;
      currentRun = 0;
    }
  }
  if (longestRun === 0 || bestStart === -1) return null;
  return { startHour: hoursOfDay[bestStart], endHour: hoursOfDay[bestEnd] };
}

interface LevelInput {
  laundryScore: number;
  dryingQuality: number;
  twoDayOpportunity: number;
  tomorrowOpportunity: number;
  dayAfterOpportunity: number;
  dryingLikelyTakesTwoDays: boolean;
  hasRainWarning: boolean;
  rainWarningHours: number;
  longestDryWindowTomorrow: number;
  longestDryWindowDayAfter: number;
}

function decideLevel(input: LevelInput): { level: WashRecommendation["level"]; reasonKind: WashReasonKind } {
  const {
    laundryScore,
    dryingQuality,
    twoDayOpportunity,
    tomorrowOpportunity,
    dayAfterOpportunity,
    dryingLikelyTakesTwoDays,
    hasRainWarning,
    rainWarningHours,
    longestDryWindowTomorrow,
    longestDryWindowDayAfter,
  } = input;

  const noMeaningfulWindowEitherDay =
    longestDryWindowTomorrow < MIN_MEANINGFUL_WINDOW_HOURS && longestDryWindowDayAfter < MIN_MEANINGFUL_WINDOW_HOURS;

  if (noMeaningfulWindowEitherDay) {
    return twoDayOpportunity < CONVINCING_GATE_BAD_CUTOFF
      ? { level: "bad", reasonKind: "bad" }
      : { level: "borderline", reasonKind: "borderline" };
  }

  if (twoDayOpportunity < BAD_THRESHOLD) {
    return { level: "bad", reasonKind: "bad" };
  }

  if (twoDayOpportunity < BORDERLINE_THRESHOLD) {
    return { level: "borderline", reasonKind: "borderline" };
  }

  const hasConvincingDay = Math.max(tomorrowOpportunity, dayAfterOpportunity) >= CONVINCING_DAY_THRESHOLD;

  if (!hasConvincingDay) {
    return twoDayOpportunity < CONVINCING_GATE_BAD_CUTOFF
      ? { level: "bad", reasonKind: "bad" }
      : { level: "borderline", reasonKind: "borderline" };
  }

  const rainDominatesDay = rainWarningHours >= LONG_RAIN_WARNING_HOURS;

  if (dryingLikelyTakesTwoDays || rainDominatesDay) {
    if (twoDayOpportunity < GOOD_BUT_SLOW_MIN_OPPORTUNITY) {
      return { level: "borderline", reasonKind: "borderline" };
    }
    const dayAfterMeaningfullyBetter = dayAfterOpportunity >= tomorrowOpportunity + REASON_IMPROVEMENT_MARGIN;
    let reasonKind: WashReasonKind;
    if (!dayAfterMeaningfullyBetter) {
      reasonKind = "goodButSlowBoth";
    } else {
      reasonKind = rainDominatesDay || longestDryWindowTomorrow < 10 ? "goodButSlowRain" : "goodButSlowQuality";
    }
    return { level: "goodButSlow", reasonKind };
  }

  if (hasRainWarning) {
    return { level: "goodWithRainWarning", reasonKind: "goodRainWarning" };
  }

  if (laundryScore >= GREAT_THRESHOLD && dryingQuality >= GREAT_QUALITY_MIN) {
    return { level: "great", reasonKind: "excellent" };
  }

  return { level: "good", reasonKind: "good" };
}

function analyzeDay(day: DayHourlySlice) {
  const risks = day.precipProbability.map((prob, i) => hourRisk(prob, day.precipitation[i] ?? 0));
  const qualities = day.hours.map((_, i) =>
    qualityHour(day.temperature[i], day.humidity[i], day.windSpeed[i], day.cloudCover[i])
  );
  const window = calculateDryWindow(risks);
  const rainTimeScore = rainTimeOpportunityScore(window.longestWindowHours, window.totalOpportunity);
  const quality = dayQualityScore(qualities, day.hours);
  const opportunity = effectiveDayOpportunity(rainTimeScore, quality);
  return { risks, quality, opportunity, longestWindowHours: window.longestWindowHours };
}

export function buildWashRecommendation(tomorrow: DayHourlySlice, dayAfter: DayHourlySlice | null): WashRecommendation {
  const day1 = analyzeDay(tomorrow);
  const day2 = dayAfter ? analyzeDay(dayAfter) : null;

  const tomorrowOpportunity = day1.opportunity;
  const dayAfterOpportunity = day2 ? day2.opportunity : tomorrowOpportunity;
  const longestDryWindowDayAfter = day2 ? day2.longestWindowHours : 0;
  const dryingQualityDayAfter = day2 ? day2.quality : day1.quality;

  const twoDayOpportunity = twoDayDryingOpportunity(tomorrowOpportunity, dayAfterOpportunity);
  const rainSafety = rainSafety48h(day1.risks, tomorrow.hours, day2 ? day2.risks : [], dayAfter ? dayAfter.hours : []);
  const dryingQuality = Math.round((day1.quality + dryingQualityDayAfter) / 2);
  const dryingOpportunity = Math.round(0.4 * tomorrowOpportunity + 0.6 * twoDayOpportunity);
  const laundryScore = Math.round(clamp(0.45 * rainSafety + 0.35 * dryingOpportunity + 0.2 * dryingQuality, 0, 100));

  const dryingLikelyTakesTwoDays = tomorrowOpportunity < DRYING_LIKELY_TWO_DAYS_THRESHOLD;
  const rainWarning = findRainWarningWindow(day1.risks, tomorrow.hours);
  const rainWarningHours = rainWarning ? rainWarning.endHour - rainWarning.startHour + 1 : 0;

  const { level, reasonKind } = decideLevel({
    laundryScore,
    dryingQuality,
    twoDayOpportunity,
    tomorrowOpportunity,
    dayAfterOpportunity,
    dryingLikelyTakesTwoDays,
    hasRainWarning: rainWarning !== null,
    rainWarningHours,
    longestDryWindowTomorrow: day1.longestWindowHours,
    longestDryWindowDayAfter,
  });

  let dayAfterNote: DayAfterNoteKind | null = null;
  let dayAfterRainWarning: RainWarning | null = null;
  if ((level === "great" || level === "good") && dayAfter && day2) {
    const day2RainWarning = findRainWarningWindow(day2.risks, dayAfter.hours);
    if (day2RainWarning) {
      dayAfterNote = "rainWarning";
      dayAfterRainWarning = day2RainWarning;
    } else if (dayAfterOpportunity >= DRYING_LIKELY_TWO_DAYS_THRESHOLD) {
      dayAfterNote = "goodTwoDays";
    }
  }

  const result: WashRecommendation = {
    level,
    reasonKind,
    laundryScore,
    rainSafety,
    dryingOpportunity,
    dryingQuality,
    tomorrowOpportunity,
    dayAfterOpportunity,
    twoDayDryingOpportunity: twoDayOpportunity,
    longestDryWindowTomorrow: day1.longestWindowHours,
    longestDryWindowDayAfter,
    rainWarning,
    dryingLikelyTakesTwoDays,
    dayAfterNote,
    dayAfterRainWarning,
  };

  console.debug("[WishWash] wash recommendation", {
    tomorrow: tomorrow.date,
    dayAfterTomorrow: dayAfter?.date ?? null,
    rainSafety: result.rainSafety,
    dryingOpportunity: result.dryingOpportunity,
    dryingQuality: result.dryingQuality,
    tomorrowOpportunity: result.tomorrowOpportunity,
    dayAfterOpportunity: result.dayAfterOpportunity,
    twoDayDryingOpportunity: result.twoDayDryingOpportunity,
    longestDryWindowTomorrow: result.longestDryWindowTomorrow,
    longestDryWindowDayAfter: result.longestDryWindowDayAfter,
    dryingLikelyTakesTwoDays: result.dryingLikelyTakesTwoDays,
    rainWarning: result.rainWarning,
    rainWarningHours,
    dayAfterNote: result.dayAfterNote,
    dayAfterRainWarning: result.dayAfterRainWarning,
    laundryScore: result.laundryScore,
    level: result.level,
  });

  return result;
}
