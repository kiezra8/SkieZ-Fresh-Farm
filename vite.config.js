import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions automatically sets GITHUB_REPOSITORY as "username/repo-name"
// We extract just the repo name to use as the base path for GitHub Pages
// Locally (no GITHUB_REPOSITORY set) → base is '/'
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
        sourcemap: false
    }
})
