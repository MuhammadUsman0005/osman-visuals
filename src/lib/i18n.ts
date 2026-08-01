import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import ur from "@/locales/ur.json";
import ar from "@/locales/ar.json";
import tr from "@/locales/tr.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";

const supportedLanguages = ["en", "ur", "ar", "tr", "es", "fr", "de"] as const;
const fallbackLng = "en";
const storedLanguage =
  typeof window !== "undefined" ? window.localStorage.getItem("preferred-language") : null;
const initialLanguage =
  storedLanguage &&
  supportedLanguages.includes(storedLanguage as (typeof supportedLanguages)[number])
    ? storedLanguage
    : fallbackLng;

const resources = {
  en: { translation: en },
  ur: { translation: ur },
  ar: { translation: ar },
  tr: { translation: tr },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
} as const;

i18next.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18next.resolvedLanguage || fallbackLng;
  document.documentElement.dir = i18next.resolvedLanguage === "ar" ? "rtl" : "ltr";
}

export function setPreferredLanguage(language: string) {
  const normalized = supportedLanguages.includes(language as (typeof supportedLanguages)[number])
    ? language
    : fallbackLng;

  i18next.changeLanguage(normalized);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("preferred-language", normalized);
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = normalized;
    document.documentElement.dir = normalized === "ar" ? "rtl" : "ltr";
  }
}

export { supportedLanguages };
export default i18next;
