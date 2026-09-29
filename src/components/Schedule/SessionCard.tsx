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
  isSelected: boolean
  onToggleSelect: () => void
}

export function SessionCard({
  id,
  title,
  speakers,
  track,
  timeRange,
  abstract,
  joinInfo,
  isSelected,
  onToggleSelect,
}: Readonly<SessionCardProps>) {
  return (
    <li className={isSelected ? `${styles.card} ${styles.cardSelected}` : styles.card}>
      <p className={styles.time}>{timeRange}</p>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.speakers}>{speakers.join(', ')}</p>
      {track && <TrackBadge track={track} />}
      {abstract && <p className={styles.abstract}>{abstract}</p>}
      {joinInfo && <p className={styles.joinInfo}>{joinInfo}</p>}
      <div className={styles.actions}>
        <button
          type="button"
          className={isSelected ? `${styles.selectButton} ${styles.selectButtonActive}` : styles.selectButton}
          aria-pressed={isSelected}
          onClick={onToggleSelect}
        >
          {isSelected ? '✓ In my schedule' : '+ Add to my schedule'}
        </button>
        <Link to="/sessions/$sessionId" params={{ sessionId: id }} className={styles.viewDetails}>
          View details →
        </Link>
      </div>
    </li>
  )
}
