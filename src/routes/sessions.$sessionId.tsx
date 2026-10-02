import { createFileRoute, redirect } from '@tanstack/react-router'

// Sessions no longer live at their own path — they're a drawer that opens
// over whatever page you're on (via the `session` search param), so the
// underlying page never disappears. This route only exists so old bookmarks
// and shared "Copy link" URLs keep working.
export const Route = createFileRoute('/sessions/$sessionId')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/schedule', search: { session: params.sessionId } })
  },
})
