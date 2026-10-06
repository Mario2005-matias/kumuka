import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
} from './types';

// Simular latência de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Credenciais de teste
const TEST_USER = {
  email: 'teste@kumuka.ao',
  password: '123456',
};

// Chave do localStorage
const MOCK_USERS_KEY = 'kumuka-mock-users';

// Utilizadores registados (mock)
interface MockUser {
  id: string;
  email: string;
  password: string;
}

function getMockUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// Gerar ID simples (mock)
function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

// ============================================================
// API MOCK
// ============================================================

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    await delay(600);

    // Credenciais de teste
    if (input.email === TEST_USER.email && input.password === TEST_USER.password) {
      return {
        user: {
          id: 'test-user-1',
          email: input.email,
          role: 'student',
          createdAt: new Date().toISOString(),
        },
        token: 'mock-token-' + generateId(),
      };
    }

    // Utilizadores registados
    const users = getMockUsers();
    const found = users.find(
      (u) => u.email === input.email && u.password === input.password,
    );

    if (!found) {
      throw new Error('Email ou password incorretos');
    }

    return {
      user: {
        id: found.id,
        email: found.email,
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-token-' + generateId(),
    };
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    await delay(800);

    const users = getMockUsers();

    // Verificar email duplicado
    if (users.some((u) => u.email === input.email)) {
      throw new Error('Este email já está registado');
    }

    // Criar novo utilizador
    const newUser: MockUser = {
      id: generateId(),
      email: input.email,
      password: input.password,
    };

    users.push(newUser);
    saveMockUsers(users);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-token-' + generateId(),
    };
  },

  async logout(): Promise<void> {
    await delay(300);
    // Nada a fazer no mock — o store trata de limpar
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await delay(700);
    // Simular sucesso sempre (por segurança, não revelar se email existe)
    console.log('[mock] Email de recuperação enviado para:', input.email);
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await delay(700);
    console.log('[mock] Password redefinida. Token:', token);
  },
};