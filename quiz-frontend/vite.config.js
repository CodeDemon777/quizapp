import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/question': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/quiz': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
