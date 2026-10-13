import {
  mockAchievements,
  mockCompetences,
  mockCourses,
  mockExperiences,
  mockGuides,
  mockProfiles,
  mockProjects,
  mockProgress,
  mockQuickLearnings,
  mockTrails,
  mockUsers,
} from './data';

/**
 * Seeds the development browser storage with the demo records.
 * Credentials are only present in the development mock bundle.
 */
export function seedMocks(
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage,
): void {
  if (!storage.getItem('kumuka-mock-users')) {
    storage.setItem('kumuka-mock-users', JSON.stringify(mockUsers));
  }
  storage.setItem('kumuka-mock-profiles', JSON.stringify(mockProfiles));
  storage.setItem('kumuka-mock-trails', JSON.stringify(mockTrails));
  storage.setItem('kumuka-mock-courses', JSON.stringify(mockCourses));
  storage.setItem('kumuka-mock-quick-learnings', JSON.stringify(mockQuickLearnings));
  storage.setItem('kumuka-mock-guides', JSON.stringify(mockGuides));
  storage.setItem('kumuka-mock-projects', JSON.stringify(mockProjects));
  storage.setItem('kumuka-mock-experiences', JSON.stringify(mockExperiences));
  storage.setItem('kumuka-mock-achievements', JSON.stringify(mockAchievements));
  storage.setItem('kumuka-mock-progress', JSON.stringify(mockProgress));
  storage.setItem('kumuka-mock-competences', JSON.stringify(mockCompetences));
}
