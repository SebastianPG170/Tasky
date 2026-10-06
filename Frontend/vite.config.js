import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    // Todo lo que empiece con /api se reenvía al backend de Express
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})