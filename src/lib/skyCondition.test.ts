import { describe, it, expect } from "vitest";
import { classifySkyCondition } from "./skyCondition";

function d(weatherCode: number, precipMax: number, sunshineRatio: number) {
  return { weatherCode, precipMax, sunshineRatio };
}

describe("classifySkyCondition", () => {
  it("clear sky, very low rain, high sunshine -> sunny", () => {
    expect(classifySkyCondition(d(0, 5, 0.9))).toBe("sunny");
  });

  it("mainly clear, low rain, decent sunshine -> mostlyClear", () => {
    expect(classifySkyCondition(d(1, 15, 0.5))).toBe("mostlyClear");
  });

  it("weather code 0 but not enough sunshine for sunny falls back to mostlyClear", () => {
    expect(classifySkyCondition(d(0, 10, 0.5))).toBe("mostlyClear");
  });

  it("partly cloudy code with moderate rain chance -> partlyCloudy", () => {
    expect(classifySkyCondition(d(2, 25, 0.3))).toBe("partlyCloudy");
  });

  it("overcast, low sunshine, low rain -> cloudy", () => {
    expect(classifySkyCondition(d(3, 20, 0.1))).toBe("cloudy");
  });

  it("overcast with more sunshine than the cloudy rule allows still falls back to cloudy", () => {
    expect(classifySkyCondition(d(3, 20, 0.4))).toBe("cloudy");
  });

  it("precipitation probability 35-59% -> showersPossible", () => {
    expect(classifySkyCondition(d(2, 40, 0.3))).toBe("showersPossible");
  });

  it("weather code for rain showers -> showersPossible even with low probability", () => {
    expect(classifySkyCondition(d(80, 10, 0.6))).toBe("showersPossible");
  });

  it("precipitation probability >= 60% -> rainLikely", () => {
    expect(classifySkyCondition(d(3, 65, 0.1))).toBe("rainLikely");
  });

  it("weather code for rain/drizzle -> rainLikely even with low probability", () => {
    expect(classifySkyCondition(d(61, 5, 0.5))).toBe("rainLikely");
  });

  it("weather code 95 -> thunderstorms", () => {
    expect(classifySkyCondition(d(95, 10, 0.5))).toBe("thunderstorms");
  });

  it("weather code 99 -> thunderstorms", () => {
    expect(classifySkyCondition(d(99, 0, 0.9))).toBe("thunderstorms");
  });

  it("thunderstorm code overrides everything, even sunny-looking numbers", () => {
    expect(classifySkyCondition(d(96, 5, 0.9))).toBe("thunderstorms");
  });

  describe("boundary values", () => {
    it("precipMax exactly 15% is not sunny (needs < 15%)", () => {
      expect(classifySkyCondition(d(0, 15, 0.9))).not.toBe("sunny");
    });

    it("precipMax just under 15% with weatherCode 0 and enough sun -> sunny", () => {
      expect(classifySkyCondition(d(0, 14.9, 0.65))).toBe("sunny");
    });

    it("sunshineRatio exactly 65% qualifies for sunny", () => {
      expect(classifySkyCondition(d(0, 10, 0.65))).toBe("sunny");
    });

    it("precipMax exactly 20% misses the explicit mostlyClear rule, but the clear-sky fallback still lands there (no coverage gap)", () => {
      expect(classifySkyCondition(d(1, 20, 0.9))).toBe("mostlyClear");
    });

    it("precipMax exactly 30% misses the explicit partlyCloudy rule, but the weatherCode-2 fallback still lands there (no coverage gap)", () => {
      expect(classifySkyCondition(d(2, 30, 0.9))).toBe("partlyCloudy");
    });

    it("precipMax exactly 35% lands in showersPossible, not cloudy", () => {
      expect(classifySkyCondition(d(3, 35, 0.1))).toBe("showersPossible");
    });

    it("precipMax exactly 60% is rainLikely (>= 60%)", () => {
      expect(classifySkyCondition(d(2, 60, 0.1))).toBe("rainLikely");
    });

    it("precipMax exactly 59% (not yet rainLikely) is showersPossible", () => {
      expect(classifySkyCondition(d(2, 59, 0.1))).toBe("showersPossible");
    });

    it("precipMax exactly 35% is not eligible for cloudy's <35% rule but showers still catches it", () => {
      // Confirms showersPossible (35-59%) and cloudy (<35%) don't overlap.
      expect(classifySkyCondition(d(3, 35, 0.1))).toBe("showersPossible");
    });

    it("weatherCode 94 is not a thunderstorm code", () => {
      expect(classifySkyCondition(d(94, 10, 0.5))).not.toBe("thunderstorms");
    });

    it("weatherCode 95 is the lower thunderstorm boundary", () => {
      expect(classifySkyCondition(d(95, 0, 0.9))).toBe("thunderstorms");
    });
  });
});
