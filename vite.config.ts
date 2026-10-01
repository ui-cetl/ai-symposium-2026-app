import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'

// GitHub Pages serves this app from https://ui-cetl.github.io/ai-symposium-2026-app/,
// so the build run with `--mode gh-pages` (see `build:gh-pages` script) needs its
// base path and asset URLs prefixed with the repo name.
const GITHUB_PAGES_BASE = '/ai-symposium-2026-app/'

const config = defineConfig(({ mode }) => ({
  base: mode === 'gh-pages' ? GITHUB_PAGES_BASE : '/',
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
}))

export default config
