import type { Company } from '@/types/company';
import { mockCompanies } from '../data/companies';
import { delay } from '../utils/delay';

export const companiesHandler = {
  async detail(companyId: string): Promise<Company | null> {
    await delay();
    return mockCompanies.find((company) => company.id === companyId) ?? null;
  },
};
