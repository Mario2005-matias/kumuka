import "i18next"
import type common from "../../public/locales/pt/common.json"
import type home from "../../public/locales/pt/home.json"
import type auth from "../../public/locales/pt/auth.json"
import type onboarding from "../../public/locales/pt/onboarding.json"
import type dashboard from "../../public/locales/pt/dashboard.json"
import type learning from "../../public/locales/pt/learning.json"
import type experiences from "../../public/locales/pt/experiences.json"
import type opportunities from "../../public/locales/pt/opportunities.json"
import type journey from "../../public/locales/pt/journey.json"
import type profile from "../../public/locales/pt/profile.json"
import type system from "../../public/locales/pt/system.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common"
    resources: {
      common: typeof common
      home: typeof home
      auth: typeof auth
      onboarding: typeof onboarding
      dashboard: typeof dashboard
      learning: typeof learning
      experiences: typeof experiences
      opportunities: typeof opportunities
      journey: typeof journey
      profile: typeof profile
      system: typeof system
    }
  }
}
