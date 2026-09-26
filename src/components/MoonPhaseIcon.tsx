import { useId } from "react";
import { THEME } from "../lib/theme";

interface MoonPhaseIconProps {
  /** Continuous 0..1 cycle position: 0/1 = new moon, 0.5 = full moon. */
  phase: number;
  size?: number;
}

const LIT = THEME.gold;
const LIT_SHADE = THEME.goldDeep;
const DARK = THEME.stormDeep;

/**
 * Builds the SVG path for the lit portion of the moon disc using the
 * standard "half-circle + terminator ellipse" construction: the outer edge
 * is always a semicircle, and the terminator is a half-ellipse whose
 * horizontal radius shrinks to 0 at the quarters and grows back to full
 * radius at new/full moon (where the sweep flag flips to fill vs. empty
 * the whole disc).
 */
function litPath(cx: number, cy: number, r: number, phase: number): string | null {
  const p = ((phase % 1) + 1) % 1;
  const theta = p * 2 * Math.PI;
  const cosTheta = Math.cos(theta);
  const rx = r * Math.abs(cosTheta);

  // New moon and full moon are exact degenerate cases — handle directly
  // rather than relying on floating point to land exactly on them.
  if (p < 0.001 || p > 0.999) return null; // new moon: nothing lit
  if (Math.abs(p - 0.5) < 0.001) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`; // full circle
  }

  const waxing = p < 0.5;
  const outerSweep = waxing ? 1 : 0;
  const crescent = cosTheta > 0; // true for waxing/waning crescent, false for gibbous
  const terminatorSweep = crescent ? outerSweep : 1 - outerSweep;

  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r} Z`;
}

export function MoonPhaseIcon({ phase, size = 96 }: MoonPhaseIconProps) {
  const cx = 50;
  const cy = 50;
  const r = 44;
  // Strip colons: some browsers mishandle url(#id) references whose id
  // contains them, and React's useId() includes colons by default.
  const uid = useId().replace(/:/g, "");
  const path = litPath(cx, cy, r, phase);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-lit`} cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FBEFC8" />
          <stop offset="55%" stopColor={LIT} />
          <stop offset="100%" stopColor={LIT_SHADE} />
        </radialGradient>
        <radialGradient id={`${uid}-dark`} cx="42%" cy="38%" r="80%">
          <stop offset="0%" stopColor="#4B5462" />
          <stop offset="100%" stopColor={DARK} />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Base disc: the dark, unlit side of the moon. */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-dark)`} />

      {/* Lit portion, following the true terminator curve for this phase. */}
      {path && (
        <g clipPath={`url(#${uid}-clip)`}>
          <path d={path} fill={`url(#${uid}-lit)`} />
        </g>
      )}

      {/* A handful of soft craters for texture, clipped to the disc. */}
      <g clipPath={`url(#${uid}-clip)`} opacity={0.16}>
        <circle cx={cx - 12} cy={cy - 10} r={6} fill={DARK} />
        <circle cx={cx + 14} cy={cy + 4} r={4.5} fill={DARK} />
        <circle cx={cx - 4} cy={cy + 16} r={3.5} fill={DARK} />
        <circle cx={cx + 6} cy={cy - 18} r={3} fill={DARK} />
      </g>

      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LIT_SHADE} strokeWidth={1} opacity={0.3} />
    </svg>
  );
}
