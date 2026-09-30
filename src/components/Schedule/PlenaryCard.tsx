import type { CSSProperties } from 'react'

import type { PlenaryBlock } from '../../data/schedule/types'
import { formatTimeRange } from '../../data/schedule/timing'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import { BreakCard } from './BreakCard'
import styles from './PlenaryCard.module.css'

/**
 * Renders a plenary block's single whole-audience item (no concurrent
 * rooms). Breaks delegate to the existing `BreakCard`; sessions render a
 * simple, non-interactive card — plenary items aren't selectable into "My
 * Schedule" (they're mandatory, not optional picks).
 */
export function PlenaryCard({ block, style }: Readonly<{ block: PlenaryBlock; style?: CSSProperties }>) {
  const timeRange = formatTimeRange(block.startTime, block.durationMinutes)

  if (block.item.kind === 'break') {
    return (
      <BreakCard
        timeRange={timeRange}
        durationMinutes={block.item.durationMinutes}
        label={block.item.label}
        style={style}
      />
    )
  }

  const { title, speakers, track, abstract } = block.item

  return (
    <li className={styles.card} style={style}>
      <p className={styles.time}>
        {timeRange}
        {block.location ? ` \u00b7 ${block.location}` : ''}
      </p>
      <h3 className={styles.title}>{title}</h3>
      {speakers.length > 0 && <p className={styles.speakers}>{speakers.join(', ')}</p>}
      {track && <TrackBadge track={track} />}
      {abstract && <p className={styles.abstract}>{abstract}</p>}
    </li>
  )
}
