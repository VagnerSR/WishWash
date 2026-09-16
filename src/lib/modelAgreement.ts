import type { ModelDayReading, ModelId } from "../hooks/useModelComparison";
import { hourRisk } from "./precipitationRisk";

export type AgreementLevel = "strong" | "moderate" | "disagreement";

export interface ModelScoreSummary {
  model: ModelId;
  score: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  precipitationHours: number;
}

export interface ModelAgreement {
  level: AgreementLevel;
  modelScores: ModelScoreSummary[];
  averageScore: number;
  spread: number;
  profileDisagreement: number;
  driestModel: ModelId;
  wettestModel: ModelId;
}

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;
const DRY_RISK_THRESHOLD = 0.25;
const PROFILE_SMOOTHING_RADIUS_HOURS = 2;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function isDaytimeHour(hour: number): boolean {
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
}

function calculateDryWindow(hoursOfDay: number[], risks: number[]): number {
  let longest = 0;
  let current = 0;
  for (let i = 0; i < risks.length; i++) {
    const dry = isDaytimeHour(hoursOfDay[i]) && risks[i] < DRY_RISK_THRESHOLD;
    if (dry) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

function calculateModelLaundryScore(reading: ModelDayReading, risks: number[]): number {
  const hours = risks.length;
  if (hours === 0) return 50;

  let weightedRiskSum = 0;
  let weightSum = 0;
  for (let i = 0; i < hours; i++) {
    const weight = isDaytimeHour(reading.hourlyLocalHour[i]) ? 2 : 1;
    weightedRiskSum += risks[i] * weight;
    weightSum += weight;
  }
  const averageRisk = weightSum > 0 ? weightedRiskSum / weightSum : 0;

  const daytimeHourCount = Math.max(1, reading.hourlyLocalHour.filter(isDaytimeHour).length);
  const dryWindowFactor = clamp01(calculateDryWindow(reading.hourlyLocalHour, risks) / daytimeHourCount);

  const riskScore = (1 - averageRisk) * 100;
  const windowScore = dryWindowFactor * 100;
  return Math.round(clamp(0.55 * riskScore + 0.45 * windowScore, 0, 100));
}

function smoothRiskProfile(risks: number[]): number[] {
  return risks.map((_, i) => {
    const start = Math.max(0, i - PROFILE_SMOOTHING_RADIUS_HOURS);
    const end = Math.min(risks.length - 1, i + PROFILE_SMOOTHING_RADIUS_HOURS);
    let sum = 0;
    for (let j = start; j <= end; j++) sum += risks[j];
    return sum / (end - start + 1);
  });
}

function meanAbsoluteDifference(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;
  let total = 0;
  for (let i = 0; i < length; i++) total += Math.abs(a[i] - b[i]);
  return total / length;
}

function calculateProfileDisagreement(riskProfiles: number[][]): number {
  const smoothed = riskProfiles.map(smoothRiskProfile);
  if (smoothed.length < 2) return 0;

  let totalDiff = 0;
  let pairs = 0;
  for (let i = 0; i < smoothed.length; i++) {
    for (let j = i + 1; j < smoothed.length; j++) {
      totalDiff += meanAbsoluteDifference(smoothed[i], smoothed[j]);
      pairs += 1;
    }
  }
  const averagePairDiff = pairs > 0 ? totalDiff / pairs : 0;
  return Math.round(clamp01(averagePairDiff) * 100);
}

export function agreementFor(readings: ModelDayReading[]): ModelAgreement | null {
  if (readings.length < 2) return null;

  const perModel = readings.map((reading) => {
    const risks = reading.hourlyPrecipProbability.map((prob, i) =>
      hourRisk(prob, reading.hourlyPrecipitation[i] ?? 0)
    );
    return {
      model: reading.model,
      score: calculateModelLaundryScore(reading, risks),
      precipitationProbabilityMax: reading.precipProbabilityMax,
      precipitationSum: reading.precipitationSum,
      precipitationHours: reading.precipitationHours,
      risks,
    };
  });

  const scores = perModel.map((m) => m.score);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const spread = Math.max(...scores) - Math.min(...scores);

  const profileDisagreement = calculateProfileDisagreement(perModel.map((m) => m.risks));

  const effectiveSpread = Math.max(spread, profileDisagreement);

  const level: AgreementLevel =
    effectiveSpread <= 10 ? "strong" : effectiveSpread <= 25 ? "moderate" : "disagreement";

  const driest = perModel.reduce((best, cur) => (cur.score > best.score ? cur : best));
  const wettest = perModel.reduce((worst, cur) => (cur.score < worst.score ? cur : worst));

  const result: ModelAgreement = {
    level,
    modelScores: perModel.map(
      ({ model, score, precipitationProbabilityMax, precipitationSum, precipitationHours }) => ({
        model,
        score,
        precipitationProbabilityMax,
        precipitationSum,
        precipitationHours,
      })
    ),
    averageScore: Math.round(averageScore),
    spread: Math.round(spread),
    profileDisagreement,
    driestModel: driest.model,
    wettestModel: wettest.model,
  };

  console.debug("[WishWash] model agreement", {
    tomorrow: readings[0]?.date,
    models: result.modelScores.map((m) => ({
      model: m.model,
      precipitationProbabilityMax: m.precipitationProbabilityMax,
      precipitationSum: m.precipitationSum,
      precipitationHours: m.precipitationHours,
      score: m.score,
    })),
    level: result.level,
    spread: result.spread,
    profileDisagreement: result.profileDisagreement,
  });

  return result;
}
