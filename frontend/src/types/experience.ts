export type ExperienceStatus = 'inscrita' | 'aberta' | 'sem-vagas' | 'futura';

export interface Experience {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  modalidade: 'presencial' | 'online';
  vagas: number;
  vagasOcupadas: number;
  estado: ExperienceStatus;
  organizador: string;
  createdAt: string;
  updatedAt: string;
}
