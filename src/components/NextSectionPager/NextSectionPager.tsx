import { Link } from '@tanstack/react-router'

import styles from './NextSectionPager.module.css'

export interface NextSectionPagerProps {
  label: string
  to: '/' | '/schedule' | '/presenters' | '/materials'
}

export function NextSectionPager({ label, to }: Readonly<NextSectionPagerProps>) {
  return (
    <nav className={styles.pager} aria-label="Next section">
      <Link to={to} className={styles.link}>
        <span className={styles.lbl}>{to === '/' ? 'Back to the start' : 'Next section'}</span>
        <span className={styles.ttl}>{label}</span>
      </Link>
    </nav>
  )
}
