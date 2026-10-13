export interface Guide {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  conteudo: string;
  status: 'draft' | 'published' | 'unpublished';
  createdAt: string;
  updatedAt: string;
}
