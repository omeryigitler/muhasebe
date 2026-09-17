import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './calculator-v3-tweaks.css';

if (typeof window !== 'undefined' && !localStorage.getItem('accounting_default_en_v1')) {
  localStorage.setItem('sayisal_lang', 'en');
  localStorage.setItem('accounting_default_en_v1', '1');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);