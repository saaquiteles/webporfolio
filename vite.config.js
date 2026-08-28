import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this project from
  // https://saaquiteles.github.io/webporfolio/, not the domain root, so
  // built asset URLs need that subpath prefix — but only for production
  // builds; the local dev server should keep serving from "/".
  base: command === 'build' ? '/webporfolio/' : '/',
  server: {
    port: 3000,
  },
}))
