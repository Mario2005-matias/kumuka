import type { Trail, TrailModuleSummary, TrailPhase, TrailProgress } from '@/types/trail';

export type ModuleState = 'completed' | 'active' | 'available' | 'locked';

export interface ModuleGroup {
  phase: TrailPhase | null;
  modules: TrailModuleSummary[];
}

/**
 * Groups modules by phase. Trails without phases (former courses) produce a single
 * group with no phase.
 */
export function groupModulesByPhase(trail: Trail): ModuleGroup[] {
  const modules = trail.modulos ?? [];
  const phases = trail.fases ?? [];
  if (!phases.length) return [{ phase: null, modules }];

  const groups: ModuleGroup[] = phases.map((phase) => ({
    phase,
    modules: modules.filter((module) => module.faseId === phase.id),
  }));
  const withoutPhase = modules.filter((module) => !phases.some((phase) => phase.id === module.faseId));
  if (withoutPhase.length) groups.push({ phase: null, modules: withoutPhase });
  return groups;
}

/**
 * Module state as decided by the server (completion and unlocking).
 */
export function moduleState(
  module: TrailModuleSummary,
  progress: TrailProgress | undefined,
): ModuleState {
  if (progress?.modulosConcluidos.includes(module.id)) return 'completed';
  const started = progress && progress.estado !== 'nao_iniciado';
  if (started && !progress.modulosAcessiveis.includes(module.id)) return 'locked';
  if (!started && module.ordem !== 1) return 'locked';
  return progress?.moduloAtualId === module.id ? 'active' : 'available';
}
