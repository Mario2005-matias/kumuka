export type TipoExperiencia =
  | 'programa'
  | 'workshop'
  | 'evento'
  | 'mentoria'
  | 'desafio'
  | 'visita';
export type ExperienceStatus = 'inscrita' | 'aberta' | 'sem-vagas' | 'futura' | 'encerrada';
export type ExperienceModality = 'presencial' | 'online' | 'hibrido';

export interface Experience {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  descricaoLonga: string;
  tipo: TipoExperiencia;
  organizadorLogo: string | null;
  empresaId: string | null;
  data: string;
  hora: string;
  dataFim: string | null;
  local: string;
  localDetalhado: string | null;
  modalidade: ExperienceModality;
  beneficios: string[];
  requisitos: string[];
  programa: { hora: string; titulo: string; descricao: string }[];
  oradores: {
    nome: string;
    cargo: string;
    empresa: string;
    foto: string | null;
    bio: string;
  }[];
  vagas: number;
  vagasOcupadas: number;
  estado: ExperienceStatus;
  banner: string | null;
  galeria: string[];
  organizador: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceRegistration {
  id: string;
  userId: string;
  experienceId: string;
  estado: 'inscrito' | 'confirmado' | 'participou' | 'cancelado';
  inscritoEm: string;
}
