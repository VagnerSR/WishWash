import React, { createContext, useContext, useEffect, useState } from "react";
import { TRANSLATIONS, detectLocale, localeTag, type Locale, type Translations } from "./translations";

const STORAGE_KEY = "wishwash:locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "en" || raw === "pt" ? raw : null;
  } catch {
    return null;
  }
}

function persistLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    return;
  }
}

interface I18nValue {
  locale: Locale;
  t: Translations;
  localeTag: string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nValue>({
  locale: "en",
  t: TRANSLATIONS.en,
  localeTag: "en-US",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored ?? detectLocale());
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    persistLocale(next);
  }

  const value: I18nValue = {
    locale,
    t: TRANSLATIONS[locale],
    localeTag: localeTag(locale),
    setLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
