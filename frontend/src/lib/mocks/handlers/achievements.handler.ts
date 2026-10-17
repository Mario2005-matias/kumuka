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
    if (userId !== mockConfig.userId) return [];
    const saved = localStorage.getItem('kumuka-mock-achievements');
    if (!saved) return filter(mockAchievements, () => true);

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error('As conquistas mock guardadas têm um formato inválido.');
    }
    const storedAchievements = parsed.map((item): Achievement => {
      if (
        typeof item !== 'object' ||
        item === null ||
        !('id' in item) ||
        typeof item.id !== 'string' ||
        !('titulo' in item) ||
        typeof item.titulo !== 'string' ||
        !('descricao' in item) ||
        typeof item.descricao !== 'string' ||
        !('unlocked' in item) ||
        typeof item.unlocked !== 'boolean' ||
        !('unlockedAt' in item) ||
        (item.unlockedAt !== null && typeof item.unlockedAt !== 'string')
      ) {
        throw new Error('Uma conquista mock guardada tem um formato inválido.');
      }
      return {
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        unlocked: item.unlocked,
        unlockedAt: item.unlockedAt,
      };
    });
    const storedIds = new Set(storedAchievements.map((item) => item.id));
    return [
      ...storedAchievements,
      ...mockAchievements.filter((item) => !storedIds.has(item.id)),
    ];
  },

  async unlock(userId: string, achievementId: string): Promise<void> {
    await delay();
    if (userId !== mockConfig.userId) return;

    const achievements = await this.list(userId);
    const achievement = achievements.find((item) => item.id === achievementId);
    if (!achievement) {
      throw new Error(`A conquista "${achievementId}" não existe.`);
    }
    if (achievement.unlocked) return;

    const updated = achievements.map((item) =>
      item.id === achievementId
        ? { ...item, unlocked: true, unlockedAt: new Date().toISOString() }
        : item,
    );
    localStorage.setItem('kumuka-mock-achievements', JSON.stringify(updated));
  },
};
