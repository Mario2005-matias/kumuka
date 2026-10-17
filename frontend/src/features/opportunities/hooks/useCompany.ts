import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Company } from '@/types/company';

export function useCompany(companyId: string) {
  return useQuery({
    queryKey: ['companies', companyId],
    enabled: Boolean(companyId),
    queryFn: async (): Promise<Company | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { companiesHandler } = await import('@/lib/mocks/handlers/companies.handler');
        return companiesHandler.detail(companyId);
      }
      const { data } = await api.get<Company | null>(
        `/companies/${encodeURIComponent(companyId)}`,
      );
      return data;
    },
  });
}
