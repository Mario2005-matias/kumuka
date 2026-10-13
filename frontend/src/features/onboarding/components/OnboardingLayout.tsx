import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { ProgressStepper } from './ProgressStepper';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  onBack: () => void;
}

export function OnboardingLayout({
  children,
  currentStep,
  onBack,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between gap-6">
          <Link
            aria-label="KUMUKA - início"
            className="text-xl font-bold tracking-tight text-primary"
            to={ROUTES.home}
          >
            KUMUKA
          </Link>
          <div className="w-full max-w-xs">
            <ProgressStepper currentStep={currentStep} />
          </div>
        </header>

        <main className="rounded-2xl border border-border bg-[image:var(--gradient-surface)] p-5 shadow-lg shadow-primary/5 sm:p-9">
          {children}
        </main>

        {currentStep > 0 && (
          <Button
            className="self-start"
            onClick={onBack}
            type="button"
            variant="ghost"
          >
            Voltar
          </Button>
        )}
      </div>
    </div>
  );
}