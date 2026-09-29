import { Link } from '@tanstack/react-router'

import type { ResolvedSession } from '../../data/schedule/sessions'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './MySchedule.module.css'

export function MySchedule({ sessions }: Readonly<{ sessions: Array<ResolvedSession> }>) {
  if (sessions.length === 0) {
    return (
      <div className={styles.mySchedule}>
        <h2 className={styles.heading}>My Schedule</h2>
        <p className={styles.empty}>You haven&apos;t added any talks yet.</p>
        <Link to="/schedule" className={styles.cta}>
          Browse the schedule
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.mySchedule}>
      <h2 className={styles.heading}>My Schedule</h2>
      <ol className={styles.list}>
        {sessions.map((session) => (
          <li key={session.id} className={styles.item}>
            <p className={styles.time}>{session.timeRange}</p>
            <Link to="/sessions/$sessionId" params={{ sessionId: session.id }} className={styles.title}>
              {session.title}
            </Link>
            <p className={styles.location}>
              {session.blockLabel} · {session.location}
            </p>
            {session.track && <TrackBadge track={session.track} />}
            <p className={styles.speakers}>{session.speakers.join(', ')}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
