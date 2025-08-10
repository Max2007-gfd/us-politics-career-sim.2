import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point the alias used above to the core source
      '@usp/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
  // Let Vite serve files outside apps/web when needed
  server: { fs: { allow: ['..', '../../packages'] } },
})
