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
  modulosConcluidos?: string[];
  atividadesSubmetidas?: string[];
  conteudosLidos?: string[];
  rascunhosAtividade?: Record<string, string>;
  moduloAtual?: number;
  faseAtual?: number;
  fasesConcluidas?: string[];
  iniciadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
}
