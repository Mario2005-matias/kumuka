import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import { useOnboardingStore } from '@/features/onboarding/store';
import { authApi } from './api';
import { endSession } from './session';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './types';

/**
 * Revalidates the stored token and keeps the cached user (onboarding state) fresh.
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const query = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}

export function useLogin() {
  const { t } = useTranslation('auth');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      useOnboardingStore.getState().reset();
      setAuth(data.user, data.token);
      toast.add({
        title: t('toasts.welcome'),
        description: t('toasts.loginSuccess'),
        type: 'success',
      });
      navigate(data.user.onboardingCompleted ? ROUTES.dashboard : ROUTES.onboarding.root);
    },
    onError: (error) => {
      toast.add({
        title: t('toasts.loginError'),
        description: apiErrorMessage(error, t('toasts.networkError')),
        type: 'error',
      });
    },
  });
}

/**
 * Creates the account during onboarding; the onboarding page decides where to go next.
 */
export function useRegister() {
  const { t } = useTranslation('auth');
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.add({
        title: t('toasts.accountCreated'),
        description: t('toasts.gettingToKnowYou'),
        type: 'success',
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      endSession();
      navigate(ROUTES.home);
    },
  });
}

export function useForgotPassword() {
  const { t } = useTranslation('auth');
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
    onSuccess: () => {
      toast.add({
        title: t('toasts.emailSent'),
        description: t('toasts.checkInbox'),
        type: 'success',
      });
    },
    onError: (error) => {
      toast.add({
        title: t('toasts.error'),
        description: apiErrorMessage(error, t('toasts.networkError')),
        type: 'error',
      });
    },
  });
}

export function useResetPassword() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
    onSuccess: () => {
      toast.add({
        title: t('toasts.passwordReset'),
        description: t('toasts.loginWithNewPassword'),
        type: 'success',
      });
      navigate(ROUTES.auth.login);
    },
    onError: (error) => {
      toast.add({
        title: t('toasts.error'),
        description: apiErrorMessage(error, t('toasts.networkError')),
        type: 'error',
      });
    },
  });
}
