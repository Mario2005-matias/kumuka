export interface Project {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  tipo: 'tecnico' | 'criativo';
  link: string;
  competencias: string[];
  createdAt: string;
  updatedAt: string;
}
