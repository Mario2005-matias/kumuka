import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/features/auth/hooks';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Onboarding is open to visitors (who create their account in it) and to students
 * who have not finished it yet; everyone else goes to the dashboard.
 */
export function OnboardingGuard() {
  const user = useAuthStore((s) => s.user);
  useCurrentUser();

  if (user?.onboardingCompleted) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
