import { mockProgress } from '../data/progress';
import { mockConfig } from '../config';
import { delay } from '../utils/delay';
import { filter } from '../utils/filter';
import type { LearningProgress } from '@/types/progress';

/**
 * Handler de progresso.
 * Simula GET /api/progress e GET /api/users/:userId/progress.
 */
export const progressHandler = {
  async list(userId = mockConfig.userId): Promise<LearningProgress[]> {
    await delay();
    return filter(mockProgress, (item) => item.userId === userId);
  },
};
