import {
  CheckCircle2,
  Circle,
  Clock3,
  LockKeyhole,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaCard } from '@/components/shared/MediaCard';
import { ROUTES } from '@/lib/constants/routes';
import type { Trail, TrailModuleSummary } from '@/types/trail';
import type { ModuleState } from '../lib/modules';
import { useTranslation } from 'react-i18next';

interface ModuleCardProps {
  trail: Trail;
  module: TrailModuleSummary;
  state: ModuleState;
}

export function ModuleCard({ trail, module, state }: ModuleCardProps) {
  const { t } = useTranslation('learning');
  const isLocked = state === 'locked';
  const isComplete = state === 'completed';
  const isCurrent = state === 'active';
  const action = isLocked
    ? t('common.locked')
    : isComplete
      ? t('common.review')
      : isCurrent
        ? t('common.continue')
        : t('common.start');
  const StateIcon = isLocked
    ? LockKeyhole
    : isComplete
      ? CheckCircle2
      : isCurrent
        ? PlayCircle
        : Circle;
  const modulePath = ROUTES.learn.trailModule(trail.slug, module.id);

  const content = (
    <MediaCard
      badge={t('common.moduleNumber', { number: String(module.ordem).padStart(2, '0') })}
      className={isLocked ? 'bg-muted/30 opacity-75' : 'group-hover:-translate-y-1 group-hover:border-primary/40'}
      description={module.descricao}
      descriptionLines={3}
      headingLevel="h3"
      icon={StateIcon}
      title={module.titulo}
      visual="banner"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Clock3 aria-hidden="true" className="size-4 text-primary" />
          {t('catalog.duration', { count: module.duracao })}
        </span>
        {module.totalAulas !== undefined && (
          <span>{t('trailDetails.lessonCount', { count: module.totalAulas })}</span>
        )}
        {module.temAtividade && <span>{t('trailDetails.hasActivity')}</span>}
      </div>
      <span
        className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium ${
          isLocked
            ? 'cursor-not-allowed text-muted-foreground'
            : isComplete
              ? 'border border-border text-foreground'
              : 'bg-primary text-primary-foreground'
        }`}
      >
        {action}
      </span>
    </MediaCard>
  );

  if (isLocked) {
    return (
      <div aria-disabled="true" className="h-full cursor-not-allowed" title={t('common.unlockPrevious')}>
        {content}
      </div>
    );
  }

  return (
    <Link
      aria-current={isCurrent ? 'step' : undefined}
      className="group block h-full rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to={modulePath}
    >
      {content}
    </Link>
  );
}
