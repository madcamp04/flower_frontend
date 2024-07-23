import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/backend': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
        secure: process.env.NODE_ENV === 'production', // Use secure in production
      }
    }
  }
})
