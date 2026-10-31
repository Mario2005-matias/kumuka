export interface Profile {
  userId: string;
  nome: string;
  idade: number | null;
  situacao: string;
  localizacao: string;
  interesses: string[];
  objetivo: string;
  bio: string;
  linkedin: string | null;
  portfolio: string | null;
  foto: string | null;
  banner: string | null;
  competencias: string[];
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: string;
}
