import type { ModelDayReading } from "../hooks/useModelComparison";

export type AgreementLevel = "dry" | "wet" | "mixed";

export interface Agreement {
  level: AgreementLevel;
  dryCount: number;
  total: number;
}

function isDry(reading: ModelDayReading): boolean {
  return reading.precipMax < 40;
}

export function agreementFor(readings: ModelDayReading[]): Agreement | null {
  if (readings.length === 0) return null;
  const dryCount = readings.filter(isDry).length;
  const total = readings.length;
  const level: AgreementLevel = dryCount === total ? "dry" : dryCount === 0 ? "wet" : "mixed";
  return { level, dryCount, total };
}
