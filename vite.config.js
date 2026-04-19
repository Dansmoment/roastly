import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('html5-qrcode')) return 'vendor-qrcode';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('node_modules/react')) return 'vendor-react';
        },
      },
    },
  },
})
