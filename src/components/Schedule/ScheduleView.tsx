import type { CSSProperties } from 'react'

import type { Schedule } from '../../data/schedule/types'
import { buildBlockTimeline } from '../../data/schedule/timeline'
import { addMinutesToTime, formatTime, formatTimeRange } from '../../data/schedule/timing'
import { useMySchedule } from '../../hooks/useMySchedule'
import { BreakCard } from './BreakCard'
import { PlenaryCard } from './PlenaryCard'
import { SessionCard } from './SessionCard'
import styles from './ScheduleView.module.css'

export function ScheduleView({ schedule }: Readonly<{ schedule: Schedule }>) {
  const { isSelected, toggle } = useMySchedule(schedule)

  return (
    <div className={styles.schedule}>
      {schedule.blocks.map((block) => {
        const blockHeading = (
          <h2 id={`${block.id}-heading`} className={styles.blockHeading}>
            {block.label}
            <span className={styles.blockTime}>{formatTimeRange(block.startTime, block.durationMinutes)}</span>
          </h2>
        )

        if (block.kind === 'plenary') {
          return (
            <section key={block.id} className={styles.block} aria-labelledby={`${block.id}-heading`}>
              {blockHeading}
              <ol className={styles.timelineGrid} style={{ '--column-count': 1 } as CSSProperties}>
                <PlenaryCard block={block} />
              </ol>
            </section>
          )
        }

        const timeline = buildBlockTimeline(schedule, block)
        const gridStyle = { '--column-count': timeline.columnCount } as CSSProperties

        return (
          <section key={block.id} className={styles.block} aria-labelledby={`${block.id}-heading`}>
            {blockHeading}

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

      <section className={styles.block} aria-labelledby="virtual-track-heading">
        <h2 id="virtual-track-heading" className={styles.blockHeading}>
          Virtual Sessions
        </h2>

        <ol className={styles.timelineGrid} style={{ '--column-count': 1 } as CSSProperties}>
          {schedule.virtualTrack.map((session) => {
            const end = addMinutesToTime(session.startTime, session.durationMinutes)
            const timeRange = `${formatTime(session.startTime)}\u2013${formatTime(end)}`

            return (
              <SessionCard
                key={session.id}
                id={session.id}
                timeRange={timeRange}
                location="Remote"
                title={session.title}
                speakers={session.speakers}
                track={session.track}
                abstract={session.abstract}
                joinInfo={session.joinInfo}
                isSelected={isSelected(session.id)}
                onToggleSelect={() => toggle(session.id)}
              />
            )
          })}
        </ol>
      </section>
    </div>
  )
}

