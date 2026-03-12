import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "villaCocoThemePreference";
const LEGACY_STORAGE_KEY = "villaCocoDarkMode";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getStoredThemePreference(): ThemePreference {
  const savedThemePreference = window.localStorage.getItem(STORAGE_KEY);

  if (
    savedThemePreference === "system" ||
    savedThemePreference === "light" ||
    savedThemePreference === "dark"
  ) {
    return savedThemePreference;
  }

  return "system";
}

function getSystemDarkModePreference() {
  return window.matchMedia(DARK_MODE_QUERY).matches;
}

function applyDocumentTheme(isDarkMode: boolean) {
  const root = document.documentElement;

  root.classList.toggle("dark", isDarkMode);
  root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  root.style.colorScheme = isDarkMode ? "dark" : "light";
}

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(getStoredThemePreference);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemDarkModePreference);

  const isDarkMode = themePreference === "system" ? systemPrefersDark : themePreference === "dark";

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    setSystemPrefersDark(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, themePreference);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [themePreference]);

  useEffect(() => {
    applyDocumentTheme(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setThemePreference((currentPreference) => {
      const currentlyDark = currentPreference === "system"
        ? getSystemDarkModePreference()
        : currentPreference === "dark";

      return currentlyDark ? "light" : "dark";
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
