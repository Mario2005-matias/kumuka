import { useScrollAnimation, type ScrollAnimation } from '../hooks/useScrollAnimation';
import { MediaCard } from '@/components/shared/MediaCard';
import { useTranslation } from 'react-i18next';

const catalogStats = [
  { value: 6, key: 'trails' },
  { value: 5, key: 'courses' },
  { value: 8, key: 'quickLearnings' },
  { value: 6, key: 'guides' },
] as const;

const animateStats: ScrollAnimation = (gsap, scope, options) => {
  scope.querySelectorAll<HTMLElement>('[data-stat-count]').forEach((element) => {
    const value = Number(element.dataset.statCount);
    if (!Number.isFinite(value)) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value,
      duration: 1.5,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        element.textContent = String(Math.round(counter.value));
      },
      scrollTrigger: {
        trigger: element,
        start: options.start,
        once: true,
      },
    });
  });
};

export function StatsSection() {
  const { t } = useTranslation('home');
  const sectionRef = useScrollAnimation(animateStats);

  return (
    <section
      aria-labelledby="catalog-stats-title"
      className="bg-surface-1 py-20 sm:py-28"
      id="catalogo"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            data-reveal
            id="catalog-stats-title"
          >
            {t('sections.statsHeading')}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
            {t('sections.statsDescription')}
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 lg:grid-cols-4">
          {catalogStats.map(({ value, key }) => (
            <li className="h-full" data-reveal key={key}>
              <MediaCard
                figure={<><span data-stat-count={value}>{value}</span>+</>}
                headingLevel="h3"
                title={t(`sections.stats.${key}`)}
                visual="banner"
              />
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {t('sections.statsNote')}
        </p>
      </div>
    </section>
  );
}
