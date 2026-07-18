import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // The bingo web app.
        main: resolve(__dirname, 'index.html'),
        // The one-time printable-cards page (served at /print.html).
        print: resolve(__dirname, 'print.html'),
      },
    },
  },
})
