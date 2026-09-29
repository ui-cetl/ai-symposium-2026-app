import { Link } from '@tanstack/react-router'

import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './SessionCard.module.css'

export interface SessionCardProps {
  id: string
  title: string
  speakers: Array<string>
  track?: string
  timeRange: string
  abstract?: string
  joinInfo?: string
}

export function SessionCard({
  id,
  title,
  speakers,
  track,
  timeRange,
  abstract,
  joinInfo,
}: Readonly<SessionCardProps>) {
  return (
    <li className={styles.card}>
      <p className={styles.time}>{timeRange}</p>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.speakers}>{speakers.join(', ')}</p>
      {track && <TrackBadge track={track} />}
      {abstract && <p className={styles.abstract}>{abstract}</p>}
      {joinInfo && <p className={styles.joinInfo}>{joinInfo}</p>}
      <Link to="/sessions/$sessionId" params={{ sessionId: id }} className={styles.viewDetails}>
        View details →
      </Link>
    </li>
  )
}
