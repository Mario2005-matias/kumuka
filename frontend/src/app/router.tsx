import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppShell } from '@/components/layout/AppShell';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingState } from '@/components/shared/LoadingState';

// Lazy loading
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const LearnHubPage = lazy(() => import('@/features/learn/pages/LearnHubPage'));
const JourneyPage = lazy(() => import('@/features/journey/pages/JourneyPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const ExperiencesPage = lazy(() => import('@/features/experiences/pages/ExperiencesPage'));
const NotFoundPage = lazy(() => import('@/features/system/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/features/system/pages/ServerErrorPage'));
const ForbiddenPage = lazy(() => import('@/features/system/pages/ForbiddenPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        {/* Públicas */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
        </Route>

        {/* Auth (só visitantes) */}
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.auth.login} element={<LoginPage />} />
            <Route path={ROUTES.auth.register} element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Autenticadas */}
        <Route element={<AuthGuard />}>
          <Route element={<AppShell />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.learn.root} element={<LearnHubPage />} />
            <Route path={ROUTES.journey} element={<JourneyPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
            <Route path={ROUTES.experiences.root} element={<ExperiencesPage />} />
          </Route>
        </Route>

        {/* Sistema */}
        <Route path={ROUTES.system.notFound} element={<NotFoundPage />} />
        <Route path={ROUTES.system.serverError} element={<ServerErrorPage />} />
        <Route path={ROUTES.system.forbidden} element={<ForbiddenPage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}