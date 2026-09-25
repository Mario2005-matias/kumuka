import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingData {
  nome?: string;
  dataNascimento?: string;
  situacao?: string;
  interesses?: string[];
  objetivo?: string;
}

interface OnboardingState {
  step: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      data: {},
      setStep: (step) => set({ step }),
      updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),
      reset: () => set({ step: 0, data: {} }),
    }),
    { name: 'kumuka-onboarding' },
  ),
);