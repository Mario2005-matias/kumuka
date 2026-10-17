import type { Opportunity, OpportunityApplication } from '@/types/opportunity';
import { mockOpportunities } from '../data/opportunities';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';

type OpportunityParams = PaginationParams & {
  search?: string;
  tipo?: Opportunity['tipo'];
  area?: string;
  empresa?: string;
  localizacao?: string;
  modalidade?: Opportunity['modalidade'];
  prazo?: 'semana' | 'mes' | 'tres-meses';
};

const applicationsKey = 'kumuka-mock-opportunity-applications';

function isOpportunityApplication(value: unknown): value is OpportunityApplication {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'userId' in value && typeof value.userId === 'string' &&
    'opportunityId' in value && typeof value.opportunityId === 'string' &&
    'tipo' in value && ['interesse', 'candidatura'].includes(String(value.tipo)) &&
    'estado' in value && ['registado', 'em_analise', 'encaminhado', 'fechado'].includes(String(value.estado)) &&
    'registadoEm' in value && typeof value.registadoEm === 'string'
  );
}

function readApplications(): OpportunityApplication[] {
  const saved = localStorage.getItem(applicationsKey);
  if (!saved) return [];
  const parsed: unknown = JSON.parse(saved);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(isOpportunityApplication)
  ) {
    throw new Error('As candidaturas guardadas têm um formato inválido.');
  }
  return parsed;
}

function withinDeadline(date: string, period: OpportunityParams['prazo']): boolean {
  if (!period) return true;
  const days = (new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86_400_000;
  const maximum = period === 'semana' ? 7 : period === 'mes' ? 31 : 92;
  return days >= 0 && days <= maximum;
}

export const opportunitiesHandler = {
  async list(params: OpportunityParams = {}): Promise<Opportunity[]> {
    await delay();
    let found = [...mockOpportunities].filter((item) => item.estado === 'aberta');
    if (params.search) {
      found = search(found, params.search, ['titulo', 'descricao', 'empresaNome', 'area', 'localizacao']);
    }
    if (params.tipo) found = found.filter((item) => item.tipo === params.tipo);
    if (params.area) found = found.filter((item) => item.area === params.area);
    if (params.empresa) found = found.filter((item) => item.empresaNome === params.empresa);
    if (params.localizacao) {
      const location = params.localizacao.toLocaleLowerCase();
      found = found.filter((item) =>
        item.localizacao.toLocaleLowerCase().includes(location),
      );
    }
    if (params.modalidade) found = found.filter((item) => item.modalidade === params.modalidade);
    if (params.prazo) found = found.filter((item) => withinDeadline(item.prazo, params.prazo));
    return paginate(sort(found, (item) => item.prazo), params).items;
  },

  async detail(slug: string): Promise<Opportunity | null> {
    await delay();
    return mockOpportunities.find((item) => item.slug === slug) ?? null;
  },

  async applications(userId: string): Promise<OpportunityApplication[]> {
    await delay();
    return readApplications().filter((item) => item.userId === userId);
  },

  async apply(userId: string, opportunityId: string): Promise<OpportunityApplication> {
    await delay();
    const opportunity = mockOpportunities.find((item) => item.id === opportunityId);
    if (!opportunity) throw new Error('A oportunidade indicada não existe.');
    if (opportunity.estado !== 'aberta' || new Date(`${opportunity.prazo}T23:59:59`) < new Date()) {
      throw new Error('O prazo desta oportunidade já terminou.');
    }
    const applications = readApplications();
    const existing = applications.find(
      (item) => item.userId === userId && item.opportunityId === opportunityId,
    );
    if (existing) return existing;
    const application: OpportunityApplication = {
      id: `application-${userId}-${opportunityId}`,
      userId,
      opportunityId,
      tipo: opportunity.ctaTipo,
      estado: 'registado',
      registadoEm: new Date().toISOString(),
    };
    localStorage.setItem(applicationsKey, JSON.stringify([...applications, application]));
    return application;
  },
};
