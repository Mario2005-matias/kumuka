import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppShell } from "@/components/layout/AppShell";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoadingState } from "@/components/shared/LoadingState";
import { OnboardingGuard } from "@/features/onboarding/guards/OnboardingGuard";

import NotFoundPage from "@/features/system/pages/NotFoundPage";
import ServerErrorPage from "@/features/system/pages/ServerErrorPage";
import ForbiddenPage from "@/features/system/pages/ForbiddenPage";

const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const OnboardingPage = lazy(
  () => import("@/features/onboarding/pages/OnboardingPage"),
);
const OnboardingCompletePage = lazy(
  () => import("@/features/onboarding/pages/OnboardingCompletePage"),
);
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);
const LearnHubPage = lazy(() => import("@/features/learn/pages/LearnHubPage"));
const TrailsPage = lazy(() => import("@/features/learn/pages/TrailsPage"));
const TrailDetailPage = lazy(
  () => import("@/features/learn/pages/TrailDetailPage"),
);
const TrailModulePage = lazy(
  () => import("@/features/learn/pages/TrailModulePage"),
);
const TrailCompletionPage = lazy(
  () => import("@/features/learn/pages/TrailCompletionPage"),
);
const CoursesPage = lazy(() => import("@/features/learn/pages/CoursesPage"));
const CourseDetailPage = lazy(
  () => import("@/features/learn/pages/CourseDetailPage"),
);
const CourseModulePage = lazy(
  () => import("@/features/learn/pages/CourseModulePage"),
);
const CourseCompletePage = lazy(
  () => import("@/features/learn/pages/CourseCompletePage"),
);
const JourneyPage = lazy(() => import("@/features/journey/pages/JourneyPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const ExperiencesPage = lazy(
  () => import("@/features/experiences/pages/ExperiencesPage"), 
);
const ExperienceDetailPage = lazy(
  () => import("@/features/experiences/pages/ExperienceDetailPage"),
);
const OpportunitiesPage = lazy(
  () => import("@/features/opportunities/pages/OpportunitiesPage"),
);
const OpportunityDetailPage = lazy(
  () => import("@/features/opportunities/pages/OpportunityDetailPage"),
);

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

      <Route element={<OnboardingGuard />}>
        <Route
          path={ROUTES.onboarding.root}
          element={
            <Lazy>
              <OnboardingPage />
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

      {/* Onboarding — público, mas com fluxo próprio */}
      <Route
        path={ROUTES.onboarding.complete}
        element={
          <Lazy>
            <OnboardingCompletePage />
          </Lazy>
        }
      />

      {/* /auth/registar → redireciona para onboarding */}
      <Route
        path={ROUTES.auth.register}
        element={<Navigate to={ROUTES.onboarding.root} replace />}
      />

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
            path={ROUTES.learn.trails}
            element={
              <Lazy>
                <TrailsPage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/trilhas/:slug"
            element={
              <Lazy>
                <TrailDetailPage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/trilhas/:slug/modulo/:moduleId"
            element={
              <Lazy>
                <TrailModulePage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/trilhas/:slug/concluida"
            element={
              <Lazy>
                <TrailCompletionPage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.learn.courses}
            element={
              <Lazy>
                <CoursesPage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/cursos/:slug"
            element={
              <Lazy>
                <CourseDetailPage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/cursos/:slug/modulo/:moduleId"
            element={
              <Lazy>
                <CourseModulePage />
              </Lazy>
            }
          />
          <Route
            path="/aprender/cursos/:slug/concluido"
            element={
              <Lazy>
                <CourseCompletePage />
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
          <Route
            path="/experiencias/:slug"
            element={
              <Lazy>
                <ExperienceDetailPage />
              </Lazy>
            }
          />
          <Route
            path={ROUTES.opportunities.root}
            element={
              <Lazy>
                <OpportunitiesPage />
              </Lazy>
            }
          />
          <Route
            path="/oportunidades/:slug"
            element={
              <Lazy>
                <OpportunityDetailPage />
              </Lazy>
            }
          />
        </Route>
      </Route>

      {/* Sistema */}
      <Route path={ROUTES.system.notFound} element={<NotFoundPage />} />
      <Route path={ROUTES.system.serverError} element={<ServerErrorPage />} />
      <Route path={ROUTES.system.forbidden} element={<ForbiddenPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
