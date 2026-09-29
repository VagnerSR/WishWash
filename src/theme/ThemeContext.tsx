import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildTheme, type ThemeMode, type ThemeTokens } from "../lib/theme";

const STORAGE_KEY = "wishwash:theme";
const PIXEL_FONTS_ID = "wishwash-pixel-fonts";
const PIXEL_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap";

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "classic";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "pixel" ? "pixel" : "classic";
  } catch {
    return "classic";
  }
}

function persistMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    return;
  }
}

interface ThemeValue extends ThemeTokens {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeValue>({
  ...buildTheme("classic"),
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read synchronously so a returning visitor never sees a flash of the wrong theme.
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  const tokens = useMemo(() => buildTheme(mode), [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    document.body.style.background = tokens.THEME.paper;

    // 8-bit fonts are only fetched once somebody actually uses the 8-bit theme.
    if (mode === "pixel" && !document.getElementById(PIXEL_FONTS_ID)) {
      const link = document.createElement("link");
      link.id = PIXEL_FONTS_ID;
      link.rel = "stylesheet";
      link.href = PIXEL_FONTS_URL;
      document.head.appendChild(link);
    }

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = mode === "pixel" ? "/favicon-pixel.png" : "/favicon.png";
  }, [mode, tokens]);

  function setMode(next: ThemeMode) {
    setModeState(next);
    persistMode(next);
  }

  const value: ThemeValue = {
    ...tokens,
    setMode,
    toggleMode: () => setMode(mode === "pixel" ? "classic" : "pixel"),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}
