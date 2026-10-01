// GitHub Pages has no server-side rewrites, so deep links (e.g. /schedule)
// 404 unless we serve the SPA shell for unmatched paths. GitHub Pages falls
// back to serving `404.html` for any unknown route, so copying the built
// `index.html` there lets TanStack Router take over client-side routing.
import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')

copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))
