import './styles/main.scss'
import i18n from './i18n.js'

// Import page-specific styles based on current page
const currentPage = window.location.pathname;
if (currentPage === '/' || currentPage === '/index.html') {
  import('./styles/home.scss');
} else if (currentPage === '/accommodation' || currentPage === '/accommodation.html') {
  import('./styles/accommodation.scss');
} else if (currentPage === '/gifts' || currentPage === '/gifts.html') {
  import('./styles/gifts.scss');
} else if (currentPage === '/rsvp' || currentPage === '/rsvp.html') {
  import('./styles/rsvp.scss');
}

let currentLanguage = 'fr';

// Fonctions utilitaires i18n
const t = (key, options = {}) => i18n.t(key, options);

// Initialise la langue (par défaut français, changé via bouton)
function initializeLanguage() {
  // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
  currentLanguage = localStorage.getItem('language') || 'fr';
  
  // S'assurer que i18next utilise la bonne langue
  if (i18n.isInitialized) {
    i18n.changeLanguage(currentLanguage);
  }
  
  // Mettre à jour le HTML
  document.documentElement.setAttribute('lang', currentLanguage);
  document.documentElement.setAttribute('data-lang', currentLanguage);
}

// Fonction pour traduire et injecter du contenu
function translateContent() {
  // Traduire tous les éléments avec data-i18n (text content)
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    element.textContent = translation;
  });

  // Traduire tous les éléments avec data-i18n-html (HTML content)
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    const translation = t(key);
    element.innerHTML = translation;
  });

  // Traduire les placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });

  // Traduire les titres (title attributes)
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = t(key);
  });
}

// Fonction pour mettre à jour les boutons de langue
function updateLanguageSwitcher() {
  const languageSwitcher = document.querySelector('.header__language');
  
  if (languageSwitcher) {
    // Créer les boutons de changement de langue avec événements
    languageSwitcher.innerHTML = `
      <button class="header__lang-btn ${currentLanguage === 'fr' ? 'header__lang-btn--active' : ''}" data-lang="fr">FR</button>
      <button class="header__lang-btn ${currentLanguage === 'sl' ? 'header__lang-btn--active' : ''}" data-lang="sl">SL</button>
    `;
    
    // Ajouter les événements de clic
    languageSwitcher.querySelectorAll('.header__lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newLang = e.target.getAttribute('data-lang');
        changeLanguage(newLang);
      });
    });
  }
}

// Fonction pour changer la langue
async function changeLanguage(lang) {
  if (lang === currentLanguage) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Mettre à jour l'attribut HTML
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  
  // Changer la langue d'i18next
  await i18n.changeLanguage(lang);
  
  // Retraduire tout le contenu
  translateContent();
  
  // Mettre à jour les boutons
  updateLanguageSwitcher();
}

// Gestion des formulaires RSVP
async function handleRSVPForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('.rsvp__submit');
  const originalText = submitBtn.textContent;
  
  // Désactiver le bouton pendant l'envoi
  submitBtn.disabled = true;
  submitBtn.textContent = t('rsvp.sending') || 'Envoi en cours...';
  
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.language = currentLanguage;
    
    // Envoyer via Google Apps Script
    const response = await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
      },
      body: new URLSearchParams(data)
    });
    
    if (!response.ok) throw new Error('Erreur réseau');
    
    // Succès
    alert(t('rsvp.success') || 'Merci ! Votre RSVP a été envoyé.');
    form.reset();
    
  } catch (error) {
    console.error('Erreur:', error);
    alert(t('rsvp.error') || 'Erreur lors de l\'envoi. Veuillez réessayer.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Fonctionnalités interactives
function addInteractivity() {
  // Hover effects pour les éléments d'accommodation
  document.querySelectorAll('.accommodation-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-5px)';
      item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
    });
  });
  
  // Click to copy pour téléphones et emails
  document.querySelectorAll('.accommodation-item p').forEach(info => {
    const text = info.textContent;
    if (text.includes('@') || text.includes('+33')) {
      info.style.cursor = 'pointer';
      info.title = t('common.click_to_copy');
      
      info.addEventListener('click', () => {
        let textToCopy = text;
        if (text.includes('@')) {
          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) textToCopy = emailMatch[0];
        } else if (text.includes('+33')) {
          const phoneMatch = text.match(/\+33[0-9\s]+/);
          if (phoneMatch) textToCopy = phoneMatch[0].replace(/\s/g, '');
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = info.textContent;
          info.textContent = t('common.copied');
          info.style.color = 'var(--primary-color)';
          
          setTimeout(() => {
            info.textContent = originalText;
            info.style.color = '';
          }, 1500);
        });
      });
    }
  });
}

// Header scroll animation
function handleHeaderScroll() {
  const header = document.querySelector('.header');
  const scrolled = window.scrollY > 100;
  
  if (scrolled) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  // Initialiser la langue
  initializeLanguage();
  
  // Attendre que i18next soit prêt
  await i18n.changeLanguage(currentLanguage);
  
  // Traduire le contenu
  translateContent();
  
  // Mettre à jour le sélecteur de langue
  updateLanguageSwitcher();
  
  // Ajouter l'interactivité
  addInteractivity();
  
  // Gérer les formulaires RSVP
  const rsvpForms = document.querySelectorAll('.rsvp__form');
  rsvpForms.forEach(form => {
    form.addEventListener('submit', handleRSVPForm);
  });
  
  // Gérer l'animation du header au scroll
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Appeler une fois au chargement
});