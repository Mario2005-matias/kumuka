import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import type { Trail, TrailLevel, TrailProgress } from '@/types/trail';
import { ProgressBar } from './ProgressBar';
import { useTranslation } from 'react-i18next';

const levelTranslationKeys: Record<TrailLevel, 'courseFilters.beginner' | 'courseFilters.intermediate' | 'courseFilters.advanced'> = {
  iniciante: 'courseFilters.beginner',
  intermedio: 'courseFilters.intermediate',
  avancado: 'courseFilters.advanced',
};

interface TrailCardProps {
  trail: Trail;
  progress?: Pick<TrailProgress, 'estado' | 'percentual'>;
}

export function TrailCard({ trail, progress }: TrailCardProps) {
  const { t } = useTranslation('learning');
  const completed = progress?.estado === 'concluido';
  const action = completed
    ? t('common.review')
    : progress
      ? t('common.continue')
      : t('common.start');

  return (
    <Link
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      to={ROUTES.learn.trail(trail.slug)}
    >
      <Card className="h-full overflow-hidden border-border/80 transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.01] group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5">
        <div
          aria-hidden="true"
          className="relative flex h-28 items-end bg-[image:var(--gradient-brand-soft)] p-4"
        >
          <div className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card/80 text-primary">
            <BookOpen aria-hidden="true" className="size-5" />
          </div>
          <StatusBadge status="neutral">{t(levelTranslationKeys[trail.nivel])}</StatusBadge>
        </div>
        <CardContent className="flex h-[calc(100%-7rem)] flex-col p-5 sm:p-6">
          <h2 className="line-clamp-2 min-h-14 text-lg font-semibold tracking-tight">
            {trail.titulo}
          </h2>
          <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
            {trail.descricao}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              {trail.duracao} h
            </span>
            <span>{trail.competenciaCentral}</span>
          </div>
          {progress && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {completed ? t('common.completed') : t('common.inProgress')}
                </span>
                <span className="text-muted-foreground">
                  {t('hub.completed', { percent: progress.percentual })}
                </span>
              </div>
              <ProgressBar
                label={t('trailDetails.progressLabel', { title: trail.titulo })}
                value={progress.percentual}
              />
            </div>
          )}
          <span
            className={`mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              completed
                ? 'border border-border bg-background text-foreground group-hover:bg-muted'
                : 'bg-[image:var(--gradient-brand)] text-primary-foreground group-hover:brightness-110'
            }`}
          >
            {action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
