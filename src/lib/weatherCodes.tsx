import type { LucideIcon } from "lucide-react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

export interface CodeInfo {
  label: string;
  Icon: LucideIcon;
  bad: boolean;
}

const TABLE: Record<number, CodeInfo> = {
  0: { label: "Clear sky", Icon: Sun, bad: false },
  1: { label: "Mostly clear", Icon: Sun, bad: false },
  2: { label: "Partly cloudy", Icon: CloudSun, bad: false },
  3: { label: "Overcast", Icon: Cloud, bad: false },
  45: { label: "Foggy", Icon: CloudFog, bad: true },
  48: { label: "Foggy", Icon: CloudFog, bad: true },
  51: { label: "Light drizzle", Icon: CloudDrizzle, bad: true },
  53: { label: "Drizzle", Icon: CloudDrizzle, bad: true },
  55: { label: "Heavy drizzle", Icon: CloudDrizzle, bad: true },
  56: { label: "Freezing drizzle", Icon: CloudDrizzle, bad: true },
  57: { label: "Freezing drizzle", Icon: CloudDrizzle, bad: true },
  61: { label: "Light rain", Icon: CloudRain, bad: true },
  63: { label: "Rain", Icon: CloudRain, bad: true },
  65: { label: "Heavy rain", Icon: CloudRain, bad: true },
  66: { label: "Freezing rain", Icon: CloudRain, bad: true },
  67: { label: "Freezing rain", Icon: CloudRain, bad: true },
  71: { label: "Light snow", Icon: CloudSnow, bad: true },
  73: { label: "Snow", Icon: CloudSnow, bad: true },
  75: { label: "Heavy snow", Icon: CloudSnow, bad: true },
  77: { label: "Snow grains", Icon: CloudSnow, bad: true },
  80: { label: "Rain showers", Icon: CloudRain, bad: true },
  81: { label: "Rain showers", Icon: CloudRain, bad: true },
  82: { label: "Violent showers", Icon: CloudRain, bad: true },
  85: { label: "Snow showers", Icon: CloudSnow, bad: true },
  86: { label: "Snow showers", Icon: CloudSnow, bad: true },
  95: { label: "Thunderstorm", Icon: CloudLightning, bad: true },
  96: { label: "Thunderstorm", Icon: CloudLightning, bad: true },
  99: { label: "Thunderstorm", Icon: CloudLightning, bad: true },
};

export function codeInfo(code: number): CodeInfo {
  return TABLE[code] ?? { label: "Unknown", Icon: Cloud, bad: false };
}
