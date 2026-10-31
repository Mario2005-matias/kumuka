import { Award, BookOpenCheck, CalendarCheck, Clock3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Trail, TrailProgress } from '@/types/trail';
import { useTranslation } from 'react-i18next';

interface TrailCompletionCardProps {
  trail: Trail;
  progress: TrailProgress;
}

export function TrailCompletionCard({
  trail,
  progress,
}: TrailCompletionCardProps) {
  const { t } = useTranslation('learning');
  const submittedCount = Object.values(progress.atividades).filter((item) => item.aprovada).length;

  return (
    <Card className="elevated rounded-[1.75rem] border-success/30 bg-[image:var(--gradient-surface)]">
      <CardContent className="space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-success">
              {t('trailCompletion.yourJourney')}
            </p>
            <h2 className="mt-1 text-xl font-bold">{trail.titulo}</h2>
          </div>
          <StatusBadge status="success">{t('trailCompletion.completed')}</StatusBadge>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <Clock3 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">{t('completion.estimatedDuration')}</dt>
              <dd className="mt-1 text-sm font-medium">{t('courseDetails.hours', { count: trail.duracao })}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpenCheck aria-hidden="true" className="mt-0.5 size-5 text-success" />
            <div>
              <dt className="text-xs text-muted-foreground">{t('completion.modulesCompleted')}</dt>
              <dd className="mt-1 text-sm font-medium">
                {progress.modulosConcluidos.length} / {trail.totalModulos}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarCheck aria-hidden="true" className="mt-0.5 size-5 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">{t('completion.activitiesSubmitted')}</dt>
              <dd className="mt-1 text-sm font-medium">{submittedCount}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award aria-hidden="true" className="mt-0.5 size-5 text-highlight" />
            <div>
              <dt className="text-xs text-muted-foreground">{t('trailDetails.masteryHint')}</dt>
              <dd className="mt-1 text-sm font-medium">{progress.dominio}%</dd>
            </div>
          </div>
        </dl>
        <div className="rounded-xl border border-success/20 bg-success/5 p-4">
          <p className="flex items-center gap-2 font-semibold">
            <Award aria-hidden="true" className="size-5 text-success" />
            {t('trailCompletion.skillDeveloped')}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {trail.competenciaCentral}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
