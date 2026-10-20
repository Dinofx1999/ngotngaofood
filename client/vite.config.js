import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Mọi request /api được chuyển sang server Node.js
    proxy: { '/api': 'http://localhost:5050' },
  },
});
