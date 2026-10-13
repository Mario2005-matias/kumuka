import type { Experience } from '@/types/experience';

/**
 * Seis experiências com as datas indicadas; não há experiência encerrada porque todas as datas são futuras.
 * Consumidas por: experiences.handler.ts.
 */
export const mockExperiences: Experience[] = [
  { id: 'exp-001', slug: 'futuro-carreira-2026', titulo: 'Futuro Carreira 2026', descricao: 'Encontro dedicado a carreira e oportunidades para jovens. Consulta a data e os detalhes de participação.', data: '2026-11-15', local: 'Luanda', modalidade: 'presencial', vagas: 50, vagasOcupadas: 32, estado: 'inscrita', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
  { id: 'exp-002', slug: 'workshop-marketing-digital', titulo: 'Workshop de Marketing Digital', descricao: 'Sessão prática sobre conceitos de marketing digital. Consulta a data e os detalhes de participação.', data: '2026-12-20', local: 'Online', modalidade: 'online', vagas: 100, vagasOcupadas: 40, estado: 'aberta', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
  { id: 'exp-003', slug: 'mentoria-com-lideres', titulo: 'Mentoria com Líderes', descricao: 'Encontro de mentoria sobre percursos e desenvolvimento. Consulta a data e os detalhes de participação.', data: '2027-01-15', local: 'Luanda', modalidade: 'presencial', vagas: 20, vagasOcupadas: 20, estado: 'sem-vagas', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
  { id: 'exp-004', slug: 'futuro-tech-2026', titulo: 'Futuro Tech 2026', descricao: 'Experiência para explorar tecnologia e as suas aplicações. Consulta a data e os detalhes de participação.', data: '2027-02-05', local: 'Benguela', modalidade: 'presencial', vagas: 80, vagasOcupadas: 36, estado: 'aberta', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
  { id: 'exp-005', slug: 'futuro-empreendedor', titulo: 'Futuro Empreendedor', descricao: 'Programa sobre ideias e caminhos de empreendedorismo. Consulta a data e os detalhes de participação.', data: '2027-02-20', local: 'Luanda', modalidade: 'presencial', vagas: 60, vagasOcupadas: 18, estado: 'futura', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
  { id: 'exp-006', slug: 'desafio-de-inovacao', titulo: 'Desafio de Inovação', descricao: 'Desafio online para explorar ideias e propostas de inovação. Consulta a data e os detalhes de participação.', data: '2027-03-10', local: 'Online', modalidade: 'online', vagas: 200, vagasOcupadas: 72, estado: 'futura', organizador: 'Líderes do Futuro', createdAt: '2026-08-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z' },
];
