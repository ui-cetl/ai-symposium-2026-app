import type { CSSProperties } from 'react'

import type { Schedule } from '../../data/schedule/types'
import { buildBlockTimeline } from '../../data/schedule/timeline'
import { formatTime, formatTimeRange } from '../../data/schedule/timing'
import { useMySchedule } from '../../hooks/useMySchedule'
import { BreakCard } from './BreakCard'
import { SessionCard } from './SessionCard'
import styles from './ScheduleView.module.css'

export function ScheduleView({ schedule }: Readonly<{ schedule: Schedule }>) {
  const { isSelected, toggle } = useMySchedule(schedule)

  return (
    <div className={styles.schedule}>
      {schedule.blocks.map((block) => {
        const timeline = buildBlockTimeline(schedule, block)
        const gridStyle = { '--column-count': timeline.columnCount } as CSSProperties

        return (
          <section key={block.id} className={styles.block} aria-labelledby={`${block.id}-heading`}>
            <h2 id={`${block.id}-heading`} className={styles.blockHeading}>
              {block.label}
              <span className={styles.blockTime}>{formatTimeRange(block.startTime, block.durationMinutes)}</span>
            </h2>

            <ol className={styles.timelineGrid} style={gridStyle}>
              {timeline.entries.map((entry) => {
                const entryStyle = {
                  '--col': entry.column + 1,
                  '--row-start': entry.rowStart,
                  '--row-span': entry.rowSpan,
                } as CSSProperties
                const timeRange = `${formatTime(entry.start)}\u2013${formatTime(entry.end)}`

                if (entry.kind === 'break') {
                  return (
                    <BreakCard
                      key={entry.key}
                      timeRange={timeRange}
                      durationMinutes={entry.durationMinutes}
                      label={entry.label}
                      style={entryStyle}
                    />
                  )
                }

                const session = entry.session
                if (!session) return null

                return (
                  <SessionCard
                    key={entry.key}
                    id={session.id}
                    timeRange={timeRange}
                    location={entry.location}
                    title={session.title}
                    speakers={session.speakers}
                    track={session.track}
                    abstract={session.abstract}
                    joinInfo={entry.joinInfo}
                    isSelected={isSelected(session.id)}
                    onToggleSelect={() => toggle(session.id)}
                    style={entryStyle}
                  />
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}
