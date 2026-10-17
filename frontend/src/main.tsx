import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '../src/app/providers';
import App from './App';
import { env } from './config/env';
import i18n, { i18nReady } from './i18n';
import '@fontsource/poppins';
import './index.css';

async function startApplication() {
  await i18nReady;

  if (env.useMocks && import.meta.env.DEV) {
    const { seedMocks } = await import('./lib/mocks/seed');
    seedMocks();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <React.Suspense
        fallback={
          <div aria-busy="true" aria-live="polite" role="status">
            {i18n.t('states.loading', { ns: 'common' })}
          </div>
        }
      >
        <Providers>
          <App />
        </Providers>
      </React.Suspense>
    </React.StrictMode>,
  );
}

void startApplication().catch((error: unknown) => {
  console.error('Não foi possível iniciar a aplicação KUMUKA.', error);
});