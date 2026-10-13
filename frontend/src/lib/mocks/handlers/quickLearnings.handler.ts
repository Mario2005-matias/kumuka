import { mockQuickLearnings } from '../data/quickLearnings';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { QuickLearning } from '@/types/quick-learning';

type QuickLearningParams = PaginationParams & { search?: string };

/**
 * Handler de aprendizados curtos.
 * Simula GET /api/quick-learnings e GET /api/quick-learnings/:slug.
 */
export const quickLearningsHandler = {
  async list(params: QuickLearningParams = {}): Promise<QuickLearning[]> {
    await delay();
    const found = params.search
      ? search(mockQuickLearnings, params.search, ['titulo', 'descricao', 'categoria'])
      : [...mockQuickLearnings];
    return paginate(sort(found, (item) => item.titulo), params).items;
  },

  async detail(slug: string): Promise<QuickLearning | null> {
    await delay();
    return mockQuickLearnings.find((item) => item.slug === slug) ?? null;
  },
};
