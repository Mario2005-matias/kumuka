export type CourseLevel = 'iniciante' | 'intermedio' | 'avancado';
export type CourseStatus = 'draft' | 'published';
export type CourseAccess = 'free' | 'premium';

export interface CourseContentItem {
  id: string;
  moduleId: string;
  tipo: 'texto' | 'imagem' | 'link' | 'video';
  titulo: string;
  conteudo: string;
  ordem: number;
}

export interface CourseActivity {
  id: string;
  moduleId: string;
  tipo: 'escrita' | 'upload' | 'link' | 'quiz';
  enunciado: string;
  instrucoes: string;
  obrigatoria: boolean;
  pontos: number;
  perguntas?: {
    id: string;
    enunciado: string;
    opcoes: { id: string; texto: string }[];
    respostaCorretaId: string;
  }[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao: number;
  contentItems: CourseContentItem[];
  activity: CourseActivity | null;
}

export interface Course {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  descricaoLonga: string;
  categoria: string;
  competenciaCentral: string;
  nivel: CourseLevel;
  duracao: number;
  resultadoEsperado: string;
  certifica: boolean;
  status: CourseStatus;
  acesso: CourseAccess;
  preco: number | null;
  imagem: string | null;
  modulos: CourseModule[];
  totalModulos: number;
  preRequisitos: string[];
  publicoAlvo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  tipo: 'course';
  progresso: number;
  moduloAtual: number;
  moduloAtualId: string | null;
  estado: 'nao_iniciado' | 'em_progresso' | 'concluido';
  modulosConcluidos: string[];
  atividadesSubmetidas: string[];
  conteudosLidos: string[];
  rascunhosAtividade: Record<string, string>;
  iniciadoEm: string | null;
  ultimoAcesso: string;
  concluidoEm: string | null;
}
