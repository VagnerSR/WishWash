import { describe, it, expect } from "vitest";
import { buildWashRecommendation } from "./washVerdict";
import type { DayHourlySlice } from "./hourlySlice";
import type { WashLevel } from "../types/weather";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const flat = (v: number) => HOURS.map(() => v);

function withRain(baseProb: number, baseMm: number, rainHours: number[], rainProb: number, rainMm: number) {
  const precipProbability = HOURS.map((h) => (rainHours.includes(h) ? rainProb : baseProb));
  const precipitation = HOURS.map((h) => (rainHours.includes(h) ? rainMm : baseMm));
  return { precipProbability, precipitation };
}

function day(
  temperature: number[],
  humidity: number[],
  windSpeed: number[],
  cloudCover: number[],
  precipProbability: number[],
  precipitation: number[],
  date = "2026-01-01"
): DayHourlySlice {
  return { date, hours: HOURS, temperature, humidity, windSpeed, cloudCover, precipProbability, precipitation };
}

function expectLevel(day1: DayHourlySlice, day2: DayHourlySlice | null, acceptable: WashLevel[]) {
  const rec = buildWashRecommendation(day1, day2);
  expect(acceptable, `expected one of [${acceptable}], got ${rec.level} (${rec.reasonKind})`).toContain(rec.level);
  return rec;
}

function mediocreDay(rainProb: number, date?: string) {
  const { precipProbability, precipitation } = withRain(rainProb, 0.5, [], 0, 0);
  return day(flat(19), flat(65), flat(9), flat(55), precipProbability, precipitation, date);
}

function goodDay(date?: string) {
  const { precipProbability, precipitation } = withRain(5, 0, [], 0, 0);
  return day(flat(25), flat(45), flat(14), flat(15), precipProbability, precipitation, date);
}

function rainyDay(rainProb: number, date?: string) {
  const { precipProbability, precipitation } = withRain(rainProb, 1.5, [], 0, 0);
  return day(flat(17), flat(85), flat(6), flat(90), precipProbability, precipitation, date);
}

describe("buildWashRecommendation - original scenarios", () => {
  it("excellent both days -> great", () => {
    const { precipProbability, precipitation } = withRain(5, 0, [], 0, 0);
    const day1 = day(flat(24), flat(45), flat(12), flat(20), precipProbability, precipitation);
    const day2 = day(flat(26), flat(40), flat(14), flat(15), precipProbability, precipitation);
    expectLevel(day1, day2, ["great"]);
  });

  it("cloudy but dry -> good", () => {
    const { precipProbability, precipitation } = withRain(5, 0, [], 0, 0);
    const day1 = day(flat(19), flat(55), flat(10), flat(90), precipProbability, precipitation);
    const day2 = day(flat(19), flat(55), flat(10), flat(90), precipProbability, precipitation);
    expectLevel(day1, day2, ["good"]);
  });

  it("sunny with a short (2h) afternoon rain window -> goodWithRainWarning", () => {
    const rainy = withRain(5, 0, [15, 16], 85, 3);
    const clear = withRain(5, 0, [], 0, 0);
    const day1 = day(flat(24), flat(50), flat(10), flat(20), rainy.precipProbability, rainy.precipitation);
    const day2 = day(flat(24), flat(50), flat(10), flat(20), clear.precipProbability, clear.precipitation);
    expectLevel(day1, day2, ["goodWithRainWarning"]);
  });

  it("humid two-day drying -> goodButSlow", () => {
    const { precipProbability, precipitation } = withRain(10, 0.2, [], 0, 0);
    const day1 = day(flat(16), flat(90), flat(5), flat(80), precipProbability, precipitation);
    const day2 = day(flat(21), flat(70), flat(14), flat(50), precipProbability, precipitation);
    expectLevel(day1, day2, ["goodButSlow"]);
  });

  it("rain on day one, excellent day two -> goodButSlow", () => {
    const rainy = withRain(80, 2, [], 0, 0);
    const clear = withRain(5, 0, [], 0, 0);
    const day1 = day(flat(20), flat(85), flat(8), flat(95), rainy.precipProbability, rainy.precipitation);
    const day2 = day(flat(25), flat(50), flat(15), flat(20), clear.precipProbability, clear.precipitation);
    expectLevel(day1, day2, ["goodButSlow"]);
  });

  it("rain both days -> bad or borderline", () => {
    const rainy1 = withRain(80, 2, [], 0, 0);
    const rainy2 = withRain(75, 1.5, [], 0, 0);
    const day1 = day(flat(19), flat(90), flat(6), flat(95), rainy1.precipProbability, rainy1.precipitation);
    const day2 = day(flat(19), flat(88), flat(7), flat(90), rainy2.precipProbability, rainy2.precipitation);
    expectLevel(day1, day2, ["bad", "borderline"]);
  });

  it("low rain but terrible drying conditions -> not a positive category", () => {
    const { precipProbability, precipitation } = withRain(3, 0, [], 0, 0);
    const day1 = day(flat(12), flat(92), flat(3), flat(85), precipProbability, precipitation);
    const day2 = day(flat(12), flat(92), flat(3), flat(85), precipProbability, precipitation);
    expectLevel(day1, day2, ["goodButSlow", "borderline", "bad"]);
  });

  it("short (2h) rain interruption -> good or goodWithRainWarning", () => {
    const rainy = withRain(5, 0, [13, 14], 70, 2);
    const clear = withRain(5, 0, [], 0, 0);
    const day1 = day(flat(23), flat(50), flat(10), flat(30), rainy.precipProbability, rainy.precipitation);
    const day2 = day(flat(23), flat(50), flat(10), flat(30), clear.precipProbability, clear.precipitation);
    expectLevel(day1, day2, ["good", "goodWithRainWarning"]);
  });

  it("persistent scattered rain -> not a positive category", () => {
    const precipProbability = HOURS.map((h) => (h >= 7 && h < 19 ? 45 : 20));
    const precipitation = HOURS.map((h) => (h >= 7 && h < 19 ? 0.6 : 0.2));
    const day1 = day(flat(18), flat(80), flat(8), flat(85), precipProbability, precipitation);
    const day2 = day(flat(18), flat(80), flat(8), flat(85), precipProbability, precipitation);
    expectLevel(day1, day2, ["bad", "borderline"]);
  });
});

