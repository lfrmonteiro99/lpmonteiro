import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    
    outDir: 'dist', // Ensure it's inside your project
    emptyOutDir: true, // Clean old files before building
  }
})
