import { mockCompetences } from '../data/competences';
import { mockProfiles } from '../data/profile';
import { mockProjects } from '../data/projects';
import { mockConfig } from '../config';
import { delay } from '../utils/delay';
import type { Competence } from '@/types/competence';
import type { Profile } from '@/types/profile';
import type { Project } from '@/types/project';

/**
 * Handler de perfil.
 * Simula GET /api/profile, GET /api/profile/competences e GET /api/profile/projects.
 */
export const profileHandler = {
  async detail(userId = mockConfig.userId): Promise<Profile | null> {
    await delay();
    return mockProfiles.find((profile) => profile.userId === userId) ?? null;
  },

  async competences(userId = mockConfig.userId): Promise<Competence[]> {
    await delay();
    const profile = mockProfiles.find((item) => item.userId === userId);
    if (!profile) return [];
    return mockCompetences.filter((competence) =>
      profile.competencias.includes(competence.nome),
    );
  },

  async projects(userId = mockConfig.userId): Promise<Project[]> {
    await delay();
    return mockProfiles.some((profile) => profile.userId === userId)
      ? [...mockProjects]
      : [];
  },
};
