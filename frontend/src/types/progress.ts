export type ProgressResourceType = 'trail' | 'course' | 'quick-learning';
export type ProgressStatus = 'concluido' | 'em_progresso';

export interface LearningProgress {
  id: string;
  userId: string;
  recursoTipo: ProgressResourceType;
  recursoId: string;
  percentual: number;
  estado: ProgressStatus;
  moduloAtualId: string | null;
  iniciadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
}
