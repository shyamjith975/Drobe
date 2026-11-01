import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@drobe/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@drobe/design-tokens': path.resolve(__dirname, '../../packages/design-tokens/src'),
      '@drobe/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    }
  },
  server: {
    port: 3001,
    host: true
  }
});
