import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { animateJourney, defaultJourneyOptions } from '../lib/animations/sectionAnimations';
import { MediaCard } from '@/components/shared/MediaCard';
import { useTranslation } from 'react-i18next';

const steps: {
  key: 'learn' | 'develop' | 'do' | 'prove' | 'experience' | 'advance';
  icon: LucideIcon;
}[] = [
  { key: 'learn', icon: BookOpen },
  { key: 'develop', icon: TrendingUp },
  { key: 'do', icon: Hammer },
  { key: 'prove', icon: Award },
  { key: 'experience', icon: Compass },
  { key: 'advance', icon: BriefcaseBusiness },
];

export function JourneySection() {
  const { t } = useTranslation('home');
  const sectionRef = useScrollAnimation(animateJourney, defaultJourneyOptions);

  return (
    <section
      aria-labelledby="journey-title"
      className="relative overflow-hidden bg-surface-1 py-20 sm:py-28"
      id="como-funciona"
      ref={sectionRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-glow)] opacity-60"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            data-reveal
            id="journey-title"
          >
            {t('sections.journeyTitle')}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
            {t('sections.journeyDescription')}
          </p>
        </div>
        <ol
          className="relative mx-auto mt-12 grid max-w-5xl gap-y-5 sm:mt-16 sm:gap-y-7"
          data-journey-list
        >
          <li
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-[1.375rem] top-0 w-px bg-border lg:left-1/2"
          >
            <span
              className="journey-progress-fill absolute inset-0 block origin-top bg-primary"
              data-journey-progress
            />
          </li>
          {steps.map(({ key, icon }, index) => (
            <li
              className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] lg:gap-x-6"
              key={key}
            >
              <div
                aria-hidden="true"
                className="relative z-10 col-start-1 row-start-1 mt-5 flex size-11 items-center justify-center rounded-full border border-border bg-card text-sm font-bold tabular-nums text-muted-foreground transition-colors lg:col-start-2"
                data-step-number
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <div
                className={`journey-step relative z-10 col-start-2 row-start-1 h-full ${index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'}`}
                data-journey-card
              >
                <MediaCard
                  badge={String(index + 1).padStart(2, '0')}
                  description={t(`sections.journeySteps.${key}.description`)}
                  descriptionLines={0}
                  headingLevel="h3"
                  icon={icon}
                  title={t(`sections.journeySteps.${key}.title`)}
                  visual="banner"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
