import { mockTrails } from '../data/trails';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { Trail } from '@/types/trail';

type TrailParams = PaginationParams & { search?: string };

/**
 * Handler de trilhas.
 * Simula GET /api/trails, GET /api/trails/:slug e GET /api/trails/:slug/modules/:id.
 */
export const trailsHandler = {
  async list(params: TrailParams = {}): Promise<Trail[]> {
    await delay();
    const found = params.search
      ? search(mockTrails, params.search, ['titulo', 'descricao', 'competenciaCentral'])
      : [...mockTrails];
    return paginate(sort(found, (trail) => trail.titulo), params).items;
  },

  async detail(slug: string): Promise<Trail | null> {
    await delay();
    return mockTrails.find((trail) => trail.slug === slug) ?? null;
  },

  async module(trailSlug: string, moduleId: string): Promise<Trail['modulos'][number] | null> {
    await delay();
    const trail = mockTrails.find((item) => item.slug === trailSlug);
    return trail?.modulos.find((item) => item.id === moduleId) ?? null;
  },
};
