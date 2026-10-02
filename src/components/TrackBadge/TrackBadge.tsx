import type { CSSProperties } from 'react'

import { accentVarForTrack } from '../../data/trackColor'
import styles from './TrackBadge.module.css'

export interface TrackBadgeProps {
  track: string
  /** Gold border/text, no per-track hue — used inside Home's always-dark elevated cards. */
  monochrome?: boolean
}

export function TrackBadge({ track, monochrome }: Readonly<TrackBadgeProps>) {
  if (monochrome) {
    return <span className={`${styles.badge} ${styles.badgeMono}`}>{track}</span>
  }

  const style = { '--badge-color': `var(${accentVarForTrack(track)})` } as CSSProperties

  return (
    <span className={styles.badge} style={style}>
      {track}
    </span>
  )
}
