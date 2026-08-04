import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "system") return systemPrefersDark();
  return mode === "dark";
}

function applyDomClass(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "dark"; // matches the site's existing default
}

// Shared by the header's quick-toggle button (dark/light only, unchanged)
// and the account dropdown's fuller Theme submenu (adds System). Both read
// and write the same "theme" localStorage key, so they can never drift out
// of sync with each other.
export function useThemeMode() {
  const [mode, setModeState] = useState<ThemeMode>(getStoredThemeMode);

  useEffect(() => {
    applyDomClass(resolveIsDark(mode));
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyDomClass(systemPrefersDark());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  // Pick up changes made by the header's own toggle (or another tab).
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setModeState(getStoredThemeMode());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }, []);

  return { mode, setMode };
}