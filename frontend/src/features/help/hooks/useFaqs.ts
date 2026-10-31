import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface Faq {
  id: string;
  categoria: string;
  pergunta: string;
  resposta: string;
}

interface FaqResponse {
  data: Faq[];
  suporte: { email: string | null };
}

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const { data } = await api.get<FaqResponse>('/faqs');
      return data;
    },
  });
}
