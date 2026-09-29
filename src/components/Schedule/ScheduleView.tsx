import type { Schedule } from '../../data/schedule/types'
import { formatTimeRange } from '../../data/schedule/timing'
import { RoomColumn } from './RoomColumn'
import { SessionCard } from './SessionCard'
import styles from './ScheduleView.module.css'

export function ScheduleView({ schedule }: Readonly<{ schedule: Schedule }>) {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id

  return (
    <div className={styles.schedule}>
      {schedule.blocks.map((block) => (
        <section key={block.id} className={styles.block} aria-labelledby={`${block.id}-heading`}>
          <h2 id={`${block.id}-heading`} className={styles.blockHeading}>
            {block.label}
            <span className={styles.blockTime}>{formatTimeRange(block.startTime, block.durationMinutes)}</span>
          </h2>

          <h3 className={styles.groupHeading}>On-site sessions</h3>
          <div className={styles.roomGrid}>
            {block.rooms.map((roomTrack) => (
              <RoomColumn
                key={roomTrack.room}
                roomName={roomName(roomTrack.room)}
                roomTrack={roomTrack}
                blockStart={block.startTime}
              />
            ))}
          </div>

          {block.remote.length > 0 && (
            <>
              <h3 className={styles.groupHeading}>Remote sessions</h3>
              <ol className={styles.remoteGrid}>
                {block.remote.map((session) => (
                  <SessionCard
                    key={session.id}
                    timeRange={formatTimeRange(block.startTime, session.durationMinutes)}
                    title={session.title}
                    speakers={session.speakers}
                    track={session.track}
                    abstract={session.abstract}
                    resources={session.resources}
                    artifacts={session.artifacts}
                    joinInfo={session.joinInfo}
                  />
                ))}
              </ol>
            </>
          )}
        </section>
      ))}
    </div>
  )
}
