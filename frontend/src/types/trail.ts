export type TrailLevel = 'iniciante' | 'intermedio' | 'avancado';
export type TrailStatus = 'draft' | 'published' | 'unpublished';
export type TrailAccess = 'free' | 'premium' | 'paid';

export interface QuizQuestion {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
  respostaCorretaId: string;
}

export interface Activity {
  id: string;
  moduleId: string;
  tipo: 'escrita' | 'upload' | 'link' | 'quiz';
  enunciado: string;
  instrucoes: string;
  obrigatoria: boolean;
  pontos: number;
  perguntas?: QuizQuestion[];
}

export interface TrailContentItem {
  id: string;
  moduleId: string;
  tipo: 'texto' | 'imagem' | 'link' | 'video';
  titulo: string;
  conteudo: string;
  ordem: number;
}

export interface TrailModule {
  id: string;
  trailId: string;
  faseId: string;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao: number;
  contentItems: TrailContentItem[];
  atividade: Activity | null;
}

export interface TrailPhase {
  id: string;
  trailId: string;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao: number;
  modulos: TrailModule[];
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
  modulos: TrailModule[];
  fases: TrailPhase[];
  totalFases: number;
  totalModulos: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrailProgress {
  id: string;
  userId: string;
  recursoTipo: 'trail';
  recursoId: string;
  percentual: number;
  estado: 'em_progresso' | 'concluido';
  moduloAtualId: string | null;
  moduloAtual: number;
  faseAtual: number;
  modulosConcluidos: string[];
  fasesConcluidas: string[];
  atividadesSubmetidas: string[];
  conteudosLidos: string[];
  rascunhosAtividade: Record<string, string>;
  iniciadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
}
