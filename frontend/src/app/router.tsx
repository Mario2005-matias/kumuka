import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppShell } from '@/components/layout/AppShell';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoadingState } from '@/components/shared/LoadingState';

// Sistema — sem lazy (crítico e pequeno)
import NotFoundPage from '@/features/system/pages/NotFoundPage';
import ServerErrorPage from '@/features/system/pages/ServerErrorPage';
import ForbiddenPage from '@/features/system/pages/ForbiddenPage';

// Lazy loading (páginas pesadas)
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const LearnHubPage = lazy(() => import('@/features/learn/pages/LearnHubPage'));
const JourneyPage = lazy(() => import('@/features/journey/pages/JourneyPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const ExperiencesPage = lazy(() => import('@/features/experiences/pages/ExperiencesPage'));

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route element={<PublicLayout />}>
        <Route
          path={ROUTES.home}
          element={
            <Lazy>
              <HomePage />
            </Lazy>
          }
        />
      </Route>

      {/* Auth (só visitantes) */}
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.auth.login}
            element={
              <Lazy>
                <LoginPage />
              </Lazy>
            }
          />
        </Route>
      </Route>

      {/* Autenticadas */}
      <Route element={<AuthGuard />}>
        <Route element={<AppShell />}>
          <Route
            path={ROUTES.dashboard}
            element={
              <Lazy>
                <DashboardPage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.learn.root}
            element={
              <Lazy>
                <LearnHubPage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.journey}
            element={
              <Lazy>
                <JourneyPage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.profile}
            element={
              <Lazy>
                <ProfilePage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.experiences.root}
            element={
              <Lazy>
                <ExperiencesPage />
              </Lazy>
            }
          />
        </Route>
      </Route>

      {/* Sistema — sem lazy */}
      <Route path={ROUTES.system.notFound} element={<NotFoundPage />} />
      <Route path={ROUTES.system.serverError} element={<ServerErrorPage />} />
      <Route path={ROUTES.system.forbidden} element={<ForbiddenPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}