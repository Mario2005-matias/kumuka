export type TrailLevel = 'iniciante' | 'intermedio' | 'avancado';
export type TrailStatus = 'draft' | 'published' | 'unpublished';
export type TrailAccess = 'free' | 'premium' | 'paid';
export type LessonType = 'texto' | 'video' | 'imagem' | 'link';
export type ActivityType = 'escrita' | 'upload' | 'link' | 'quiz';

export interface QuizQuestion {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
}

export interface Activity {
  id: string;
  moduleId: string;
  tipo: ActivityType;
  enunciado: string;
  instrucoes: string;
  obrigatoria: boolean;
  pontos: number;
  /** Minimum quiz score (0-100) needed to pass. */
  notaMinima: number;
  perguntas: QuizQuestion[] | null;
}

export interface Lesson {
  id: string;
  moduleId: string;
  tipo: LessonType;
  titulo: string;
  conteudo: string;
  mediaUrl: string | null;
  /** Video length in seconds. */
  duracaoMedia: number | null;
  /** Active seconds required before a text or image lesson can count as done. */
  segundosNecessarios: number;
  /** Share of a video (0-100) that must be watched. */
  percentagemMinima: number;
  obrigatoria: boolean;
  ordem: number;
}

export interface TrailModuleSummary {
  id: string;
  faseId: string | null;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao: number;
  totalAulas?: number;
  temAtividade?: boolean;
}

export interface TrailModule extends TrailModuleSummary {
  trailId: string;
  aulas: Lesson[];
  atividade: Activity | null;
}

export interface TrailPhase {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface Trail {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  categoria: string;
  competenciaCentral: string;
  nivel: TrailLevel;
  /** Estimated duration in hours. */
  duracao: number;
  resultadoEsperado: string;
  publicoAlvo: string;
  preRequisitos: string[];
  objetivosAprendizagem: string[];
  status: TrailStatus;
  acesso: TrailAccess;
  preco: number | null;
  imagem: string | null;
  certificado: boolean;
  /** Modules unlock one after another when true. */
  sequencial: boolean;
  totalFases: number;
  totalModulos: number;
  /** Present on the detail endpoint only. */
  fases?: TrailPhase[];
  modulos?: TrailModuleSummary[];
  createdAt: string;
  updatedAt: string;
}

export type TrailProgressStatus = 'nao_iniciado' | 'em_progresso' | 'concluido';

export interface LessonProgress {
  lessonId: string;
  concluida: boolean;
  /** Share (0-100) of the completion requirement already met. */
  percentual: number;
  segundosEnvolvidos: number;
  chegouAoFim: boolean;
  /** Last video position, used to resume playback. */
  posicao: number | null;
  concluidaEm: string | null;
}

export interface ActivitySubmission {
  activityId: string;
  resposta: string | null;
  temFicheiro: boolean;
  submetida: boolean;
  aprovada: boolean;
  nota: number | null;
  tentativas: number;
  submetidaEm: string | null;
}

/** Summary of a started trail, used by the dashboard and journey. */
export interface TrailEnrollment {
  id: string;
  trailId: string;
  estado: Exclude<TrailProgressStatus, 'nao_iniciado'>;
  percentual: number;
  moduloAtualId: string | null;
  iniciadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
  trilha?: Trail;
}

export interface TrailProgress {
  trailId: string;
  estado: TrailProgressStatus;
  percentual: number;
  moduloAtualId: string | null;
  modulosConcluidos: string[];
  modulosAcessiveis: string[];
  aulas: Record<string, LessonProgress>;
  atividades: Record<string, ActivitySubmission>;
  iniciadoEm: string | null;
  atualizadoEm: string | null;
  concluidoEm: string | null;
}
