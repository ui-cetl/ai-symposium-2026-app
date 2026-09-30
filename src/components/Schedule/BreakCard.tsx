import type { CSSProperties } from 'react'

import styles from './BreakCard.module.css'

export interface BreakCardProps {
  timeRange: string
  durationMinutes: number
  label?: string
  style?: CSSProperties
}

export function BreakCard({ timeRange, durationMinutes, label, style }: Readonly<BreakCardProps>) {
  return (
    <li className={styles.card} style={style}>
      <p className={styles.time}>{timeRange}</p>
      <p className={styles.label}>
        Break{label ? ` \u2014 ${label}` : ''} ({durationMinutes} min)
      </p>
    </li>
  )
}
