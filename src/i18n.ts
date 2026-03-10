import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";

const supportedLanguages = ["en", "hr", "de", "cs", "pl"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const fallbackLanguage: SupportedLanguage = "en";

const localeLoaders: Record<Exclude<SupportedLanguage, "en">, () => Promise<{ default: Record<string, string> }>> = {
  hr: () => import("./locales/hr/common.json"),
  de: () => import("./locales/de/common.json"),
  cs: () => import("./locales/cs/common.json"),
  pl: () => import("./locales/pl/common.json"),
};

const normalizeLanguage = (language?: string | null): SupportedLanguage => {
  if (!language) {
    return fallbackLanguage;
  }

  const shortCode = language.slice(0, 2).toLowerCase();
  if (supportedLanguages.includes(shortCode as SupportedLanguage)) {
    return shortCode as SupportedLanguage;
  }

  return fallbackLanguage;
};

const getPreferredLanguage = (): SupportedLanguage => {
  const storedLanguage = localStorage.getItem("i18nextLng");
  if (storedLanguage) {
    return normalizeLanguage(storedLanguage);
  }

  return normalizeLanguage(navigator.language);
};

export const ensureLanguageResources = async (language: SupportedLanguage) => {
  if (i18n.hasResourceBundle(language, "common")) {
    return;
  }

  if (language === fallbackLanguage) {
    i18n.addResourceBundle(language, "common", enCommon, true, true);
    return;
  }

  const module = await localeLoaders[language]();
  i18n.addResourceBundle(language, "common", module.default, true, true);
};

export const initI18n = async () => {
  const preferredLanguage = getPreferredLanguage();
  await i18n.use(initReactI18next).init({
    resources: {
      en: { common: enCommon },
    },
    lng: fallbackLanguage,
    fallbackLng: fallbackLanguage,
    supportedLngs: [...supportedLanguages],
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
  });

  i18n.on("languageChanged", (language) => {
    const normalizedLanguage = normalizeLanguage(language);
    document.documentElement.lang = normalizedLanguage;
    localStorage.setItem("i18nextLng", normalizedLanguage);
  });

  document.documentElement.lang = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  if (preferredLanguage !== fallbackLanguage) {
    void ensureLanguageResources(preferredLanguage).then(async () => {
      if (i18n.language !== preferredLanguage) {
        await i18n.changeLanguage(preferredLanguage);
      }
    });
  }
};

export default i18n;