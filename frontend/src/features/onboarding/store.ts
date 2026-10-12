import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingDraft, OnboardingState } from './types';
import { ONBOARDING_STEPS } from './types';

type PersistedOnboardingState = Pick<OnboardingState, 'step' | 'draft'>;

const initialDraft: OnboardingDraft = {
  name: '',
  age: null,
  situation: '',
  interests: [],
  goal: '',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function restorePersistedState(value: unknown): PersistedOnboardingState {
  const saved = isRecord(value) ? value : {};
  const rawDraft = isRecord(saved.draft)
    ? saved.draft
    : isRecord(saved.data)
      ? saved.data
      : {};
  const rawStep = saved.step;
  const step =
    typeof rawStep === 'number' && Number.isInteger(rawStep)
      ? Math.min(Math.max(rawStep, 0), ONBOARDING_STEPS.length - 1)
      : 0;

  return {
    step,
    draft: {
      name:
        typeof rawDraft.name === 'string'
          ? rawDraft.name
          : typeof rawDraft.nome === 'string'
            ? rawDraft.nome
            : initialDraft.name,
      age:
        typeof rawDraft.age === 'number' && Number.isFinite(rawDraft.age)
          ? rawDraft.age
          : initialDraft.age,
      situation:
        typeof rawDraft.situation === 'string'
          ? rawDraft.situation
          : typeof rawDraft.situacao === 'string'
            ? rawDraft.situacao
            : initialDraft.situation,
      interests: Array.isArray(rawDraft.interests)
        ? rawDraft.interests.filter(
            (interest): interest is string => typeof interest === 'string',
          )
        : Array.isArray(rawDraft.interesses)
          ? rawDraft.interesses.filter(
              (interest): interest is string => typeof interest === 'string',
            )
          : initialDraft.interests,
      goal:
        typeof rawDraft.goal === 'string'
          ? rawDraft.goal
          : typeof rawDraft.objetivo === 'string'
            ? rawDraft.objetivo
            : initialDraft.goal,
    },
  };
}

export const useOnboardingStore = create<OnboardingState>()(
  persist<OnboardingState, [], [], PersistedOnboardingState>(
    (set) => ({
      step: 0,
      draft: initialDraft,
      credentials: null,
      nextStep: () =>
        set((state) => ({
          step: Math.min(state.step + 1, ONBOARDING_STEPS.length - 1),
        })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
      updateDraft: (draft) =>
        set((state) => ({ draft: { ...state.draft, ...draft } })),
      setCredentials: (credentials) => set({ credentials }),
      reset: () => set({ step: 0, draft: initialDraft, credentials: null }),
    }),
    {
      name: 'kumuka-onboarding',
      version: 1,
      partialize: ({ step, draft }) => ({ step, draft }),
      migrate: (persistedState) => restorePersistedState(persistedState),
    },
  ),
);