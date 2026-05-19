import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeContextValue, type ThemeMode } from "./theme-context";

const THEME_KEY = "smart_leads_theme";

const getPreferredTheme = (): ThemeMode => {
  const storedTheme = window.localStorage.getItem(THEME_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [hasStoredPreference, setHasStoredPreference] = useState(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    return storedTheme === "light" || storedTheme === "dark";
  });
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (hasStoredPreference) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [hasStoredPreference, theme]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent): void => {
      if (!hasStoredPreference) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [hasStoredPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => {
        setHasStoredPreference(true);
        setTheme((current) => (current === "dark" ? "light" : "dark"));
      }
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
