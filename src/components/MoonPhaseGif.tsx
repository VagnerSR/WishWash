import type { MoonPhaseName } from "../types/weather";

interface MoonPhaseGifProps {
  phaseName: MoonPhaseName;
  size?: number;
}

const GIF_FILE: Record<MoonPhaseName, string> = {
  newMoon: "new-moon",
  waxingCrescent: "waxing-crescent",
  firstQuarter: "first-quarter",
  waxingGibbous: "waxing-gibbous",
  fullMoon: "full-moon",
  waningGibbous: "waning-gibbous",
  lastQuarter: "last-quarter",
  waningCrescent: "waning-crescent",
};

/** Animated pixel-art moon matching the current phase bucket. */
export function MoonPhaseGif({ phaseName, size = 96 }: MoonPhaseGifProps) {
  const src = `${import.meta.env.BASE_URL}moon-phases/${GIF_FILE[phaseName]}-256px.gif`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ imageRendering: "pixelated", width: size, height: size }}
      className="shrink-0 select-none"
    />
  );
}
