import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { SessionDrawer } from '../components/SessionDrawer/SessionDrawer'

import '../styles.css'

export const Route = createRootRoute({
  validateSearch: (search: Record<string, unknown>): { session?: string } => ({
    session: typeof search.session === 'string' ? search.session : undefined,
  }),
  head: () => ({
    meta: [
      {
        title: 'CETL AI Symposium 2026',
      },
      {
        name: 'description',
        content:
          'Thursday, October 29, 2026 at the Bruce Pitman Center — schedule, announcements, and logistics for the CETL AI Symposium 2026, for remote and on-site attendees.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const { session } = Route.useSearch()

  return (
    <>
      <HeadContent />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="app-shell">
        <Header />
        <main className="app-main" id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
      {session ? <SessionDrawer sessionId={session} /> : null}
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
