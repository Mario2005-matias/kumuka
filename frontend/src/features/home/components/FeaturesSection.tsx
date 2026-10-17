import {
  BookOpen,
  Compass,
  FileText,
  Folder,
  GraduationCap,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { revealSection } from '../lib/animations/sectionAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const prefersReducedMotion = usePrefersReducedMotion();

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
        {features.map(({ key, icon: Icon }) => (
          <motion.div
            className="h-full"
            key={key}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          >
            <Card
              className="group h-full border border-border/70 bg-card/80 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              data-reveal
            >
              <CardHeader>
                <motion.div
                  className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  whileHover={prefersReducedMotion ? undefined : { rotate: 5 }}
                >
                  <Icon aria-hidden="true" className="size-7" />
                </motion.div>
                <CardTitle className="text-lg">
                  {t(`sections.features.${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="leading-6 text-muted-foreground">
                {t(`sections.features.${key}.description`)}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
