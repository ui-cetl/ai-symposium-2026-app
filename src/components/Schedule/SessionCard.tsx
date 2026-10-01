import type { CSSProperties } from 'react'

import { Link } from '@tanstack/react-router'

import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './SessionCard.module.css'

export interface SessionCardProps {
  id: string
  title: string
  speakers: Array<string>
  track?: string
  timeRange: string
  location: string
  abstract?: string
  joinInfo?: string
  isSelected: boolean
  onToggleSelect?: () => void
  style?: CSSProperties
}

export function SessionCard({
  id,
  title,
  speakers,
  track,
  timeRange,
  location,
  abstract,
  joinInfo,
  isSelected,
  onToggleSelect,
  style,
}: Readonly<SessionCardProps>) {
  return (
    <li className={isSelected ? `${styles.card} ${styles.cardSelected}` : styles.card} style={style}>
      <details className={styles.details}>
        <summary className={styles.summary}>
          <p className={styles.time}>
            {timeRange} · {location}
          </p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.speakers}>{speakers.join(', ')}</p>
          {track && <TrackBadge track={track} />}
        </summary>
        {abstract && <p className={styles.abstract}>{abstract}</p>}
        {joinInfo && <p className={styles.joinInfo}>{joinInfo}</p>}
        <div className={styles.actions}>
          {onToggleSelect && (
            <button
              type="button"
              className={isSelected ? `${styles.selectButton} ${styles.selectButtonActive}` : styles.selectButton}
              aria-pressed={isSelected}
              onClick={onToggleSelect}
            >
              {isSelected ? '✓ In my schedule' : '+ Add to my schedule'}
            </button>
          )}
          <Link to="/sessions/$sessionId" params={{ sessionId: id }} className={styles.viewDetails}>
            View details →
          </Link>
        </div>
      </details>
    </li>
  )
}
