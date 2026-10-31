import { Clock3, Layers } from 'lucide-react';
import { MediaCard } from '@/components/shared/MediaCard';
import { ROUTES } from '@/lib/constants/routes';
import { isRecent } from '@/lib/categoryIcon';
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
  const badge = completed
    ? t('common.completed')
    : progress
      ? t('hub.completed', { percent: progress.percentual })
      : isRecent(trail.createdAt)
        ? t('common.new')
        : null;

  return (
    <MediaCard
      badge={badge}
      category={trail.categoria}
      description={trail.descricao}
      image={trail.imagem}
      title={trail.titulo}
      to={ROUTES.learn.trail(trail.slug)}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 aria-hidden="true" className="size-3.5" />
          {trail.duracao} h
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers aria-hidden="true" className="size-3.5" />
          {t('trailDetails.moduleCount', { count: trail.totalModulos })}
        </span>
        <span>{t(levelTranslationKeys[trail.nivel])}</span>
      </div>
      {progress && !completed && (
        <ProgressBar label={t('trailDetails.progressLabel', { title: trail.titulo })} value={progress.percentual} />
      )}
    </MediaCard>
  );
}
