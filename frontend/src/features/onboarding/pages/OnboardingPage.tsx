import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useRegister } from '@/features/auth/hooks';
import { useProfile, useUpdateProfile, type ProfileUpdate } from '@/features/profile/hooks/useProfile';
import { toast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { AgeStep } from '../steps/AgeStep';
import { CredentialsStep } from '../steps/CredentialsStep';
import { GoalStep } from '../steps/GoalStep';
import { InterestsStep } from '../steps/InterestsStep';
import { NameStep } from '../steps/NameStep';
import { RewardStep } from '../steps/RewardStep';
import { SituationStep } from '../steps/SituationStep';
import { WelcomeStep } from '../steps/WelcomeStep';
import { useOnboardingStore } from '../store';
import type { RegisterInput } from '@/features/auth/types';

const CREDENTIALS_STEP = 1;

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';
  const step = useOnboardingStore((state) => state.step);
  const draft = useOnboardingStore((state) => state.draft);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const setStep = useOnboardingStore((state) => state.setStep);
  const updateDraft = useOnboardingStore((state) => state.updateDraft);
  const register = useRegister();
  const profile = useProfile(userId);
  const updateProfile = useUpdateProfile(userId);

  // Resume where the student stopped, even on another device.
  useEffect(() => {
    if (!isAuthenticated && step > CREDENTIALS_STEP) setStep(CREDENTIALS_STEP);
    if (user && user.onboardingStep > step) setStep(user.onboardingStep);
  }, [isAuthenticated, setStep, step, user]);

  useEffect(() => {
    const saved = profile.data;
    if (!saved) return;
    const current = useOnboardingStore.getState().draft;
    updateDraft({
      name: current.name || saved.nome,
      age: current.age ?? saved.idade,
      situation: current.situation || saved.situacao,
      interests: current.interests.length ? current.interests : saved.interesses,
      goal: current.goal || saved.objetivo,
    });
  }, [profile.data, updateDraft]);

  async function createAccount(credentials: RegisterInput) {
    try {
      await register.mutateAsync(credentials);
      nextStep();
    } catch {
      // The error is shown inside the credentials step.
    }
  }

  /** Save one answer to the profile and move on without waiting for the network. */
  function saveAndContinue(changes: ProfileUpdate) {
    updateProfile.mutate(
      { ...changes, onboardingStep: step + 1 },
      {
        onError: (error) =>
          toast.add({
            title: t('saveError'),
            description: apiErrorMessage(error, t('saveErrorDescription')),
            type: 'error',
          }),
      },
    );
    nextStep();
  }

  async function complete() {
    try {
      await updateProfile.mutateAsync({
        nome: draft.name,
        idade: draft.age,
        situacao: draft.situation,
        interesses: draft.interests,
        objetivo: draft.goal,
        onboardingStep: step,
        onboardingCompleted: true,
      });
      navigate(ROUTES.onboarding.complete);
    } catch (error) {
      toast.add({
        title: t('saveError'),
        description: apiErrorMessage(error, t('saveErrorDescription')),
        type: 'error',
      });
    }
  }

  function renderStep() {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <CredentialsStep
            errorMessage={
              register.error ? apiErrorMessage(register.error, t('credentials.error')) : undefined
            }
            isAuthenticated={isAuthenticated}
            isSubmitting={register.isPending}
            onContinue={nextStep}
            onRegister={createAccount}
          />
        );
      case 2:
        return (
          <NameStep
            onChange={(name) => updateDraft({ name })}
            onNext={() => saveAndContinue({ nome: draft.name })}
            value={draft.name}
          />
        );
      case 3:
        return (
          <AgeStep
            onChange={(age) => updateDraft({ age })}
            onNext={() => saveAndContinue({ idade: draft.age })}
            value={draft.age}
          />
        );
      case 4:
        return (
          <SituationStep
            onChange={(situation) => updateDraft({ situation })}
            onNext={() => saveAndContinue({ situacao: draft.situation })}
            value={draft.situation}
          />
        );
      case 5:
        return (
          <InterestsStep
            onChange={(interests) => updateDraft({ interests })}
            onNext={() => saveAndContinue({ interesses: draft.interests })}
            value={draft.interests}
          />
        );
      case 6:
        return (
          <GoalStep
            onChange={(goal) => updateDraft({ goal })}
            onNext={() => saveAndContinue({ objetivo: draft.goal })}
            value={draft.goal}
          />
        );
      case 7:
        return (
          <RewardStep
            draft={draft}
            isSubmitting={updateProfile.isPending}
            onComplete={() => void complete()}
          />
        );
      default:
        return null;
    }
  }

  return (
    <OnboardingLayout currentStep={step} onBack={prevStep}>
      {renderStep()}
    </OnboardingLayout>
  );
}
