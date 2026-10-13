import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '../src/app/providers';
import App from './App';
import { env } from './config/env';
import '@fontsource/poppins';
import './index.css';

async function startApplication() {
  if (env.useMocks && import.meta.env.DEV) {
    const { seedMocks } = await import('./lib/mocks/seed');
    seedMocks();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>,
  );
}

void startApplication().catch((error: unknown) => {
  console.error('Não foi possível iniciar a aplicação KUMUKA.', error);
});