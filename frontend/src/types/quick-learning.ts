export interface QuickLearning {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  duracao: number;
  conteudo: string;
  status: 'draft' | 'published' | 'unpublished';
  createdAt: string;
  updatedAt: string;
}
