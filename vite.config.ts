import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    open: true,
    port: 5173
  },
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'pages/about.html'),
        filmography: resolve(__dirname, 'pages/filmography.html'),
        film: resolve(__dirname, 'pages/film.html'),
        journal: resolve(__dirname, 'pages/journal.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
        '404': resolve(__dirname, 'pages/404.html')
      }
    }
  }
});
