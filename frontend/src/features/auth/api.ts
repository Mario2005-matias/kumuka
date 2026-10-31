import { api, getData } from '@/lib/api/client';
import type { User } from '@/types/user';
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './types';

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email: input.email,
      password: input.password,
      password_confirmation: input.confirmPassword,
    });
    return data;
  },

  me(): Promise<User> {
    return getData<User>('/auth/me');
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password', input);
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await api.post('/auth/reset-password', {
      token: input.token,
      email: input.email,
      password: input.password,
      password_confirmation: input.confirmPassword,
    });
  },
};
