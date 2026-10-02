import type { ResourceLink } from '../../data/schedule/types'
import styles from './ResourceLinks.module.css'

export interface ResourceLinksProps {
  label: string
  links?: Array<ResourceLink>
}

export function ResourceLinks({ label, links }: Readonly<ResourceLinksProps>) {
  if (!links || links.length === 0) return null
  return (
    <div className={styles.links}>
      <p className={styles.label}>{label}:</p>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.url} className={styles.row}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
