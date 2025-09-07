import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Configuration i18next
i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'fr',
    debug: false, // Désactiver les logs
    
    // Configuration du backend pour charger les traductions
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    },
    
    // Configuration du détecteur de langue
    detection: {
      // Ordre de détection : URL > localStorage > navigateur
      order: ['path', 'localStorage', 'navigator'],
      // Chercher la langue dans l'URL (ex: /sl/page.html)
      lookupFromPathIndex: 0,
      // Cache dans localStorage  
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React déjà échappé par défaut
    }
  });

export default i18next;