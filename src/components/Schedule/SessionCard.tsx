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
  /** Bolder, hover-lifted, gold/white/black-only presentation — opt-in, used on Home. */
  elevated?: boolean
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
  elevated,
}: Readonly<SessionCardProps>) {
  const hasExpandableContent = Boolean(abstract || joinInfo)

  const cardClassName = [styles.card, isSelected && styles.cardSelected, elevated && styles.cardElevated]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={cardClassName} style={style}>
      <div className={styles.preview}>
        <p className={styles.time}>
          <span className={styles.timeRange}>{timeRange}</span> · {location}
        </p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.speakers}>{speakers.join(', ')}</p>
        {track && <TrackBadge track={track} monochrome={elevated} />}
      </div>

      {hasExpandableContent && (
        <details className={styles.details}>
          <summary className={styles.summary} aria-label={`More info about ${title}`}>
            More info
          </summary>
          {abstract && <p className={styles.abstract}>{abstract}</p>}
          {joinInfo && <p className={styles.joinInfo}>{joinInfo}</p>}
        </details>
      )}

      <div className={styles.actions}>
        {onToggleSelect && (
          <button
            type="button"
            className={isSelected ? `${styles.selectButton} ${styles.selectButtonActive}` : styles.selectButton}
            aria-pressed={isSelected}
            onClick={onToggleSelect}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
            </svg>
            <span className={styles.selectLabel}>{isSelected ? '✓ In my schedule' : '+ Add to my schedule'}</span>
          </button>
        )}
        <Link
          to="."
          search={(prev: Record<string, unknown>) => ({ ...prev, session: id })}
          resetScroll={false}
          className={styles.viewDetails}
        >
          View details
          {elevated ? (
            <svg className={styles.arrowIcon} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
              <path
                d="M0 5h14M9 1l5 4-5 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            ' →'
          )}
        </Link>
      </div>
    </li>
  )
}
