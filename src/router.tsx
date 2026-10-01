import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // import.meta.env.BASE_URL reflects Vite's `base` config, so this stays in
  // sync automatically whether deployed at the domain root or under GitHub
  // Pages' /ai-symposium-2026-app/ sub-path.
  const basepath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  const router = createTanStackRouter({
    routeTree,
    basepath,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
