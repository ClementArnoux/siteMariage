import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    base: env.BASE_URL || 'http://localhost:3000',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@charset "UTF-8";`
      }
    }
  },
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accommodation: resolve(__dirname, 'accommodation.html'),
        gifts: resolve(__dirname, 'gifts.html'),
        rsvp: resolve(__dirname, 'rsvp.html'),
      }
    }
  },
  appType: 'mpa' // Multi-page application
})
}