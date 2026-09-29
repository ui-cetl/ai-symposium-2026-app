import { Link } from '@tanstack/react-router'

import type { Block } from '../../data/schedule/types'
import type { ScheduleStats } from '../../data/schedule/stats'
import { formatTimeRange } from '../../data/schedule/timing'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './Highlights.module.css'

const STAT_LABELS: Record<keyof ScheduleStats, string> = {
  blockCount: 'Time blocks',
  roomCount: 'On-site rooms',
  onSiteSessionCount: 'On-site sessions',
  remoteSessionCount: 'Remote sessions',
  trackCount: 'Tracks',
  speakerCount: 'Speakers',
}

function StatGrid({ stats }: Readonly<{ stats: ScheduleStats }>) {
  return (
    <dl className={styles.statGrid}>
      {(Object.keys(STAT_LABELS) as Array<keyof ScheduleStats>).map((key) => (
        <div key={key} className={styles.stat}>
          <dt className={styles.statLabel}>{STAT_LABELS[key]}</dt>
          <dd className={styles.statValue}>{stats[key]}</dd>
        </div>
      ))}
    </dl>
  )
}

function OpeningSession({ block }: Readonly<{ block: Block }>) {
  const opening = block.rooms.flatMap((roomTrack) => roomTrack.items).find((item) => item.kind === 'session')
  if (opening?.kind !== 'session') return null

  return (
    <div className={styles.opening}>
      <p className={styles.openingKicker}>Opens the day &middot; {formatTimeRange(block.startTime, opening.durationMinutes)}</p>
      <h3 className={styles.openingTitle}>{opening.title}</h3>
      <p className={styles.openingSpeakers}>{opening.speakers.join(', ')}</p>
      {opening.track && <TrackBadge track={opening.track} />}
    </div>
  )
}

export function Highlights({
  stats,
  openingBlock,
}: Readonly<{ stats: ScheduleStats; openingBlock?: Block }>) {
  return (
    <div className={styles.highlights}>
      <StatGrid stats={stats} />

      {openingBlock && <OpeningSession block={openingBlock} />}

      <div className={styles.notices}>
        <p>On-site at the Pitman Center, or join remotely &mdash; no login required.</p>
        <p>Sessions are not recorded. Zoom links are emailed to registered attendees only.</p>
      </div>

      <Link to="/schedule" className={styles.cta}>
        View full schedule
      </Link>
    </div>
  )
}
