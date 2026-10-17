import type { Trail, TrailProgress } from '@/types/trail';
import { ModuleCard } from './ModuleCard';
import { useTranslation } from 'react-i18next';

interface ModuleListProps {
  trail: Trail;
  progress?: TrailProgress;
}

export function ModuleList({ trail, progress }: ModuleListProps) {
  const { t } = useTranslation('learning');
  return (
    <div className="space-y-5">
      {trail.fases.map((phase) => (
        <section className="space-y-3 rounded-xl border border-border bg-surface-1 p-4 sm:p-5" key={phase.id}>
          <header className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t('trailDetails.phaseOf', { current: phase.ordem, total: trail.totalFases })}</p>
              <h3 className="mt-1 text-lg font-semibold">{phase.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{phase.descricao}</p>
            </div>
            <span className="text-sm text-muted-foreground">{t('courseDetails.hours', { count: Math.round(phase.duracao / 60 * 10) / 10 })}</span>
          </header>
          <ol className="grid gap-4 md:grid-cols-2">
            {phase.modulos.map((module) => {
              const completed = progress?.modulosConcluidos.includes(module.id) ?? false;
              const previousComplete = module.ordem === 1 ||
                (progress?.modulosConcluidos.includes(trail.modulos[module.ordem - 2]?.id ?? '') ?? false);
              const state = completed
                ? 'completed'
                : !previousComplete
                  ? 'locked'
                  : progress?.moduloAtualId === module.id
                    ? 'active'
                    : 'available';
              return (
                <li key={module.id}>
                  <ModuleCard module={module} progress={progress} state={state} trail={trail} />
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
