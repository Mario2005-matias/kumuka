export const ROUTES = {
    home: '/',
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
        trailModule: (slug: string, id: string) => `/aprender/trilhas/${slug}/modulo/${id}`,
        courses: '/aprender/cursos',
        course: (slug: string) => `/aprender/cursos/${slug}`,
        courseModule: (slug: string, id: string) => `/aprender/cursos/${slug}/modulo/${id}`,
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
    system: {
        notFound: '/404',
        serverError: '/500',
        forbidden: '/sem-permissao',
    },
} as const;