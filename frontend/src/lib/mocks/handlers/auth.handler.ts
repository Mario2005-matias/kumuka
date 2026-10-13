import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/features/auth/types';
import { mockUsers } from '../data/user';
import type { MockUser } from '../types/mock.types';
import { delay } from '../utils/delay';

const storageKey = 'kumuka-mock-users';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readRegisteredUsers(): MockUser[] {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return [];

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) {
    throw new Error('Os utilizadores mock guardados têm um formato inválido.');
  }

  return parsed.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.email !== 'string' ||
      typeof item.password !== 'string' ||
      (item.role !== undefined && item.role !== 'student') ||
      (item.createdAt !== undefined && typeof item.createdAt !== 'string')
    ) {
      throw new Error('Um utilizador mock guardado tem um formato inválido.');
    }

    return {
      id: item.id,
      email: item.email,
      password: item.password,
      role: 'student',
      createdAt:
        typeof item.createdAt === 'string'
          ? item.createdAt
          : new Date().toISOString(),
    };
  });
}

function makeToken(): string {
  return `mock-token-${Math.random().toString(36).slice(2, 11)}`;
}

function toResponse(user: MockUser): AuthResponse {
  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
  return { user: safeUser, token: makeToken() };
}

/**
 * Handler de autenticação em memória/localStorage.
 * Simula os endpoints de login, registo, saída e recuperação de password.
 */
export const authHandler = {
  async login(input: LoginInput): Promise<AuthResponse> {
    await delay();
    const storedUsers = readRegisteredUsers();
    const user = [...mockUsers, ...storedUsers].find(
      (candidate) =>
        candidate.email.toLocaleLowerCase() === input.email.toLocaleLowerCase() &&
        candidate.password === input.password,
    );
    if (!user) throw new Error('Email ou password incorrectos.');
    return toResponse(user);
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    await delay();
    if (input.password !== input.confirmPassword) {
      throw new Error('As passwords não coincidem.');
    }
    const storedUsers = readRegisteredUsers();
    const emailInUse = [...mockUsers, ...storedUsers].some(
      (user) => user.email.toLocaleLowerCase() === input.email.toLocaleLowerCase(),
    );
    if (emailInUse) throw new Error('Este email já está registado.');

    const user: MockUser = {
      id: `user-${Math.random().toString(36).slice(2, 11)}`,
      email: input.email,
      password: input.password,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify([...storedUsers, user]));
    return toResponse(user);
  },

  async logout(): Promise<void> {
    await delay();
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await delay();
    console.info(`[mock] Pedido de recuperação recebido para ${input.email}.`);
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await delay();
    if (!input.token) throw new Error('O token de recuperação é obrigatório.');
    throw new Error('A reposição de password ainda não está disponível no mock.');
  },
};
