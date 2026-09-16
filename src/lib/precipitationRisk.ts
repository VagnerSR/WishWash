function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function hourRisk(probabilityPct: number, amountMm: number): number {
  const probFactor = clamp01(probabilityPct / 100);
  const amountFactor = clamp01(amountMm / 2);
  return clamp01(0.6 * probFactor + 0.4 * amountFactor);
}
