export interface Project {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  tipo: 'tecnico' | 'criativo';
  link: string | null;
  competencias: string[];
  createdAt: string;
  updatedAt: string;
}
