import { Award, BookOpenCheck, CalendarCheck, Clock3, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Course, CourseProgress } from '@/types/course';
import { useTranslation } from 'react-i18next';

export function CourseCompletionCard({
  course,
  progress,
}: {
  course: Course;
  progress: CourseProgress;
}) {
  const { t } = useTranslation('learning');
  return (
    <Card className="border-success/30 bg-[image:var(--gradient-surface)]">
      <CardContent className="space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-success">{t('completion.mastered')}</p>
            <h2 className="mt-1 text-xl font-bold">{course.titulo}</h2>
          </div>
          <StatusBadge status="success">{t('completion.courseCompleted')}</StatusBadge>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Clock3 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div><dt className="text-xs text-muted-foreground">{t('completion.estimatedDuration')}</dt><dd className="mt-1 text-sm font-medium">{t('courseDetails.hours', { count: course.duracao })}</dd></div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpenCheck aria-hidden="true" className="mt-0.5 size-5 text-success" />
            <div><dt className="text-xs text-muted-foreground">{t('completion.modulesCompleted')}</dt><dd className="mt-1 text-sm font-medium">{progress.modulosConcluidos.length} / {course.totalModulos}</dd></div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarCheck aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div><dt className="text-xs text-muted-foreground">{t('completion.activitiesSubmitted')}</dt><dd className="mt-1 text-sm font-medium">{progress.atividadesSubmetidas.length}</dd></div>
          </div>
        </dl>
        <div className="rounded-xl border border-success/20 bg-success/5 p-4">
          <p className="flex items-center gap-2 font-semibold">
            <GraduationCap aria-hidden="true" className="size-5 text-success" />
            {t('completion.mastered')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{course.competenciaCentral}</p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Award aria-hidden="true" className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-semibold">{course.certifica ? t('completion.certificateAvailable') : t('completion.noCertificate')}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.certifica
                ? t('completion.certificateComingSoon')
                : t('completion.noCertificateDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
