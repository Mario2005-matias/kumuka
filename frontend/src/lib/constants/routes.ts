export const ROUTES = {
  home: '/',
  faq: '/perguntas-frequentes',
  auth: {
    register: '/auth/registar',
    login: '/auth/entrar',
    forgot: '/auth/recuperar',
    reset: (token: string) => `/auth/recuperar/${token}`,
  },
  onboarding: {
    root: '/onboarding',
    complete: '/onboarding/concluido',
  },
  dashboard: '/dashboard',
  journey: '/minha-jornada',
  learn: {
    root: '/aprender',
    trails: '/aprender/trilhas',
    trail: (slug: string) => `/aprender/trilhas/${slug}`,
    trailModule: (slug: string, id: string) =>
      `/aprender/trilhas/${slug}/modulo/${id}`,
    moduleQuiz: (slug: string, id: string) =>
      `/aprender/trilhas/${slug}/modulo/${id}/quiz`,
    trailComplete: (slug: string) => `/aprender/trilhas/${slug}/concluida`,
    quickLearnings: '/aprender/aprendizados',
    quickLearning: (slug: string) => `/aprender/aprendizados/${slug}`,
    guides: '/aprender/guias',
    guide: (slug: string) => `/aprender/guias/${slug}`,
  },
  profile: '/perfil',
  experiences: {
    root: '/experiencias',
    detail: (slug: string) => `/experiencias/${slug}`,
  },
  opportunities: {
    root: '/oportunidades',
    detail: (slug: string) => `/oportunidades/${slug}`,
  },
  system: {
    notFound: '/404',
    serverError: '/500',
    forbidden: '/sem-permissao',
  },
} as const;