import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingDraft, OnboardingState } from './types';
import { ONBOARDING_STEPS } from './types';

type PersistedOnboardingState = Pick<OnboardingState, 'step' | 'draft'>;

const lastStep = ONBOARDING_STEPS.length - 1;

const initialDraft: OnboardingDraft = {
  name: '',
  age: null,
  situation: '',
  interests: [],
  goal: '',
};

function clampStep(step: number) {
  return Math.min(Math.max(step, 0), lastStep);
}

/**
 * Local copy of the onboarding answers. Once the account exists every answer is
 * also saved to the profile API, so this store only smooths the UI and is reset
 * whenever the session changes.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist<OnboardingState, [], [], PersistedOnboardingState>(
    (set) => ({
      step: 0,
      draft: initialDraft,
      nextStep: () => set((state) => ({ step: clampStep(state.step + 1) })),
      prevStep: () => set((state) => ({ step: clampStep(state.step - 1) })),
      setStep: (step) => set({ step: clampStep(step) }),
      updateDraft: (draft) =>
        set((state) => ({ draft: { ...state.draft, ...draft } })),
      reset: () => set({ step: 0, draft: initialDraft }),
    }),
    {
      name: 'kumuka-onboarding',
      version: 3,
      partialize: ({ step, draft }) => ({ step, draft }),
      migrate: () => ({ step: 0, draft: initialDraft }),
    },
  ),
);
