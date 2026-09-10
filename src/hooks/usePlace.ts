import { useEffect, useState } from "react";
import type { Place } from "../types/weather";

const STORAGE_KEY = "wishwash:last-place";

const FALLBACK_PLACE: Place = {
  name: "Canoinhas",
  admin: "Santa Catarina",
  country: "Brazil",
  lat: -26.1751,
  lon: -50.3922,
};

function readStoredPlace(): Place | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Place>;
    if (typeof parsed.lat === "number" && typeof parsed.lon === "number" && parsed.name) {
      return parsed as Place;
    }
  } catch {
    return null;
  }
  return null;
}

function persistPlace(place: Place) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(place));
  } catch {
    return;
  }
}

export type SetPlace = (next: Place, remember?: boolean) => void;

export function usePlace(): readonly [Place | null, SetPlace] {
  const [place, setPlaceState] = useState<Place | null>(null);

  useEffect(() => {
    const stored = readStoredPlace();
    if (stored) {
      setPlaceState(stored);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPlaceState({
            name: "Your location",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        () => setPlaceState(FALLBACK_PLACE),
        { timeout: 4000 }
      );
    } else {
      setPlaceState(FALLBACK_PLACE);
    }
  }, []);

  const setPlace: SetPlace = (next, remember = false) => {
    setPlaceState(next);
    if (remember) persistPlace(next);
  };

  return [place, setPlace] as const;
}
