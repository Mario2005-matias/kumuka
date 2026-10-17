import {
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  School,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { revealSection } from '../lib/animations/sectionAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

const audiences: { key: 'students' | 'university' | 'graduates' | 'opportunity' | 'entrepreneurs'; icon: LucideIcon }[] = [
  { key: 'students', icon: School },
  { key: 'university', icon: GraduationCap },
  { key: 'graduates', icon: BriefcaseBusiness },
  { key: 'opportunity', icon: Search },
  { key: 'entrepreneurs', icon: Lightbulb },
];

export function AudienceSection() {
  const { t } = useTranslation('home');
  const sectionRef = useScrollAnimation(revealSection);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="audience-title"
      className="bg-surface-1 py-20 sm:py-28"
      id="para-quem-e"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            data-reveal
            id="audience-title"
          >
            {t('audiencesHeading')}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
            {t('sections.audienceDescription')}
          </p>
        </div>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3 sm:mt-12">
          {audiences.map(({ key, icon: Icon }) => (
            <motion.li
              data-reveal
              key={key}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            >
              <Badge
                className="gap-2 rounded-full border border-border/70 bg-card px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/50"
                variant="secondary"
              >
                <motion.span
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.12 }}
                >
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                </motion.span>
                {t(`sections.audiences.${key}`)}
              </Badge>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
