import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import critical from 'rollup-plugin-critical'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return defineConfig({
    base: env.BASE_URL || '/',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@charset "UTF-8";`
        }
      }
    },
    server: {
      host: true,
      port: 3008
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          accommodation: resolve(__dirname, 'accommodation.html'),
          gifts: resolve(__dirname, 'gifts.html'),
          rsvp: resolve(__dirname, 'rsvp.html'),
        }
      },
      minify: 'esbuild'
    },
    plugins: mode === 'production' ? [
      critical({
        criticalUrl: './dist/',
        criticalBase: './dist/',
        criticalPages: [
          { uri: 'index.html', template: 'index' },
          { uri: 'accommodation.html', template: 'accommodation' },
          { uri: 'gifts.html', template: 'gifts' },
          { uri: 'rsvp.html', template: 'rsvp' },
        ],
        criticalConfig: {
          inline: true,
          extract: true,
          width: 1200,
          height: 4000,  // ⬆️ Augmenté pour capturer plus de contenu
          
          // ⬆️ Dimensions plus agressives - hauteurs augmentées
          dimensions: [
            { width: 400, height: 4000 },   // Mobile - capture plus de scroll
            { width: 1200, height: 4000 }, // Desktop - capture plus de scroll
          ],
          
          // ⬇️ Force l'inclusion de sélecteurs importants
          include: [
            // Headers et navigation
            /\.header/,
            /\.hero/,
            /\.nav/,
            
            // Elements globaux
            /body/,
            /html/,
            /:root/,
            // Fonts et typographie
            /font-family/,
            /font-weight/,
            /font-size/,
            // Layout critique
            /\.main/,
            /\.events/,
            /\.event/,
            // Events sub-elements - FORCE INCLUSION
            /\.event__/,
            /\.event--/,
            /event__image/,
            /event__content/,
            /event__title/,
            /event__time/,
            /event__location/,
            /event__address/,
            /event__map-link/,
            /event__transport/,
            // RSVP and accommodation sections
            /\.rsvp-section/,
            /\.accommodation-section/,
            /@font-face/,

            /\.container/,
            // Animations et transitions courantes
            /transition/,
            /transform/,
          ],
          
          penthouse: { 
            blockJSRequests: false,
            timeout: 45000,  // ⬆️ Timeout plus long
            strict: false,
            
            // ⬇️ Options avancées pour capturer plus
            keepLargerMediaQueries: true,  // Garde les media queries plus larges
            maxEmbeddedBase64Length: 10000,  // Permet plus de base64 inline
            
            // ⬇️ Force l'inclusion de patterns CSS spécifiques  
            forceInclude: [
              // Sélecteurs critiques à toujours inclure
              '.header',
              '.header *',
              '.hero', 
              '.hero *',
              'body',
              'html',
              ':root',
              // Variables CSS
              ':root *',
              // Typography
              'h1', 'h2', 'h3',
              // Layout critique
              '.main',
              // Navigation
              '.nav', '.nav *',
              // Buttons critiques
              '.btn', '.action-button',
            ],
            
            // ⬇️ Propriétés à ne PAS supprimer (garde plus de CSS)
            propertiesToRemove: [
              // Liste réduite - on garde plus de propriétés
              '(-webkit-)?tap-highlight-color',
              '(-webkit-)?touch-callout',
            ],
            
            // ⬇️ Rendu plus agressif
            renderWaitTime: 2000,  // Attend plus longtemps le rendu
            puppeteer: {
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
          },
          
          // ⬇️ Ignore moins de choses = garde plus de CSS
          ignore: {
            // Liste minimale d'éléments à ignorer
            atrule: [], // Ne plus ignorer @font-face, @media, etc.
            rule: [],   // Ne plus ignorer de règles
            decl: []    // Ne plus ignorer de déclarations
          },
        },
      })
    ] : []
  })
}