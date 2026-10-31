import {
  CheckCircle2,
  Circle,
  Clock3,
  LockKeyhole,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card
      className={`h-full border-border transition-[border-color,box-shadow,transform] duration-200 ${
        isLocked
          ? 'bg-muted/30 opacity-75'
          : 'hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg'
      }`}
    >
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
              isComplete
                ? 'border-success/30 bg-success/10 text-success'
                : isCurrent
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-surface-1 text-muted-foreground'
            }`}
          >
            <StateIcon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('common.moduleNumber', { number: String(module.ordem).padStart(2, '0') })}
            </p>
            <h3 className="mt-1 font-semibold">{module.titulo}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {module.descricao}
            </p>
          </div>
        </div>
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
          className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium ${
            isLocked
              ? 'cursor-not-allowed text-muted-foreground'
              : isComplete
                ? 'text-foreground'
                : 'bg-primary text-primary-foreground'
          }`}
        >
          {action}
        </span>
      </CardContent>
    </Card>
  );

  if (isLocked) {
    return (
      <div aria-disabled="true" className="cursor-not-allowed" title={t('common.unlockPrevious')}>
        {content}
      </div>
    );
  }

  return (
    <Link
      aria-current={isCurrent ? 'step' : undefined}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to={modulePath}
    >
      {content}
    </Link>
  );
}
