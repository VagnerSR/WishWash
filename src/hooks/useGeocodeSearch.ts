import { useCallback, useRef, useState } from "react";
import type { GeocodeResult } from "../types/weather";

interface GeocodeSearchState {
  suggestions: GeocodeResult[];
  searching: boolean;
  search: (query: string) => void;
  clear: () => void;
}

export function useGeocodeSearch(): GeocodeSearchState {
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback((query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`
    )
      .then((res) => res.json())
      .then((json) => setSuggestions(json.results ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setSearching(false));
  }, []);

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(query), 350);
    },
    [runSearch]
  );

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, searching, search, clear };
}
