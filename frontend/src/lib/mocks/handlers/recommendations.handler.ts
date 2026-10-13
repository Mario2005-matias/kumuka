import { mockCourses } from '../data/courses';
import { mockGuides } from '../data/guides';
import { mockQuickLearnings } from '../data/quickLearnings';
import { mockTrails } from '../data/trails';
import { delay } from '../utils/delay';
import type { Recommendation } from '@/types/recommendation';

/**
 * Handler de recomendações derivadas dos conteúdos publicados.
 * Simula GET /api/recommendations.
 */
export const recommendationsHandler = {
  async list(): Promise<Recommendation[]> {
    await delay();
    return [
      { tipo: 'trail', item: mockTrails[2] },
      { tipo: 'course', item: mockCourses[1] },
      { tipo: 'quick-learning', item: mockQuickLearnings[1] },
      { tipo: 'guide', item: mockGuides[0] },
    ];
  },
};
