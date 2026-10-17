import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { ROUTES } from '@/lib/constants/routes';
import { useOnboardingStore } from '../store';
import { useTranslation } from 'react-i18next';

export default function OnboardingCompletePage() {
  const { t } = useTranslation('onboarding');
  const name = useOnboardingStore((state) => state.draft.name);
  const complete = useOnboardingStore((state) => state.complete);

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
      <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
        <section className="w-full max-w-lg space-y-6 rounded-2xl border bg-background p-8 text-center shadow-sm">
          <div
            aria-hidden="true"
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl"
          >
            🎉
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {name
                ? t('complete.congratulationsNamed', { name })
                : t('complete.congratulations')}
            </h1>
            <p className="leading-7 text-muted-foreground">
              {t('complete.description')}
            </p>
          </div>
          <Button
            className="w-full"
            nativeButton={false}
            onClick={complete}
            render={<Link to={ROUTES.dashboard} />}
          >
            {t('complete.explore')}
          </Button>
        </section>
      </main>
    </>
  );
}