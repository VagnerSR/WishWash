import type { VerdictLevel } from "../types/weather";

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
