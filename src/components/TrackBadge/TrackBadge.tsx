import type { CSSProperties } from 'react'

import styles from './TrackBadge.module.css'

const TRACK_ACCENT_VARS = [
  '--track-accent-1',
  '--track-accent-2',
  '--track-accent-3',
  '--track-accent-4',
  '--track-accent-5',
  '--track-accent-6',
  '--track-accent-7',
  '--track-accent-8',
] as const

/** Deterministically assigns one of the 8 brand accent colors to a track name. */
function accentVarForTrack(track: string): string {
  let hash = 0
  for (let i = 0; i < track.length; i++) {
    hash = (hash * 31 + (track.codePointAt(i) ?? 0)) >>> 0
  }
  return TRACK_ACCENT_VARS[hash % TRACK_ACCENT_VARS.length]
}

export function TrackBadge({ track }: Readonly<{ track: string }>) {
  const style = { '--badge-color': `var(${accentVarForTrack(track)})` } as CSSProperties

  return (
    <span className={styles.badge} style={style}>
      {track}
    </span>
  )
}
