import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: env.VITE_API_URL?.startsWith('https') ? {
        '/api': {
          target: env.VITE_API_URL.replace('/api/v1', ''),
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: 'localhost',
        }
      } : undefined
    }
  }
})
