import type { ResourceLink } from '../../data/schedule/types'
import { useIsMobile } from '../../hooks/useIsMobile'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import styles from './SessionCard.module.css'

function ResourceLinks({
  label,
  links,
}: Readonly<{ label: string; links?: Array<ResourceLink> }>) {
  if (!links || links.length === 0) return null
  return (
    <p className={styles.links}>
      {label}:{' '}
      {links.map((link, index) => (
        <span key={link.url}>
          {index > 0 && ', '}
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        </span>
      ))}
    </p>
  )
}

export interface SessionCardProps {
  title: string
  speakers: Array<string>
  track?: string
  timeRange: string
  abstract?: string
  resources?: Array<ResourceLink>
  artifacts?: Array<ResourceLink>
  joinInfo?: string
}

export function SessionCard({
  title,
  speakers,
  track,
  timeRange,
  abstract,
  resources,
  artifacts,
  joinInfo,
}: Readonly<SessionCardProps>) {
  const isMobile = useIsMobile()
  const hasDetails = Boolean(abstract || joinInfo || resources?.length || artifacts?.length)

  return (
    <li className={styles.card}>
      <p className={styles.time}>{timeRange}</p>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.speakers}>{speakers.join(', ')}</p>
      {track && <TrackBadge track={track} />}

      {hasDetails && (
        <details className={styles.details} open={!isMobile}>
          <summary className={styles.summary}>Details</summary>
          {joinInfo && <p className={styles.joinInfo}>{joinInfo}</p>}
          {abstract && <p className={styles.abstract}>{abstract}</p>}
          <ResourceLinks label="Resources" links={resources} />
          <ResourceLinks label="Artifacts" links={artifacts} />
        </details>
      )}
    </li>
  )
}
