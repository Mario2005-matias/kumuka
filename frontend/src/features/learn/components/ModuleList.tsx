import type { Trail, TrailProgress } from '@/types/trail';
import { groupModulesByPhase, moduleState } from '../lib/modules';
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
      {groupModulesByPhase(trail).map(({ phase, modules }) => (
        <section
          className="space-y-3 rounded-xl border border-border bg-surface-1 p-4 sm:p-5"
          key={phase?.id ?? 'modules'}
        >
          {phase && (
            <header>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t('trailDetails.phaseOf', { current: phase.ordem, total: trail.totalFases })}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{phase.titulo}</h3>
              {phase.descricao && (
                <p className="mt-1 text-sm text-muted-foreground">{phase.descricao}</p>
              )}
            </header>
          )}
          <ol className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <li key={module.id}>
                <ModuleCard module={module} state={moduleState(module, progress)} trail={trail} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
