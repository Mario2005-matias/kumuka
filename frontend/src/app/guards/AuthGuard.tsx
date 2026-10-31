import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/features/auth/hooks';
import { ROUTES } from '@/lib/constants/routes';

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.auth.login} state={{ from: location }} replace />;
  }

  if (user && !user.onboardingCompleted) {
    return <Navigate to={ROUTES.onboarding.root} replace />;
  }

  return <Outlet />;
}
