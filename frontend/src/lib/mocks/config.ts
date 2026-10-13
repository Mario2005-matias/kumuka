import type { MockConfig } from './types/mock.types';

export const mockConfig: MockConfig = {
  latency: { min: 200, max: 600 },
  userId: 'user-mock-01',
  simulateErrors: false,
};
