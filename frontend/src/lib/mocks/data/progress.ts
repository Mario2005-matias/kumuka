import type { LearningProgress } from '@/types/progress';

/**
 * Quatro registos de aprendizagem que compõem o progresso de Maria Silva.
 * Consumidos por: progress.handler.ts.
 */
export const mockProgress: LearningProgress[] = [
  { id: 'progress-001', userId: 'user-mock-01', recursoTipo: 'trail', recursoId: 'trail-001', percentual: 100, estado: 'concluido', moduloAtualId: null, iniciadoEm: '2026-08-16T10:00:00Z', atualizadoEm: '2026-08-20T10:00:00Z', concluidoEm: '2026-08-20T10:00:00Z' },
  { id: 'progress-002', userId: 'user-mock-01', recursoTipo: 'trail', recursoId: 'trail-002', percentual: 35, estado: 'em_progresso', moduloAtualId: 'module-trail-002-02', iniciadoEm: '2026-08-22T10:00:00Z', atualizadoEm: '2026-09-02T10:00:00Z', concluidoEm: null },
  { id: 'progress-003', userId: 'user-mock-01', recursoTipo: 'course', recursoId: 'course-001', percentual: 70, estado: 'em_progresso', moduloAtualId: 'module-course-001-05', iniciadoEm: '2026-08-23T10:00:00Z', atualizadoEm: '2026-09-04T10:00:00Z', concluidoEm: null },
  { id: 'progress-004', userId: 'user-mock-01', recursoTipo: 'quick-learning', recursoId: 'quick-001', percentual: 100, estado: 'concluido', moduloAtualId: null, iniciadoEm: '2026-08-16T10:00:00Z', atualizadoEm: '2026-08-16T10:08:00Z', concluidoEm: '2026-08-16T10:08:00Z' },
];
