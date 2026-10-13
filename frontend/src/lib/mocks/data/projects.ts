import type { Project } from '@/types/project';

/**
 * Dois projectos de portefólio apresentados no perfil de Maria Silva.
 * Consumidos por: projects.handler.ts.
 */
export const mockProjects: Project[] = [
  {
    id: 'project-001',
    slug: 'analise-redes-sociais-refriango',
    titulo: 'Análise de Redes Sociais da Refriango',
    descricao: 'Projecto de análise de redes sociais com foco em marketing digital e leitura de dados.',
    tipo: 'criativo',
    link: 'https://github.com/maria-silva/analise-refriango',
    competencias: ['Marketing Digital', 'Análise de Dados'],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'project-002',
    slug: 'website-pessoal-portfolio',
    titulo: 'Website Pessoal com Portefólio',
    descricao: 'Website pessoal para apresentar trabalhos e competências de desenvolvimento web.',
    tipo: 'tecnico',
    link: 'https://mariasilva.ao',
    competencias: ['React', 'Design', 'Desenvolvimento Web'],
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-22T10:00:00Z',
  },
];
