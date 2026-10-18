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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
          {steps.map(({ key, icon: Icon }, index) => (
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
              <Card
                className={`relative journey-step relative z-10 col-start-2 row-start-1 h-full border border-border/80 bg-card/90 transition-[border-color,box-shadow] duration-300 ${index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'}`}
                data-journey-card
              >
                <CardHeader className={` flex-row items-start justify-between gap-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className='absolute -top-5 -left-5 w-30 h-30 bg-cyan-400/40 blur-2xl z-0 rounded-full animate-pulse'></div>
                  <div
                    className="z-10 flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    data-step-icon
                  >
                    <Icon aria-hidden="true" className="size-6 text-cyan-600" />
                  </div>
                  
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 text-7xl font-bold tabular-nums text-muted-foreground/30"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>                  
                </CardHeader>
                <CardContent className={index % 2 === 0 ? 'lg:text-right' : ''}>
                  <CardTitle className="text-lg">
                    {t(`sections.journeySteps.${key}.title`)}
                  </CardTitle>
                  <p className="mt-2 leading-6 text-muted-foreground">
                    {t(`sections.journeySteps.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
