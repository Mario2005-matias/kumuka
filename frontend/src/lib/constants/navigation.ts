import { ROUTES } from './routes';

export const DESKTOP_NAV = [
    { label: 'Aprender', href: ROUTES.learn.root },
    { label: 'Experiências', href: ROUTES.experiences.root },
    { label: 'Minha Jornada', href: ROUTES.journey },
    { label: 'Perfil', href: ROUTES.profile },
] as const;

export const MOBILE_NAV = [
    { label: 'Início', href: ROUTES.dashboard },
    { label: 'Aprender', href: ROUTES.learn.root },
    { label: 'Jornada', href: ROUTES.journey },
    { label: 'Perfil', href: ROUTES.profile },
] as const;