export interface Module {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  duracao: number;
  conteudos: ContentItem[];
}

export interface ContentItem {
  id: string;
  titulo: string;
  tipo: 'texto' | 'video' | 'recurso';
  conteudo: string;
}
