import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRegister } from '@/features/auth/hooks';
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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const step = useOnboardingStore((state) => state.step);
  const draft = useOnboardingStore((state) => state.draft);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const updateDraft = useOnboardingStore((state) => state.updateDraft);
  const setCredentials = useOnboardingStore((state) => state.setCredentials);
  const register = useRegister();

  async function createAccount(credentials: RegisterInput) {
    setCredentials(credentials);
    try {
      await register.mutateAsync(credentials);
      nextStep();
    } catch {
      // useRegister reports API failures through its error state and toast.
    } finally {
      setCredentials(null);
    }
  }

  function renderStep() {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <CredentialsStep
            errorMessage={register.error?.message}
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
            onNext={nextStep}
            value={draft.name}
          />
        );
      case 3:
        return (
          <AgeStep
            onChange={(age) => updateDraft({ age })}
            onNext={nextStep}
            value={draft.age}
          />
        );
      case 4:
        return (
          <SituationStep
            onChange={(situation) => updateDraft({ situation })}
            onNext={nextStep}
            value={draft.situation}
          />
        );
      case 5:
        return (
          <InterestsStep
            onChange={(interests) => updateDraft({ interests })}
            onNext={nextStep}
            value={draft.interests}
          />
        );
      case 6:
        return (
          <GoalStep
            onChange={(goal) => updateDraft({ goal })}
            onNext={nextStep}
            value={draft.goal}
          />
        );
      case 7:
        return (
          <RewardStep
            draft={draft}
            onComplete={() => navigate(ROUTES.onboarding.complete)}
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