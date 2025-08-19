import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traducciones
import es from './translations/es.json';
import pl from './translations/pl.json';

// Configurar i18next
i18n
  .use(initReactI18next)
    .init({
      resources: {
        es: es,
        pl: pl,
      },
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // no es necesario para React
    },
  });

export default i18n;