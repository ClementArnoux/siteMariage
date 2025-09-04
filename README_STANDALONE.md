# Version Standalone du Site de Mariage

Ce projet a été converti de Vite vers une structure HTML/JS/CSS classique.

## Structure des fichiers

### Fichiers HTML standalone
- `index_standalone.html` - Page d'accueil
- `accommodation_standalone.html` - Page hébergement
- `gifts_standalone.html` - Page cadeaux
- `rsvp_standalone.html` - Page RSVP

### CSS
- `css/` - Fichiers CSS compilés depuis SCSS
  - `main.css` - Styles globaux
  - `home.css` - Styles page d'accueil
  - `accommodation.css` - Styles hébergement
  - `gifts.css` - Styles cadeaux
  - `rsvp.css` - Styles RSVP

### JavaScript
- `js/main.js` - Script principal adapté (sans modules ES6)
- Utilise i18next via CDN au lieu de npm

### Assets
- `public/` - Images, fonts, traductions (inchangé)

## Comment utiliser

### 1. Convertir SCSS en CSS
```bash
./convert-scss.sh
```

### 2. Servir les fichiers
```bash
# Option 1: avec Node.js
npx serve . -p 3000

# Option 2: avec Python
python3 -m http.server 3000

# Option 3: avec PHP
php -S localhost:3000
```

### 3. Accéder au site
Ouvrez http://localhost:3000/index_standalone.html

## Principales modifications

### HTML
- Chaque page importe `main.css` (styles globaux) + son CSS spécifique
- Images pointent vers `public/` au lieu de `/` (chemins relatifs)
- Navigation inter-pages utilise les fichiers `*_standalone.html`

### JavaScript
- Suppression des imports ES6 modules
- Utilisation d'i18next via CDN
- Variables d'environnement remplacées par constantes

### CSS
- Fichiers SCSS compilés en CSS standard
- Chemins d'images corrigés automatiquement (`/` → `public/`)
- Peut être recompilé avec `npx sass` ou `./convert-scss.sh`

## Avantages
- ✅ Fonctionne sans bundler
- ✅ Compatible avec n'importe quel serveur web
- ✅ Déployable facilement
- ✅ Moins de dépendances

## Pour recompiler les styles
```bash
# Recompiler un fichier spécifique
npx sass src/styles/home.scss css/home.css

# Ou utiliser le script automatisé
./convert-scss.sh
```