import type { MockUser } from '../types/mock.types';

/**
 * Utilizador de demonstração usado pelo handler de autenticação em desenvolvimento.
 */
export const mockUsers: MockUser[] = [
  {
    id: 'user-mock-01',
    email: 'maria.silva@kumuka.ao',
    password: '123456',
    role: 'student',
    createdAt: '2026-08-15T10:00:00Z',
  },
];
