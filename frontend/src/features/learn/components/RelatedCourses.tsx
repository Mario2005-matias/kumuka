import { Link } from 'react-router-dom';
import { CourseCard } from '@/features/learn/components/CourseCard';
import { ROUTES } from '@/lib/constants/routes';
import type { Course, CourseProgress } from '@/types/course';
import { useTranslation } from 'react-i18next';

export function RelatedCourses({
  course,
  courses,
  progressByCourse,
}: {
  course: Course;
  courses: Course[];
  progressByCourse: Map<string, CourseProgress>;
}) {
  const { t } = useTranslation('learning');
  const related = courses
    .filter((item) => item.id !== course.id && item.categoria === course.categoria)
    .slice(0, 3);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related-courses-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t('related.nextStep')}</p>
          <h2 className="mt-1 text-2xl font-bold" id="related-courses-title">{t('related.courses')}</h2>
        </div>
        <Link className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline" to={ROUTES.learn.courses}>
          {t('related.exploreAll')}
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {related.map((item) => {
          const progress = progressByCourse.get(item.id);
          return (
            <CourseCard
              course={item}
              key={item.id}
              progress={progress ? { estado: progress.estado, progresso: progress.progresso } : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
