import { Check, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import type { Course, CourseProgress } from '@/types/course';
import { useTranslation } from 'react-i18next';

export function CourseModuleSidebar({
  course,
  progress,
  activeModuleId,
}: {
  course: Course;
  progress?: CourseProgress;
  activeModuleId: string;
}) {
  const { t } = useTranslation('learning');
  const modules = (
    <ol className="space-y-2">
      {course.modulos.map((module) => {
        const unlocked =
          progress?.estado === 'concluido' ||
          module.ordem === 1 ||
          Boolean(progress?.modulosConcluidos.includes(course.modulos[module.ordem - 2]?.id ?? ''));
        const complete = progress?.modulosConcluidos.includes(module.id) ?? false;
        return (
          <li key={module.id}>
            {unlocked ? (
              <Link
                aria-current={module.id === activeModuleId ? 'step' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  module.id === activeModuleId ? 'border-primary/50 bg-primary/10 text-foreground' : 'border-transparent text-muted-foreground hover:border-border hover:bg-surface-1'
                }`}
                to={ROUTES.learn.courseModule(course.slug, module.id)}
              >
                {complete ? <Check aria-hidden="true" className="size-4 text-success" /> : <span className="flex size-4 items-center justify-center text-xs">{String(module.ordem).padStart(2, '0')}</span>}
                <span className="line-clamp-2">{module.titulo}</span>
              </Link>
            ) : (
              <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground" title={t('common.unlockPrevious')}>
                <LockKeyhole aria-hidden="true" className="size-4" />
                <span className="line-clamp-2">{module.titulo}</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
  return (
    <>
      <details className="rounded-xl border border-border bg-card p-4 lg:hidden">
        <summary className="min-h-11 cursor-pointer content-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {t('courseDetails.modules')}
        </summary>
        <nav aria-label={t('courseDetails.modules')} className="pt-3">{modules}</nav>
      </details>
      <aside className="sticky top-24 hidden self-start rounded-xl border border-border bg-card p-4 lg:block">
        <h2 className="mb-4 font-semibold">{t('courseDetails.modules')}</h2>
        <nav aria-label={t('courseDetails.modules')}>{modules}</nav>
      </aside>
    </>
  );
}
