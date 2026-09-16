import type { TempUnit } from "../types/weather";
import type { Translations } from "../i18n/translations";

export function cToF(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function formatTemp(celsius: number, unit: TempUnit): number {
  return Math.round(unit === "f" ? cToF(celsius) : celsius);
}

export function formatWind(kmh: number, unit: TempUnit): number {
  return Math.round(unit === "f" ? kmhToMph(kmh) : kmh);
}

export function tempUnitLabel(unit: TempUnit): string {
  return unit === "f" ? "°F" : "°C";
}

export function windUnitLabel(unit: TempUnit): string {
  return unit === "f" ? "mph" : "km/h";
}

export function fmtWeekday(dateStr: string, tag: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(tag, { weekday: "short" });
}

export function dayName(index: number, dateStr: string, t: Translations, tag: string): string {
  if (index === 0) return t.today;
  if (index === 1) return t.tomorrow;
  return fmtWeekday(dateStr, tag);
}

export function fmtHour(iso: string, tag: string): string {
  return new Date(iso).toLocaleTimeString(tag, { hour: "numeric" });
}

export function fmtClock(iso: string, tag: string): string {
  return new Date(iso).toLocaleTimeString(tag, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatHourLabel(hour: number, tag: string): string {
  return new Date(2000, 0, 1, hour).toLocaleTimeString(tag, { hour: "numeric" });
}

export function formatFullDate(dateStr: string, tag: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(tag, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
