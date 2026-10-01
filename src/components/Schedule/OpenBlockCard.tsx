import type { CSSProperties } from 'react'

import { Link } from '@tanstack/react-router'

import styles from './OpenBlockCard.module.css'

export interface OpenBlockCardProps {
  blockId: string
  label: string
  timeRange: string
  style?: CSSProperties
}

/**
 * A gentle placeholder card for a breakout block the user hasn't picked a
 * talk for yet. Slots into "My Schedule" at its chronological spot,
 * alongside the picked `SessionCard`s, rather than as a separate nagging
 * list below.
 */
export function OpenBlockCard({ blockId, label, timeRange, style }: Readonly<OpenBlockCardProps>) {
  return (
    <li className={styles.card} style={style}>
      <p className={styles.time}>{timeRange}</p>
      <p className={styles.label}>
        {label} is still open {'\u2014'} no rush, you can{' '}
        <Link to="/schedule" hash={`${blockId}-heading`} className={styles.link}>
          browse talks
        </Link>{' '}
        whenever you&apos;re ready.
      </p>
    </li>
  )
}
