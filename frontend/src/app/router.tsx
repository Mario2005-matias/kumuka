import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LoadingState } from "@/components/shared/LoadingState";
import { OnboardingGuard } from "@/features/onboarding/guards/OnboardingGuard";

import NotFoundPage from "@/features/system/pages/NotFoundPage";
import ServerErrorPage from "@/features/system/pages/ServerErrorPage";
import ForbiddenPage from "@/features/system/pages/ForbiddenPage";

// Layouts used only after sign-in or on auth pages are split out of the initial bundle.
const AppShell = lazy(() =>
  import("@/components/layout/AppShell").then((module) => ({ default: module.AppShell })),
);
const AuthLayout = lazy(() =>
  import("@/components/layout/AuthLayout").then((module) => ({ default: module.AuthLayout })),
);
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const FaqPage = lazy(() => import("@/features/help/pages/FaqPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPasswordPage"),
);
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
const LearnContentPage = lazy(
  () => import("@/features/learn/pages/LearnContentPage"),
);
const TrailsPage = lazy(() => import("@/features/learn/pages/TrailsPage"));
const TrailDetailPage = lazy(
  () => import("@/features/learn/pages/TrailDetailPage"),
);
const TrailModulePage = lazy(
  () => import("@/features/learn/pages/TrailModulePage"),
);
const ModuleQuizPage = lazy(
  () => import("@/features/learn/pages/ModuleQuizPage"),
);
const TrailCompletionPage = lazy(
  () => import("@/features/learn/pages/TrailCompletionPage"),
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

const appRoutes: { path: string; page: ReactNode }[] = [
  { path: ROUTES.dashboard, page: <DashboardPage /> },
  { path: ROUTES.learn.root, page: <LearnHubPage /> },
  { path: ROUTES.learn.trails, page: <TrailsPage /> },
  { path: ROUTES.learn.trail(":slug"), page: <TrailDetailPage /> },
  { path: ROUTES.learn.trailModule(":slug", ":moduleId"), page: <TrailModulePage /> },
  { path: ROUTES.learn.moduleQuiz(":slug", ":moduleId"), page: <ModuleQuizPage /> },
  { path: ROUTES.learn.trailComplete(":slug"), page: <TrailCompletionPage /> },
  { path: ROUTES.learn.quickLearnings, page: <LearnContentPage /> },
  { path: ROUTES.learn.quickLearning(":slug"), page: <LearnContentPage /> },
  { path: ROUTES.learn.guides, page: <LearnContentPage /> },
  { path: ROUTES.learn.guide(":slug"), page: <LearnContentPage /> },
  { path: ROUTES.journey, page: <JourneyPage /> },
  { path: ROUTES.profile, page: <ProfilePage /> },
  { path: ROUTES.experiences.root, page: <ExperiencesPage /> },
  { path: ROUTES.experiences.detail(":slug"), page: <ExperienceDetailPage /> },
  { path: ROUTES.opportunities.root, page: <OpportunitiesPage /> },
  { path: ROUTES.opportunities.detail(":slug"), page: <OpportunityDetailPage /> },
];

export function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.faq} element={<Lazy><FaqPage /></Lazy>} />
        <Route
          path={ROUTES.home}
          element={
            <Lazy>
              <HomePage />
            </Lazy>
          }
        />
      </Route>

      {/* Onboarding — cria a conta no passo 2 e guarda cada resposta no perfil */}
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
      <Route
        path={ROUTES.onboarding.complete}
        element={
          <Lazy>
            <OnboardingCompletePage />
          </Lazy>
        }
      />

      {/* Auth (só visitantes) */}
      <Route element={<GuestGuard />}>
        <Route element={<Lazy><AuthLayout /></Lazy>}>
          <Route path={ROUTES.auth.login} element={<Lazy><LoginPage /></Lazy>} />
          <Route path={ROUTES.auth.forgot} element={<Lazy><ForgotPasswordPage /></Lazy>} />
          <Route path={ROUTES.auth.reset(":token")} element={<Lazy><ResetPasswordPage /></Lazy>} />
        </Route>
      </Route>

      <Route
        path={ROUTES.auth.register}
        element={<Navigate to={ROUTES.onboarding.root} replace />}
      />

      {/* Os cursos foram unidos às trilhas */}
      <Route path="/aprender/cursos/*" element={<Navigate to={ROUTES.learn.trails} replace />} />

      {/* Autenticadas */}
      <Route element={<AuthGuard />}>
        <Route element={<Lazy><AppShell /></Lazy>}>
          {appRoutes.map(({ path, page }) => (
            <Route element={<Lazy>{page}</Lazy>} key={path} path={path} />
          ))}
        </Route>
      </Route>

      {/* Sistema */}
      <Route path={ROUTES.system.notFound} element={<NotFoundPage />} />
      <Route path={ROUTES.system.serverError} element={<ServerErrorPage />} />
      <Route path={ROUTES.system.forbidden} element={<ForbiddenPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
