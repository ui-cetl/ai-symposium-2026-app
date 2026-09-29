import { Link, createFileRoute } from '@tanstack/react-router'

import { ResourceLinks } from '../components/Schedule/ResourceLinks'
import { TrackBadge } from '../components/TrackBadge/TrackBadge'
import { findSessionById } from '../data/schedule/sessions'
import { schedule } from '../data/schedule/loadSchedule'
import { useMySchedule } from '../hooks/useMySchedule'
import styles from './sessions.$sessionId.module.css'

export const Route = createFileRoute('/sessions/$sessionId')({ component: SessionDetailsPage })

function SessionDetailsPage() {
  const { sessionId } = Route.useParams()
  const session = findSessionById(schedule, sessionId)
  const { isSelected, toggle } = useMySchedule(schedule)

  if (!session) {
    return (
      <div className={styles.page}>
        <Link to="/schedule" className={styles.back}>
          ← Back to schedule
        </Link>
        <h1>Session not found</h1>
        <p>We couldn&apos;t find a session with that id.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/schedule" className={styles.back}>
        ← Back to schedule
      </Link>
      <h1 className={styles.title}>{session.title}</h1>
      <p className={styles.meta}>
        {session.blockLabel} · {session.timeRange} · {session.location}
      </p>
      {session.track && <TrackBadge track={session.track} />}
      <p className={styles.speakers}>{session.speakers.join(', ')}</p>
      <button
        type="button"
        className={
          isSelected(session.id) ? `${styles.selectButton} ${styles.selectButtonActive}` : styles.selectButton
        }
        aria-pressed={isSelected(session.id)}
        onClick={() => toggle(session.id)}
      >
        {isSelected(session.id) ? '✓ In my schedule' : '+ Add to my schedule'}
      </button>
      {session.joinInfo && <p className={styles.joinInfo}>{session.joinInfo}</p>}
      {(session.description ?? session.abstract) && (
        <p className={styles.body}>{session.description ?? session.abstract}</p>
      )}
      <ResourceLinks label="Resources" links={session.resources} />
      <ResourceLinks label="Artifacts" links={session.artifacts} />
    </div>
  )
}
