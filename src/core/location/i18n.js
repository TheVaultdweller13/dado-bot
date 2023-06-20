import i18n from 'i18next';

import en from './locales/en.json' assert { type: 'json' };
import es from './locales/es.json' assert { type: 'json' };

i18n.init({
  lng: 'es',
  fallbackLng: 'es',
  supportedLngs: ['en', 'es'],

  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
});

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
};

export default i18n;
