import React from "react";
import { THEME } from "../lib/theme";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div
      style={{ background: THEME.card, borderColor: THEME.line }}
      className="rounded-2xl border px-4 py-3 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2" style={{ color: THEME.inkSoft }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-lg">
        {value}
      </div>
    </div>
  );
}
