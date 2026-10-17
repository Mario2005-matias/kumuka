import type { LearningProgress } from '@/types/progress';
import { mockCourseProgress } from './courseProgress';
import { mockTrails } from './trails';

const completedTrail = mockTrails[0];
const currentTrail = mockTrails[1];
const completedModules = completedTrail.modulos;
const currentModule = currentTrail.modulos[2];

/**
 * Registos de aprendizagem e progresso de Maria Silva.
 * Consumidos por progress.handler.ts.
 */
export const mockProgress: LearningProgress[] = [
  {
    id: 'progress-001',
    userId: 'user-mock-01',
    recursoTipo: 'trail',
    recursoId: completedTrail.id,
    percentual: 100,
    estado: 'concluido',
    moduloAtualId: null,
    modulosConcluidos: completedModules.map((module) => module.id),
    atividadesSubmetidas: completedModules.flatMap((module) =>
      module.atividade ? [module.atividade.id] : [],
    ),
    conteudosLidos: completedModules.flatMap((module) =>
      module.contentItems.map((content) => content.id),
    ),
    rascunhosAtividade: {},
    iniciadoEm: '2026-08-16T10:00:00Z',
    atualizadoEm: '2026-08-20T10:00:00Z',
    concluidoEm: '2026-08-20T10:00:00Z',
  },
  {
    id: 'progress-002',
    userId: 'user-mock-01',
    recursoTipo: 'trail',
    recursoId: currentTrail.id,
    percentual: 35,
    estado: 'em_progresso',
    moduloAtualId: currentModule.id,
    faseAtual: 2,
    modulosConcluidos: currentTrail.modulos.slice(0, 2).map((module) => module.id),
    atividadesSubmetidas: currentTrail.modulos.slice(0, 2).flatMap((module) =>
      module.atividade ? [module.atividade.id] : [],
    ),
    fasesConcluidas: [currentTrail.fases[0].id],
    conteudosLidos: [
      ...currentTrail.modulos.slice(0, 2).flatMap((module) =>
        module.contentItems.map((content) => content.id),
      ),
      currentModule.contentItems[0].id,
    ],
    rascunhosAtividade: {},
    iniciadoEm: '2026-08-22T10:00:00Z',
    atualizadoEm: '2026-09-02T10:00:00Z',
    concluidoEm: null,
  },
  ...mockCourseProgress
    .filter((course) => course.estado !== 'nao_iniciado')
    .map((course): LearningProgress => ({
    id: course.id,
    userId: course.userId,
    recursoTipo: 'course',
    recursoId: course.courseId,
    percentual: course.progresso,
    estado: course.estado === 'nao_iniciado' ? 'em_progresso' : course.estado,
    moduloAtualId: course.moduloAtualId,
    moduloAtual: course.moduloAtual,
    modulosConcluidos: course.modulosConcluidos,
    atividadesSubmetidas: course.atividadesSubmetidas,
    conteudosLidos: course.conteudosLidos,
    rascunhosAtividade: course.rascunhosAtividade,
    iniciadoEm: course.iniciadoEm ?? course.ultimoAcesso,
    atualizadoEm: course.ultimoAcesso,
    concluidoEm: course.concluidoEm,
    })),
  { id: 'progress-004', userId: 'user-mock-01', recursoTipo: 'quick-learning', recursoId: 'quick-001', percentual: 100, estado: 'concluido', moduloAtualId: null, iniciadoEm: '2026-08-16T10:00:00Z', atualizadoEm: '2026-08-16T10:08:00Z', concluidoEm: '2026-08-16T10:08:00Z' },
];
