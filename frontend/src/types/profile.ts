export interface Profile {
  userId: string;
  nome: string;
  idade: number | null;
  situacao: string;
  interesses: string[];
  objetivo: string;
  bio: string;
  foto: string | null;
  competencias: string[];
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: string;
}
