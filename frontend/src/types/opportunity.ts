import type { ExperienceModality } from './experience';

export type TipoOportunidade =
  | 'estagio'
  | 'emprego'
  | 'trainee'
  | 'bolsa'
  | 'programa'
  | 'mentoria'
  | 'desafio'
  | 'concurso'
  | 'voluntariado';
export type EstadoOportunidade = 'aberta' | 'fechada' | 'prazo_encerrado';

export interface Opportunity {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  descricaoLonga: string;
  tipo: TipoOportunidade;
  empresaId: string;
  empresaNome: string;
  empresaLogo: string | null;
  area: string;
  localizacao: string;
  modalidade: ExperienceModality;
  responsabilidades: string[];
  requisitos: string[];
  beneficios: string[];
  prazo: string;
  ctaTipo: 'interesse' | 'candidatura';
  ctaDestino: string | null;
  estado: EstadoOportunidade;
  banner: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface OpportunityApplication {
  id: string;
  userId: string;
  opportunityId: string;
  tipo: 'interesse' | 'candidatura';
  estado: 'registado' | 'em_analise' | 'encaminhado' | 'fechado';
  registadoEm: string;
}
