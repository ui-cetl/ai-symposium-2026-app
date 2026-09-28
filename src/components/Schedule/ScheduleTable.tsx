import type { Schedule } from '../../data/schedule/types'
import { formatTime, formatTimeRange, withTiming } from '../../data/schedule/timing'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './ScheduleTable.module.css'

function ResourceLinks({
  label,
  links,
}: Readonly<{ label: string; links?: Array<{ label: string; url: string }> }>) {
  if (!links || links.length === 0) return null
  return (
    <p className={styles.links}>
      {label}:{' '}
      {links.map((link, index) => (
        <span key={link.url}>
          {index > 0 && ', '}
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </span>
      ))}
    </p>
  )
}

export function ScheduleTable({ schedule }: Readonly<{ schedule: Schedule }>) {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id

  return (
    <div className={styles.schedule}>
      {schedule.blocks.map((block) => (
        <section key={block.id} className={styles.block} aria-labelledby={`${block.id}-heading`}>
          <h2 id={`${block.id}-heading`} className={styles.blockHeading}>
            {block.label}
            <span className={styles.blockTime}>{formatTimeRange(block.startTime, block.durationMinutes)}</span>
          </h2>

          <table className={styles.table}>
            <caption className={styles.caption}>On-site sessions</caption>
            <thead>
              <tr>
                <th scope="col">Room</th>
                <th scope="col">Time</th>
                <th scope="col">Session</th>
                <th scope="col">Speakers</th>
                <th scope="col">Track</th>
              </tr>
            </thead>
            <tbody>
              {block.rooms.flatMap((roomTrack) => {
                const timedItems = withTiming(roomTrack.items, block.startTime)
                return timedItems.map(({ item, start, end }, index) => (
                  <tr
                    key={`${roomTrack.room}-${item.kind}-${index}`}
                    className={item.kind === 'break' ? styles.breakRow : undefined}
                  >
                    {index === 0 && (
                      <th scope="row" rowSpan={timedItems.length} className={styles.roomCell}>
                        {roomName(roomTrack.room)}
                      </th>
                    )}
                    <td className={styles.timeCell}>
                      {formatTime(start)}–{formatTime(end)}
                    </td>
                    {item.kind === 'break' ? (
                      <td colSpan={2} className={styles.breakLabel}>
                        Break{item.label ? ` — ${item.label}` : ''} ({item.durationMinutes} min)
                      </td>
                    ) : (
                      <>
                        <td>
                          <div className={styles.sessionTitle}>{item.title}</div>
                          {item.abstract && <p className={styles.abstract}>{item.abstract}</p>}
                          <ResourceLinks label="Resources" links={item.resources} />
                          <ResourceLinks label="Artifacts" links={item.artifacts} />
                        </td>
                        <td>{item.speakers.join(', ')}</td>
                      </>
                    )}
                    <td>{item.kind === 'session' && item.track ? <TrackBadge track={item.track} /> : null}</td>
                  </tr>
                ))
              })}
            </tbody>
          </table>

          {block.remote.length > 0 && (
            <table className={styles.table}>
              <caption className={styles.caption}>Remote sessions</caption>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Session</th>
                  <th scope="col">Speakers</th>
                  <th scope="col">Track</th>
                </tr>
              </thead>
              <tbody>
                {block.remote.map((session) => (
                  <tr key={session.id}>
                    <td className={styles.timeCell}>{formatTimeRange(block.startTime, session.durationMinutes)}</td>
                    <td>
                      <div className={styles.sessionTitle}>{session.title}</div>
                      {session.abstract && <p className={styles.abstract}>{session.abstract}</p>}
                      {session.joinInfo && <p className={styles.joinInfo}>{session.joinInfo}</p>}
                      <ResourceLinks label="Resources" links={session.resources} />
                      <ResourceLinks label="Artifacts" links={session.artifacts} />
                    </td>
                    <td>{session.speakers.join(', ')}</td>
                    <td>{session.track ? <TrackBadge track={session.track} /> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  )
}
