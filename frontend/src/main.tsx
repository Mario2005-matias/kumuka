import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from '../src/app/providers';
import App from './App';
import '@fontsource/poppins';
import './index.css';
//import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);