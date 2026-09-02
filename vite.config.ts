import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    allowedHosts: [
      'childlike-visiting-twine.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io'
    ],
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/صور المشاريع الويبسايت/**',
        '**/ChatGPT - */**',
        '**/app acript*/**',
        '**/appscript/**',
        '**/medical clinic*/**',
        '**/google ads*/**',
      ],
    },
  },
});
