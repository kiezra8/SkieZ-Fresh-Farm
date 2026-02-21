import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deployed to GitHub Pages the URL is:
//   https://<username>.github.io/<repo-name>/
// The base must match the repo name exactly.
// Change 'skiez-fresh-farm' below to match YOUR GitHub repo name if different.
const repoName = 'skiez-fresh-farm'

export default defineConfig({
    plugins: [react()],
    base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    icons: ['react-icons']
                }
            }
        }
    }
})