describe("buildWashRecommendation - mediocre/rainy-streak regression coverage", () => {
  it("one mediocre day followed by a genuinely good day can still be good", () => {
    expectLevel(mediocreDay(35), goodDay(), ["good", "great", "goodButSlow", "goodWithRainWarning"]);
  });

  it("a genuinely good day followed by a mediocre day can still be good", () => {
    expectLevel(goodDay(), mediocreDay(35), ["good", "great", "goodButSlow", "goodWithRainWarning"]);
  });

  it("two mediocre days (~50/~50 opportunity) do not land on a positive category", () => {
    const rec = expectLevel(mediocreDay(35), mediocreDay(35), ["borderline", "bad"]);
    expect(rec.twoDayDryingOpportunity).toBeGreaterThan(50);
  });

  it("an exact 50/50 opportunity pairing is borderline, not bad outright", () => {
    const rec = expectLevel(mediocreDay(35), mediocreDay(35), ["borderline", "bad"]);
    expect(["borderline", "bad"]).toContain(rec.level);
  });

  it("3 consecutive mediocre/rainy days: every adjacent pairing avoids a positive category", () => {
    const days = [rainyDay(55), rainyDay(58), rainyDay(52)];
    for (let i = 0; i < days.length - 1; i++) {
      expectLevel(days[i], days[i + 1], ["borderline", "bad"]);
    }
  });

  it("5 consecutive mediocre/rainy days: every adjacent pairing avoids a positive category", () => {
    const days = [rainyDay(55), rainyDay(58), rainyDay(52), rainyDay(56), rainyDay(54)];
    for (let i = 0; i < days.length - 1; i++) {
      expectLevel(days[i], days[i + 1], ["borderline", "bad"]);
    }
  });

  it("7 consecutive mediocre/rainy days: every adjacent pairing avoids a positive category", () => {
    const days = [
      rainyDay(55),
      rainyDay(58),
      rainyDay(52),
      rainyDay(56),
      rainyDay(54),
      rainyDay(57),
      rainyDay(53),
    ];
    for (let i = 0; i < days.length - 1; i++) {
      expectLevel(days[i], days[i + 1], ["borderline", "bad"]);
    }
  });

  it("a genuinely strong day still rescues a mediocre day right after it", () => {
    expectLevel(mediocreDay(40), goodDay(), ["good", "great", "goodButSlow", "goodWithRainWarning"]);
  });

  it("a genuinely strong day still rescues a mediocre day right before it", () => {
    expectLevel(goodDay(), mediocreDay(40), ["good", "great", "goodButSlow", "goodWithRainWarning"]);
  });
});
