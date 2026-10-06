import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/components/ui/toast';
import { authApi } from './api';
import { ROUTES } from '@/lib/constants/routes';
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
} from './types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.add({
        title: 'Bem-vindo de volta!',
        description: 'Sessão iniciada com sucesso.',
        type: 'success',
      });
      navigate(ROUTES.dashboard);
    },
    onError: (error: Error) => {
      toast.add({
        title: 'Erro ao entrar',
        description: error.message,
        type: 'error',
      });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.add({
        title: 'Conta criada!',
        description: 'Vamos conhecer-te melhor.',
        type: 'success',
      });
      navigate(ROUTES.onboarding.root);
    },
    onError: (error: Error) => {
      toast.add({
        title: 'Erro ao criar conta',
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
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
    onSuccess: () => {
      toast.add({
        title: 'Email enviado',
        description: 'Verifica a tua caixa de entrada.',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: 'Erro',
        description: error.message,
        type: 'error',
      });
    },
  });
}