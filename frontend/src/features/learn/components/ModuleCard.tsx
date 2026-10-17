import {
  CheckCircle2,
  Circle,
  Clock3,
  LockKeyhole,
  PlayCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Trail, TrailModule, TrailProgress } from '@/types/trail';
import { ProgressBar } from './ProgressBar';
import { useTranslation } from 'react-i18next';

type ModuleState = 'completed' | 'active' | 'available' | 'locked';

interface ModuleCardProps {
  trail: Trail;
  module: TrailModule;
  progress?: TrailProgress;
  state: ModuleState;
}

export function ModuleCard({
  trail,
  module,
  progress,
  state,
}: ModuleCardProps) {
  const { t } = useTranslation('learning');
  const isLocked = state === 'locked';
  const isComplete = state === 'completed';
  const isCurrent = progress?.moduloAtualId === module.id;
  const readCount =
    progress?.conteudosLidos.filter((id) =>
      module.contentItems.some((content) => content.id === id),
    ).length ?? 0;
  const modulePercent = isComplete
    ? 100
    : module.contentItems.length
      ? Math.round((readCount / module.contentItems.length) * 100)
      : 0;
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
  const modulePath = `/aprender/trilhas/${trail.slug}/modulo/${module.id}`;

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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-4 text-primary" />
          {t('catalog.duration', { count: module.duracao })}
        </div>
        {progress && !isLocked && (
          <ProgressBar
            label={t('trailModule.moduleProgressLabel', { title: module.titulo })}
            value={modulePercent}
          />
        )}
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
