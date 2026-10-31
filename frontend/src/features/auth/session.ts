import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/features/onboarding/store';

/**
 * Forget everything tied to the current student so the next person using the
 * same browser starts clean.
 */
export function endSession(reason: 'logout' | 'expired' = 'logout') {
  if (reason === 'expired') {
    useAuthStore.getState().expireSession();
  } else {
    useAuthStore.getState().clearAuth();
  }
  useOnboardingStore.getState().reset();
  queryClient.clear();
}
