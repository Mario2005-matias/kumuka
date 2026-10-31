export type TrailLevel = 'iniciante' | 'intermedio' | 'avancado';
export type TrailStatus = 'draft' | 'published' | 'unpublished';
export type TrailAccess = 'free' | 'premium' | 'paid';
export type BlockType = 'texto' | 'video' | 'pdf' | 'imagem' | 'link';
export type ActivityType = 'escrita' | 'upload' | 'link';
export type QuestionType =
  | 'single'
  | 'multiple'
  | 'true_false'
  | 'ordering'
  | 'matching'
  | 'fill_blank';

/** A question as sent to students: never includes the correct answer. */
export interface Question {
  id: string;
  tipo: QuestionType;
  /** Optional scenario shown before the question. */
  contexto: string | null;
  enunciado: string;
  opcoes: { id: string; texto: string }[] | null;
  esquerda: { id: string; texto: string }[] | null;
  direita: { id: string; texto: string }[] | null;
  multipla: boolean;
}

export type Answer = string | string[] | boolean | Record<string, string>;

export interface QuestionResult {
  questionId: string;
  correta: boolean;
  resposta: Answer | null;
  respostaCorreta: Answer | null;
  explicacao: string | null;
  /** Lesson to review when the answer was wrong. */
  lessonId: string | null;
}

export interface QuizAttempt {
  id: string;
  moduleId: string;
  lessonId: string | null;
  perguntas: Question[];
  submetida: boolean;
  nota: number | null;
  aprovada: boolean;
  resultados: QuestionResult[] | null;
  submetidaEm: string | null;
}

export interface ModuleQuizStatus {
  moduleId: string;
  perguntas: number;
  notaMinima: number;
  /** All required lessons are done. */
  desbloqueado: boolean;
  aprovado: boolean;
  melhorNota: number | null;
  tentativas: number;
  tentativaAbertaId: string | null;
  /** Set while the cooldown after a failed attempt is running. */
  disponivelEm: string | null;
}

export interface Activity {
  id: string;
  moduleId: string;
  tipo: ActivityType;
  enunciado: string;
  instrucoes: string;
  obrigatoria: boolean;
  pontos: number;
}

export interface LessonBlock {
  id: string;
  tipo: BlockType;
  titulo: string | null;
  conteudo: string;
  /** Video, PDF, image or link address. */
  url: string | null;
  /** Video length in seconds. */
  duracao: number | null;
  /** Whether watching this block counts towards completing the lesson. */
  acompanhado: boolean;
  ordem: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  titulo: string;
  resumo: string;
  /** Estimated minutes. */
  duracao: number;
  /** Share of each video (0-100) that must be watched. */
  percentagemMinima: number;
  obrigatoria: boolean;
  ordem: number;
  blocos: LessonBlock[];
  verificacao: Question[];
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
  quiz?: { perguntas: number; notaMinima: number } | null;
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
  concluida: boolean;
  verificacaoAprovada: boolean;
  concluidaEm: string | null;
}

export interface BlockProgress {
  percentual: number;
  /** Last video position, used to resume playback. */
  posicao: number | null;
  concluido: boolean;
}

export interface QuizProgress {
  aprovado: boolean;
  melhorNota: number | null;
  disponivelEm: string | null;
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
  /** Average of the best quiz scores across the trail (0-100). */
  dominio: number;
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
  dominio: number;
  moduloAtualId: string | null;
  modulosConcluidos: string[];
  modulosAcessiveis: string[];
  aulas: Record<string, LessonProgress>;
  blocos: Record<string, BlockProgress>;
  quizzes: Record<string, QuizProgress>;
  atividades: Record<string, ActivitySubmission>;
  iniciadoEm: string | null;
  atualizadoEm: string | null;
  concluidoEm: string | null;
}
