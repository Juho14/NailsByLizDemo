import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/NailsByLizDemo/',
  plugins: [react()],
  server: {
    port: 1102
  }
});
