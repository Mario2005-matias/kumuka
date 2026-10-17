import { ROUTES } from './routes';

export const DESKTOP_NAV = [
    { translationKey: 'learn', href: ROUTES.learn.root },
    { translationKey: 'experiences', href: ROUTES.experiences.root },
    { translationKey: 'opportunities', href: ROUTES.opportunities.root },
    { translationKey: 'journey', href: ROUTES.journey },
    { translationKey: 'profile', href: ROUTES.profile },
] as const;

export const MOBILE_NAV = [
    { translationKey: 'home', href: ROUTES.dashboard },
    { translationKey: 'learn', href: ROUTES.learn.root },
    { translationKey: 'journeyShort', href: ROUTES.journey },
    { translationKey: 'profile', href: ROUTES.profile },
] as const;