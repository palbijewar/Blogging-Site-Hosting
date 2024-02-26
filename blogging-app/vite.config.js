import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
  },
  plugins: [react()],
  define: {
    BASE_URL: JSON.stringify('https://graceful-boa-belt.cyclic.app')
  }
})
