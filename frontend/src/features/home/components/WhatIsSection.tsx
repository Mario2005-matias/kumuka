import { BookOpen, BriefcaseBusiness, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { revealSection } from '../lib/animations/sectionAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const pillars: { key: 'learn' | 'prove' | 'opportunities'; icon: LucideIcon }[] = [
  { key: 'learn', icon: BookOpen },
  { key: 'prove', icon: Target },
  { key: 'opportunities', icon: BriefcaseBusiness },
];

export function WhatIsSection() {
  const { t } = useTranslation('home');
  const sectionRef = useScrollAnimation(revealSection);

  return (
    <section
      aria-labelledby="what-is-title"
      className="container mx-auto scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      id="o-que-e-a-kumuka"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          data-reveal
          id="what-is-title"
        >
          {t('sections.whatIsTitle')}
        </h2>
        <p className="mt-4 text-pretty leading-7 text-muted-foreground" data-reveal>
          {t('sections.whatIsDescription')}
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3">
        {pillars.map(({ key, icon: Icon }) => (
          <Card
            className="h-full border border-border/70 bg-card/80 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            data-reveal
            key={key}
          >
            <CardHeader>
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-6" />
              </div>
              <CardTitle className="text-lg">
                {t(`sections.pillars.${key}.title`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="leading-6 text-muted-foreground">
              {t(`sections.pillars.${key}.description`)}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
