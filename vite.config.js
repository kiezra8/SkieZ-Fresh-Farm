import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Smart base detection:
// - GitHub Actions sets GITHUB_REPOSITORY automatically → use /repo-name/ for GitHub Pages
// - Cloudflare Pages does NOT set GITHUB_REPOSITORY → use / for Cloudflare
const base = process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'

export default defineConfig({
    plugins: [react()],
    base,
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false
    }
})
