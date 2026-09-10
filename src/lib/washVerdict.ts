import type { DayForecast, Verdict } from "../types/weather";

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

export function planAheadVerdict(tomorrow: VerdictInput, dayAfter?: VerdictInput): Verdict {
  const vTomorrow = dayVerdict(tomorrow);

  if (vTomorrow.level === "bad") {
    return { level: "bad", kind: "keepInside" };
  }

  if (vTomorrow.level === "great") {
    return { level: "great", kind: "greatDrying" };
  }

  const vDayAfter = dayAfter ? dayVerdict(dayAfter) : null;

  if (vDayAfter?.level === "bad") {
    return { level: "careful", kind: "careful" };
  }

  if (vDayAfter) {
    return { level: "great", kind: "goodTwoDays" };
  }

  return { level: "ok", kind: "okTomorrow" };
}
