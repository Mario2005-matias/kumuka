export interface Company {
  id: string;
  slug: string;
  nome: string;
  logo: string | null;
  descricao: string;
  area: string;
  website: string | null;
  cultura: string | null;
  status: 'rascunho' | 'publicado' | 'arquivado';
  criadoEm: string;
}
