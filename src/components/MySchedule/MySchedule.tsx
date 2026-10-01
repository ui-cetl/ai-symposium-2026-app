import { Link } from '@tanstack/react-router'

import type { ResolvedSession } from '../../data/schedule/sessions'
import type { Schedule } from '../../data/schedule/types'
import { formatTimeRange } from '../../data/schedule/timing'
import { OpenBlockCard } from '../Schedule/OpenBlockCard'
import { SessionCard } from '../Schedule/SessionCard'
import styles from './MySchedule.module.css'

type ScheduleEntry =
  | { kind: 'session'; start: string; session: ResolvedSession }
  | { kind: 'open'; start: string; blockId: string; label: string; timeRange: string }

export function MySchedule({
  schedule,
  sessions,
}: Readonly<{ schedule: Schedule; sessions: Array<ResolvedSession> }>) {
  const pickedBlockLabels = new Set(sessions.map((session) => session.blockLabel))
  const openBreakoutBlocks = schedule.blocks.filter(
    (block) => block.kind === 'workshop' && !pickedBlockLabels.has(block.label),
  )

  const entries: Array<ScheduleEntry> = [
    ...sessions.map((session): ScheduleEntry => ({ kind: 'session', start: session.start, session })),
    ...openBreakoutBlocks.map(
      (block): ScheduleEntry => ({
        kind: 'open',
        start: block.startTime,
        blockId: block.id,
        label: block.label,
        timeRange: formatTimeRange(block.startTime, block.durationMinutes),
      }),
    ),
  ].sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className={styles.mySchedule}>
      <h2 className={styles.heading}>My Schedule</h2>

      {sessions.length === 0 && (
        <p className={styles.empty}>You haven&apos;t added any talks yet.</p>
      )}

      {entries.length > 0 ? (
        <ol className={styles.list}>
          {entries.map((entry) =>
            entry.kind === 'session' ? (
              <SessionCard
                key={entry.session.id}
                id={entry.session.id}
                title={entry.session.title}
                speakers={entry.session.speakers}
                track={entry.session.track}
                timeRange={entry.session.timeRange}
                location={entry.session.location}
                abstract={entry.session.abstract}
                joinInfo={entry.session.joinInfo}
                isSelected={true}
              />
            ) : (
              <OpenBlockCard
                key={entry.blockId}
                blockId={entry.blockId}
                label={entry.label}
                timeRange={entry.timeRange}
              />
            ),
          )}
        </ol>
      ) : (
        <Link to="/schedule" className={styles.cta}>
          Browse the schedule
        </Link>
      )}
    </div>
  )
}

