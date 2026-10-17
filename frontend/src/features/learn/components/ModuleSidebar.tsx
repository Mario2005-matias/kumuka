import { Check, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Trail, TrailProgress } from '@/types/trail';

interface ModuleSidebarProps {
  trail: Trail;
  progress?: TrailProgress;
  activeModuleId: string;
}

export function ModuleSidebar({
  trail,
  progress,
  activeModuleId,
}: ModuleSidebarProps) {
  function canOpen(order: number) {
    return (
      progress?.estado === 'concluido' ||
      order === 1 ||
      Boolean(
        progress?.modulosConcluidos.includes(
          trail.modulos[order - 2]?.id ?? '',
        ),
      )
    );
  }

  const modules = trail.fases.map((phase) => (
    <section className="mb-4 space-y-1" key={phase.id}>
      <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Fase {phase.ordem} · {phase.titulo}
      </h3>
      <ol className="space-y-1">
        {phase.modulos.map((module) => {
          const unlocked = canOpen(module.ordem);
          const complete = progress?.modulosConcluidos.includes(module.id) ?? false;
          return (
            <li key={module.id}>
              {unlocked ? (
                <Link
                  aria-current={module.id === activeModuleId ? 'step' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    module.id === activeModuleId
                      ? 'border-primary/50 bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-surface-1'
                  }`}
                  to={`/aprender/trilhas/${trail.slug}/modulo/${module.id}`}
                >
                  {complete ? <Check aria-hidden="true" className="size-4 text-success" /> : <span className="flex size-4 items-center justify-center text-xs">{String(module.ordem).padStart(2, '0')}</span>}
                  <span className="line-clamp-2">{module.titulo}</span>
                </Link>
              ) : (
                <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground" title="Conclui o módulo anterior para desbloquear este módulo.">
                  <LockKeyhole aria-hidden="true" className="size-4" />
                  <span className="line-clamp-2">{module.titulo}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  ));

  return (
    <>
      <details className="rounded-xl border border-border bg-card p-4 md:hidden">
        <summary className="min-h-11 cursor-pointer content-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Módulos da trilha
        </summary>
        <nav aria-label="Módulos da trilha" className="pt-3">
          {modules}
        </nav>
      </details>
      <aside className="sticky top-24 hidden self-start rounded-xl border border-border bg-card p-4 md:block">
        <h2 className="mb-4 font-semibold">Módulos</h2>
        <nav aria-label="Fases e módulos da trilha">{modules}</nav>
      </aside>
    </>
  );
}
