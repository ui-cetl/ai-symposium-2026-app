import type { RoomTrack } from '../../data/schedule/types'
import { formatTime, withTiming } from '../../data/schedule/timing'
import { BreakCard } from './BreakCard'
import { SessionCard } from './SessionCard'
import styles from './RoomColumn.module.css'

export interface RoomColumnProps {
  roomName: string
  roomTrack: RoomTrack
  blockStart: string
  isSelected: (id: string) => boolean
  onToggleSelect: (id: string) => void
}

export function RoomColumn({
  roomName,
  roomTrack,
  blockStart,
  isSelected,
  onToggleSelect,
}: Readonly<RoomColumnProps>) {
  const timedItems = withTiming(roomTrack.items, blockStart)

  return (
    <div className={styles.column}>
      <h3 className={styles.heading}>{roomName}</h3>
      <ol className={styles.list}>
        {timedItems.map(({ item, start, end }, index) => {
          const timeRange = `${formatTime(start)}\u2013${formatTime(end)}`
          if (item.kind === 'break') {
            return (
              <BreakCard
                key={`${roomTrack.room}-break-${index}`}
                timeRange={timeRange}
                durationMinutes={item.durationMinutes}
                label={item.label}
              />
            )
          }
          return (
            <SessionCard
              key={item.id}
              id={item.id}
              timeRange={timeRange}
              title={item.title}
              speakers={item.speakers}
              track={item.track}
              abstract={item.abstract}
              isSelected={isSelected(item.id)}
              onToggleSelect={() => onToggleSelect(item.id)}
            />
          )
        })}
      </ol>
    </div>
  )
}
