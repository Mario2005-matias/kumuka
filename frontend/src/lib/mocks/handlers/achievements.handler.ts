import { mockAchievements } from '../data/achievements';
import { mockConfig } from '../config';
import { delay } from '../utils/delay';
import { filter } from '../utils/filter';
import type { Achievement } from '@/types/achievement';

/**
 * Handler de conquistas.
 * Simula GET /api/achievements.
 */
export const achievementsHandler = {
  async list(userId = mockConfig.userId): Promise<Achievement[]> {
    await delay();
    return userId === mockConfig.userId ? filter(mockAchievements, () => true) : [];
  },
};
