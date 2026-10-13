import type { Profile } from '@/types/profile';

/**
 * Perfil de demonstração de Maria Silva, consumido por profile.handler.ts.
 */
export const mockProfiles: Profile[] = [
  {
    userId: 'user-mock-01',
    nome: 'Maria Silva',
    faixaEtaria: '18-24',
    situacao: 'universitario',
    interesses: ['Tecnologia', 'Marketing', 'Carreira'],
    objetivo: 'estagio',
    bio: 'Estudante de Gestão na Universidade Agostinho Neto. Apaixonada por marketing digital e tecnologia. À procura do primeiro estágio em Luanda.',
    foto: null,
    competencias: [
      'Marketing Digital',
      'Comunicação',
      'Análise de Dados',
      'Excel Avançado',
      'Gestão de Redes Sociais',
      'Trabalho em Equipa',
    ],
    onboardingCompleted: true,
    onboardingStep: 7,
    createdAt: '2026-08-15T10:05:00Z',
  },
];
