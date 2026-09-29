import React from "react";
import { useTheme } from "../theme/ThemeContext";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  const { THEME, isPixel, shadow, font } = useTheme();

  return (
    <div
      style={{ background: THEME.card, borderColor: THEME.edge, boxShadow: shadow(4) }}
      className={isPixel ? "border-4 px-4 py-3 flex flex-col gap-2" : "rounded-2xl border px-4 py-3 flex flex-col gap-2"}
    >
      <div className="flex items-center gap-2" style={{ color: THEME.inkSoft }}>
        {icon}
        <span className={isPixel ? "text-sm" : "text-xs"}>{label}</span>
      </div>
      <div style={{ fontFamily: font.mono }} className="text-lg">
        {value}
      </div>
    </div>
  );
}
