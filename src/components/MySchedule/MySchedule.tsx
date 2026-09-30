import { Link } from '@tanstack/react-router'

import type { ResolvedSession } from '../../data/schedule/sessions'
import { SessionCard } from '../Schedule/SessionCard'
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
          <SessionCard
            key={session.id}
            id={session.id}
            title={session.title}
            speakers={session.speakers}
            track={session.track}
            timeRange={session.timeRange}
            location={session.location}
            abstract={session.abstract}
            joinInfo={session.joinInfo}
            isSelected={true}
          />
        ))}
      </ol>
    </div>
  )
}

