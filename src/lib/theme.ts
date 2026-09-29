import type { SkyCondition, VerdictLevel, WashLevel } from "../types/weather";

export type ThemeMode = "classic" | "pixel";

export interface Palette {
  paper: string;
  paperDeep: string;
  ink: string;
  inkSoft: string;
  line: string;
  /** Card/box outline. Same as `line` in the classic theme, deep navy in 8-bit. */
  edge: string;
  denim: string;
  denimDeep: string;
  marigold: string;
  marigoldDeep: string;
  storm: string;
  stormDeep: string;
  rust: string;
  card: string;
  sage: string;
  sageDeep: string;
  gold: string;
  goldDeep: string;
  amber: string;
  amberDeep: string;
  mist: string;
  mistDeep: string;
}

/** The original look. */
export const CLASSIC_PALETTE: Palette = {
  paper: "#EEF1EA",
  paperDeep: "#E4E8DF",
  ink: "#20261F",
  inkSoft: "#565E51",
  line: "#C9CFC0",
  edge: "#C9CFC0",
  denim: "#2E6A88",
  denimDeep: "#1F4E67",
  marigold: "#E0A238",
  marigoldDeep: "#8C5F14",
  storm: "#6C7686",
  stormDeep: "#3F4652",
  rust: "#B4501E",
  card: "#F7F8F3",
  sage: "#7C9690",
  sageDeep: "#4F6B65",
  gold: "#C7A542",
  goldDeep: "#8C7420",
  amber: "#D98B3D",
  amberDeep: "#8C5A1F",
  mist: "#8B8F87",
  mistDeep: "#5E6259",
};

/** 8-bit look: palette pulled from the pixel-art logo. */
export const PIXEL_PALETTE: Palette = {
  paper: "#DCEBFA",
  paperDeep: "#C4DDF5",
  ink: "#1B2440",
  inkSoft: "#44507A",
  line: "#8FA9CF",
  edge: "#1B2440",
  denim: "#2F7FD0",
  denimDeep: "#1D4E8F",
  marigold: "#FFD21F",
  marigoldDeep: "#E08F00",
  storm: "#56648A",
  stormDeep: "#232B4D",
  rust: "#D9531E",
  card: "#FFFFFF",
  sage: "#7CC4A0",
  sageDeep: "#2F7A5B",
  gold: "#F7B500",
  goldDeep: "#B88700",
  amber: "#F08A24",
  amberDeep: "#B85A10",
  mist: "#8FA3C4",
  mistDeep: "#4A5E85",
};

/** Kept for code that doesn't need to react to the theme switch. */
export const THEME = CLASSIC_PALETTE;

export interface VerdictStyle {
  bg: string;
  fg: string;
  ring: string;
}

export interface StyleMaps {
  VERDICT_STYLE: Record<VerdictLevel, VerdictStyle>;
  SKY_CONDITION_STYLE: Record<SkyCondition, VerdictStyle>;
  WASH_LEVEL_STYLE: Record<WashLevel, VerdictStyle>;
}

function classicStyles(p: Palette): StyleMaps {
  return {
    VERDICT_STYLE: {
      great: { bg: p.marigold, fg: "#3D2A08", ring: p.marigoldDeep },
      ok: { bg: "#D7D2BE", fg: p.ink, ring: p.inkSoft },
      careful: { bg: p.rust, fg: "#FBEEE6", ring: "#7A3512" },
      bad: { bg: p.storm, fg: "#F3F4F1", ring: p.stormDeep },
    },
    SKY_CONDITION_STYLE: {
      sunny: { bg: p.marigold, fg: "#3D2A08", ring: p.marigoldDeep },
      mostlyClear: { bg: p.gold, fg: "#3D2A08", ring: p.goldDeep },
      partlyCloudy: { bg: p.mist, fg: "#F3F4F1", ring: p.mistDeep },
      cloudy: { bg: p.storm, fg: "#F3F4F1", ring: p.stormDeep },
      showersPossible: { bg: p.denim, fg: "#F3F4F1", ring: p.denimDeep },
      rainLikely: { bg: p.denimDeep, fg: "#F3F4F1", ring: "#15384A" },
      thunderstorms: { bg: p.ink, fg: "#F3F4F1", ring: "#0E120D" },
    },
    WASH_LEVEL_STYLE: {
      great: { bg: p.marigold, fg: "#3D2A08", ring: p.marigoldDeep },
      goodWithRainWarning: { bg: p.amber, fg: "#3D2208", ring: p.amberDeep },
      good: { bg: p.gold, fg: "#3D2A08", ring: p.goldDeep },
      goodButSlow: { bg: p.sage, fg: p.ink, ring: p.sageDeep },
      borderline: { bg: p.mist, fg: p.ink, ring: p.mistDeep },
      bad: { bg: p.storm, fg: "#F3F4F1", ring: p.stormDeep },
    },
  };
}

