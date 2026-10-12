import type { RegisterInput } from '@/features/auth/types';

export const ONBOARDING_STEPS = [
  'Boas-vindas',
  'A tua conta',
  'O teu nome',
  'A tua idade',
  'A tua situação',
  'Os teus interesses',
  'O teu objetivo',
  'A tua recompensa',
] as const;

export const SITUATION_OPTIONS = [
  'Estou a estudar',
  'Estou à procura de trabalho',
  'Já estou a trabalhar',
  'Tenho um negócio ou projeto',
  'Outra situação',
] as const;

export const INTEREST_OPTIONS = [
  'Tecnologia',
  'Empreendedorismo',
  'Criatividade',
  'Liderança',
  'Finanças',
  'Comunicação',
  'Ciência',
  'Empregabilidade',
] as const;

export const GOAL_OPTIONS = [
  'Aprender uma nova competência',
  'Preparar-me para o primeiro emprego',
  'Criar o meu próprio negócio',
  'Crescer no meu trabalho atual',
  'Descobrir o que quero fazer',
] as const;

export interface OnboardingDraft {
  name: string;
  age: number | null;
  situation: string;
  interests: string[];
  goal: string;
}

export interface OnboardingState {
  step: number;
  draft: OnboardingDraft;
  credentials: RegisterInput | null;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (draft: Partial<OnboardingDraft>) => void;
  setCredentials: (credentials: RegisterInput | null) => void;
  reset: () => void;
}