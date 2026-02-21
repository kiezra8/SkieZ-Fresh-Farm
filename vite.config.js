import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // For GitHub Pages: replace 'skiez-fresh-farm' with your exact repo name
    // For Cloudflare Pages: keep base as '/'
    base: '/',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
})
