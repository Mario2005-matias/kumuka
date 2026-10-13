import { Navigate, Outlet } from 'react-router-dom';
import { useOnboardingStore } from '../store';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';

export function OnboardingGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const completed = useOnboardingStore((s) => s.completed);

  if (isAuthenticated && completed) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}