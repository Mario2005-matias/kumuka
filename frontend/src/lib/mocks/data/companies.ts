import type { Company } from '@/types/company';

export const mockCompanies: Company[] = [
  {
    id: 'company-001', slug: 'unitel', nome: 'Unitel', logo: null,
    descricao: 'Empresa angolana de telecomunicações e serviços digitais.',
    area: 'Telecomunicações', website: 'https://unitel.ao',
    cultura: 'Inovação, colaboração e desenvolvimento de talento local.',
    status: 'publicado', criadoEm: '2026-08-15T10:00:00Z',
  },
  {
    id: 'company-002', slug: 'kianda', nome: 'Kianda', logo: null,
    descricao: 'Equipa tecnológica angolana que desenvolve produtos digitais.',
    area: 'Tecnologia', website: null,
    cultura: 'Aprendizagem contínua e colaboração entre equipas.',
    status: 'publicado', criadoEm: '2026-08-15T10:00:00Z',
  },
  {
    id: 'company-003', slug: 'banco-bai', nome: 'Banco BAI', logo: null,
    descricao: 'Instituição financeira angolana com serviços para pessoas e empresas.',
    area: 'Finanças', website: 'https://www.bancobai.ao',
    cultura: 'Responsabilidade, rigor e serviço à comunidade.',
    status: 'publicado', criadoEm: '2026-08-15T10:00:00Z',
  },
  {
    id: 'company-004', slug: 'refriango', nome: 'Refriango', logo: null,
    descricao: 'Empresa angolana de produção e distribuição de bebidas.',
    area: 'Indústria', website: null,
    cultura: 'Criatividade, qualidade e impacto local.',
    status: 'publicado', criadoEm: '2026-08-15T10:00:00Z',
  },
  {
    id: 'company-005', slug: 'sonangol', nome: 'Sonangol', logo: null,
    descricao: 'Empresa nacional de energia com actividade em diferentes áreas.',
    area: 'Energia', website: 'https://www.sonangol.co.ao',
    cultura: 'Desenvolvimento de competências e compromisso com Angola.',
    status: 'publicado', criadoEm: '2026-08-15T10:00:00Z',
  },
];
