import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './styles/index.css';
import './lib/i18n';
import { PreferencesProvider } from './contexts/PreferencesContext';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </BrowserRouter>
  </HelmetProvider>
);
