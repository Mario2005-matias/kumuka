import type { Trail, TrailLevel, TrailModule, TrailProgress } from '@/types/trail';
import type { PaginationParams } from '../types/mock.types';
import { mockTrails } from '../data/trails';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import { progressHandler } from './progress.handler';

type TrailParams = PaginationParams & {
  search?: string;
  nivel?: TrailLevel;
  categoria?: string;
  duracao?: 'menos-5' | '5-10' | 'mais-10';
};

/**
 * Handler de trilhas e operações de progresso do percurso.
 */
export const trailsHandler = {
  async list(params: TrailParams = {}): Promise<Trail[]> {
    await delay();
    let found = mockTrails.filter((trail) => trail.status === 'published');
    if (params.search) {
      found = search(found, params.search, [
        'titulo',
        'descricao',
        'descricaoLonga',
        'competenciaCentral',
      ]);
    }
    if (params.nivel) {
      found = found.filter((trail) => trail.nivel === params.nivel);
    }
    if (params.categoria) {
      found = found.filter((trail) => trail.categoria === params.categoria);
    }
    if (params.duracao === 'menos-5') {
      found = found.filter((trail) => trail.duracao < 5);
    } else if (params.duracao === '5-10') {
      found = found.filter((trail) => trail.duracao >= 5 && trail.duracao <= 10);
    } else if (params.duracao === 'mais-10') {
      found = found.filter((trail) => trail.duracao > 10);
    }
    return paginate(sort(found, (trail) => trail.titulo), params).items;
  },

  async detail(slug: string): Promise<Trail | null> {
    await delay();
    return (
      mockTrails.find(
        (trail) => trail.slug === slug && trail.status === 'published',
      ) ?? null
    );
  },

  async module(
    trailSlug: string,
    moduleId: string,
  ): Promise<TrailModule | null> {
    await delay();
    const trail = mockTrails.find((item) => item.slug === trailSlug);
    return trail?.modulos.find((item) => item.id === moduleId) ?? null;
  },

  async start(userId: string, trailId: string): Promise<TrailProgress> {
    return progressHandler.start(userId, trailId);
  },

  async markContentRead(
    userId: string,
    trailId: string,
    moduleId: string,
    contentId: string,
  ): Promise<TrailProgress> {
    return progressHandler.markContentRead(
      userId,
      trailId,
      moduleId,
      contentId,
    );
  },

  async saveDraft(
    userId: string,
    trailId: string,
    moduleId: string,
    answer: string,
  ): Promise<TrailProgress> {
    return progressHandler.saveDraft(userId, trailId, moduleId, answer);
  },

  async submitActivity(
    userId: string,
    trailId: string,
    moduleId: string,
    answer: string,
  ): Promise<TrailProgress> {
    return progressHandler.submitActivity(userId, trailId, moduleId, answer);
  },

  async completeModule(
    userId: string,
    trailId: string,
    moduleId: string,
  ): Promise<TrailProgress> {
    return progressHandler.completeModule(userId, trailId, moduleId);
  },

  async completeTrail(
    userId: string,
    trailId: string,
  ): Promise<TrailProgress> {
    return progressHandler.completeTrail(userId, trailId);
  },
};
