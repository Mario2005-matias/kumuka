import { useQuery } from '@tanstack/react-query';
import { getData } from '@/lib/api/client';
import type { Company } from '@/types/company';

export function useCompany(companyId: string) {
  return useQuery({
    queryKey: ['companies', companyId],
    enabled: Boolean(companyId),
    queryFn: () => getData<Company>(`/companies/${encodeURIComponent(companyId)}`),
  });
}
