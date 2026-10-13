import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './types';

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    if (env.useMocks && import.meta.env.DEV) {
      const { authHandler } = await import('@/lib/mocks/handlers/auth.handler');
      return authHandler.login(input);
    }
    const { data } = await api.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    if (env.useMocks && import.meta.env.DEV) {
      const { authHandler } = await import('@/lib/mocks/handlers/auth.handler');
      return authHandler.register(input);
    }
    const payload = { email: input.email, password: input.password };
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async logout(): Promise<void> {
    if (env.useMocks && import.meta.env.DEV) {
      const { authHandler } = await import('@/lib/mocks/handlers/auth.handler');
      return authHandler.logout();
    }
    await api.post('/auth/logout');
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    if (env.useMocks && import.meta.env.DEV) {
      const { authHandler } = await import('@/lib/mocks/handlers/auth.handler');
      return authHandler.forgotPassword(input);
    }
    await api.post('/auth/forgot-password', input);
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    if (env.useMocks && import.meta.env.DEV) {
      const { authHandler } = await import('@/lib/mocks/handlers/auth.handler');
      return authHandler.resetPassword(input);
    }
    const payload = { token: input.token, password: input.password };
    await api.post('/auth/reset-password', payload);
  },
};
