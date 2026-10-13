const requestedMocks = import.meta.env.VITE_USE_MOCKS === 'true';

if (import.meta.env.PROD && requestedMocks) {
  throw new Error('VITE_USE_MOCKS não pode estar activo em produção.');
}

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  useMocks: import.meta.env.DEV && requestedMocks,
  appName: 'KUMUKA',
} as const;
