import { MediaCard } from '@/components/shared/MediaCard';
import {
  BookOpen,
  Compass,
  FileText,
  Folder,
  GraduationCap,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { revealSection } from '../lib/animations/sectionAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

const features: {
  key: 'trails' | 'courses' | 'quickLearnings' | 'guides' | 'experiences' | 'portfolio';
  icon: LucideIcon;
}[] = [
  { key: 'trails', icon: BookOpen },
  { key: 'courses', icon: GraduationCap },
  { key: 'quickLearnings', icon: Zap },
  { key: 'guides', icon: FileText },
  { key: 'experiences', icon: Compass },
  { key: 'portfolio', icon: Folder },
];

export function FeaturesSection() {
  const { t } = useTranslation('home');
  const sectionRef = useScrollAnimation(revealSection);

  return (
    <section
      aria-labelledby="features-title"
      className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      id="o-que-encontrar"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          data-reveal
          id="features-title"
        >
          {t('sections.featuresTitle')}
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
          {t('sections.featuresDescription')}
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ key, icon }) => (
          <div className="h-full" data-reveal key={key}>
            <MediaCard
              description={t(`sections.features.${key}.description`)}
              descriptionLines={0}
              headingLevel="h3"
              icon={icon}
              title={t(`sections.features.${key}.title`)}
              visual="banner"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