function pixelStyles(p: Palette): StyleMaps {
  return {
    VERDICT_STYLE: {
      great: { bg: p.marigold, fg: p.ink, ring: p.marigoldDeep },
      ok: { bg: "#E6E1C4", fg: p.ink, ring: p.inkSoft },
      careful: { bg: p.rust, fg: "#FFF1E8", ring: "#7A3512" },
      bad: { bg: p.storm, fg: "#FFFFFF", ring: p.stormDeep },
    },
    SKY_CONDITION_STYLE: {
      sunny: { bg: p.marigold, fg: p.ink, ring: p.marigoldDeep },
      mostlyClear: { bg: p.gold, fg: p.ink, ring: p.goldDeep },
      partlyCloudy: { bg: p.mist, fg: p.ink, ring: p.mistDeep },
      cloudy: { bg: p.storm, fg: "#FFFFFF", ring: p.stormDeep },
      showersPossible: { bg: p.denim, fg: "#FFFFFF", ring: p.denimDeep },
      rainLikely: { bg: p.denimDeep, fg: "#FFFFFF", ring: "#15386A" },
      thunderstorms: { bg: p.ink, fg: "#FFFFFF", ring: "#0E1224" },
    },
    WASH_LEVEL_STYLE: {
      great: { bg: p.marigold, fg: p.ink, ring: p.marigoldDeep },
      goodWithRainWarning: { bg: p.amber, fg: p.ink, ring: p.amberDeep },
      good: { bg: p.gold, fg: p.ink, ring: p.goldDeep },
      goodButSlow: { bg: p.sage, fg: p.ink, ring: p.sageDeep },
      borderline: { bg: p.mist, fg: p.ink, ring: p.mistDeep },
      bad: { bg: p.storm, fg: "#FFFFFF", ring: p.stormDeep },
    },
  };
}

const PIXEL_DISPLAY = "'Silkscreen', 'Pixelify Sans', monospace";

export interface ThemeTokens extends StyleMaps {
  mode: ThemeMode;
  isPixel: boolean;
  THEME: Palette;
  font: { body: string; display: string; mono: string };
  headingWeight: number;
  /** Hard, blur-free drop shadow in 8-bit; nothing in the classic theme. */
  shadow: (size?: number, color?: string) => string | undefined;
}

export function buildTheme(mode: ThemeMode): ThemeTokens {
  if (mode === "pixel") {
    return {
      mode,
      isPixel: true,
      THEME: PIXEL_PALETTE,
      ...pixelStyles(PIXEL_PALETTE),
      font: { body: "'Pixelify Sans', monospace", display: PIXEL_DISPLAY, mono: PIXEL_DISPLAY },
      headingWeight: 700,
      shadow: (size = 6, color = PIXEL_PALETTE.edge) => `${size}px ${size}px 0 0 ${color}`,
    };
  }
  return {
    mode,
    isPixel: false,
    THEME: CLASSIC_PALETTE,
    ...classicStyles(CLASSIC_PALETTE),
    font: { body: "'Inter', sans-serif", display: "'Fraunces', serif", mono: "'IBM Plex Mono', monospace" },
    headingWeight: 600,
    shadow: () => undefined,
  };
}

// Back-compat exports (classic values) for anything that isn't theme-aware.
export const { VERDICT_STYLE, SKY_CONDITION_STYLE, WASH_LEVEL_STYLE } = classicStyles(CLASSIC_PALETTE);
