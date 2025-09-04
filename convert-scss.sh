#!/bin/bash

echo "🔄 Conversion des fichiers SCSS en CSS..."

# Créer le dossier CSS s'il n'existe pas
mkdir -p css

# Convertir tous les fichiers SCSS
echo "📝 Conversion de main.scss..."
npx sass src/styles/main.scss css/main.css

echo "📝 Conversion de home.scss..."
npx sass src/styles/home.scss css/home.css

echo "📝 Conversion de accommodation.scss..."
npx sass src/styles/accommodation.scss css/accommodation.css

echo "📝 Conversion de gifts.scss..."
npx sass src/styles/gifts.scss css/gifts.css

echo "📝 Conversion de rsvp.scss..."
npx sass src/styles/rsvp.scss css/rsvp.css

echo "🔧 Correction des chemins d'images dans les fichiers CSS..."
# Remplacer les chemins absolus par des chemins relatifs vers public/
find css/ -name "*.css" -exec sed -i 's|url("/|url("../public/|g' {} \;

echo "✅ Conversion terminée ! Fichiers CSS générés dans le dossier css/"
echo ""
echo "📂 Structure standalone créée :"
echo "  - index_standalone.html"
echo "  - accommodation_standalone.html" 
echo "  - gifts_standalone.html"
echo "  - rsvp_standalone.html"
echo "  - css/ (fichiers CSS compilés)"
echo "  - js/main.js (JS adapté sans bundler)"
echo ""
echo "🚀 Pour servir les fichiers, utilisez :"
echo "   npx serve . -p 3000"
echo "   ou"
echo "   python3 -m http.server 3000"