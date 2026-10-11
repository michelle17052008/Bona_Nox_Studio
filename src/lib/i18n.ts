import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources } from "./i18n-resources";

const isServer = typeof window === "undefined";

if (!i18n.isInitialized) {
  const chain = isServer ? i18n.use(initReactI18next) : i18n.use(LanguageDetector).use(initReactI18next);
  chain.init({
    resources,
    lng: "es",
    fallbackLng: "es",
    supportedLngs: ["es", "en", "pt"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  });
}

export default i18n;