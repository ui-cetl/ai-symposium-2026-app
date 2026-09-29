import type { ResourceLink } from '../../data/schedule/types'
import styles from './ResourceLinks.module.css'

export interface ResourceLinksProps {
  label: string
  links?: Array<ResourceLink>
}

export function ResourceLinks({ label, links }: Readonly<ResourceLinksProps>) {
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
