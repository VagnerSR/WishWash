import type { SkyCondition, VerdictLevel, WashLevel } from "../types/weather";

export const THEME = {
  paper: "#EEF1EA",
  paperDeep: "#E4E8DF",
  ink: "#20261F",
  inkSoft: "#565E51",
  line: "#C9CFC0",
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
} as const;

interface VerdictStyle {
  bg: string;
  fg: string;
  ring: string;
}

export const VERDICT_STYLE: Record<VerdictLevel, VerdictStyle> = {
  great: { bg: THEME.marigold, fg: "#3D2A08", ring: THEME.marigoldDeep },
  ok: { bg: "#D7D2BE", fg: THEME.ink, ring: THEME.inkSoft },
  careful: { bg: THEME.rust, fg: "#FBEEE6", ring: "#7A3512" },
  bad: { bg: THEME.storm, fg: "#F3F4F1", ring: THEME.stormDeep },
};

export const SKY_CONDITION_STYLE: Record<SkyCondition, VerdictStyle> = {
  sunny: { bg: THEME.marigold, fg: "#3D2A08", ring: THEME.marigoldDeep },
  mostlyClear: { bg: THEME.gold, fg: "#3D2A08", ring: THEME.goldDeep },
  partlyCloudy: { bg: THEME.mist, fg: "#F3F4F1", ring: THEME.mistDeep },
  cloudy: { bg: THEME.storm, fg: "#F3F4F1", ring: THEME.stormDeep },
  showersPossible: { bg: THEME.denim, fg: "#F3F4F1", ring: THEME.denimDeep },
  rainLikely: { bg: THEME.denimDeep, fg: "#F3F4F1", ring: "#15384A" },
  thunderstorms: { bg: THEME.ink, fg: "#F3F4F1", ring: "#0E120D" },
};

export const WASH_LEVEL_STYLE: Record<WashLevel, VerdictStyle> = {
  great: { bg: THEME.marigold, fg: "#3D2A08", ring: THEME.marigoldDeep },
  goodWithRainWarning: { bg: THEME.amber, fg: "#3D2208", ring: THEME.amberDeep },
  good: { bg: THEME.gold, fg: "#3D2A08", ring: THEME.goldDeep },
  goodButSlow: { bg: THEME.sage, fg: THEME.ink, ring: THEME.sageDeep },
  borderline: { bg: THEME.mist, fg: THEME.ink, ring: THEME.mistDeep },
  bad: { bg: THEME.storm, fg: "#F3F4F1", ring: THEME.stormDeep },
};
