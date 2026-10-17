import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export const namespaces = [
  "common",
  "home",
  "auth",
  "onboarding",
  "dashboard",
  "learning",
  "experiences",
  "opportunities",
  "journey",
  "profile",
  "system",
] as const

export type AppNamespace = (typeof namespaces)[number]

export const i18nReady = i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["pt", "en", "fr"],
    nonExplicitSupportedLngs: true,
    fallbackLng: "pt",
    load: "languageOnly",
    defaultNS: "common",
    ns: [...namespaces],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kumuka-language",
    },
    interpolation: {
      escapeValue: false,
    },
    debug: import.meta.env.DEV,
  })
  .catch((error: unknown) => {
    console.error("Não foi possível inicializar as traduções da KUMUKA.", error)
    throw error
  })

i18n.on("languageChanged", (language) => {
  const resolvedLanguage = i18n.resolvedLanguage ?? language
  document.documentElement.lang =
    resolvedLanguage === "pt" ? "pt-AO" : resolvedLanguage
})

i18n.on("failedLoading", (language, namespace, message) => {
  console.error(
    `Não foi possível carregar o idioma "${language}" (namespace "${namespace}").`,
    message,
  )
})

export default i18n
