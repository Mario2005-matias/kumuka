import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/components/ui/toast';
import { authApi } from './api';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/constants/routes';
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
} from './types';

export function useLogin() {
  const { t } = useTranslation('auth');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.add({
        title: t('toasts.welcome'),
        description: t('toasts.loginSuccess'),
        type: 'success',
      });
      navigate(ROUTES.dashboard);
    },
    onError: (error: Error) => {
      toast.add({
        title: t('toasts.loginError'),
        description: error.message,
        type: 'error',
      });
    },
  });
}

export function useRegister() {
  const { t } = useTranslation('auth');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.add({
        title: t('toasts.accountCreated'),
        description: t('toasts.gettingToKnowYou'),
        type: 'success',
      });
      navigate(ROUTES.onboarding.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: t('toasts.registerError'),
        description: error.message,
        type: 'error',
      });
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
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
    onError: (error: Error) => {
      toast.add({
        title: t('toasts.error'),
        description: error.message,
        type: 'error',
      });
    },
  });
}