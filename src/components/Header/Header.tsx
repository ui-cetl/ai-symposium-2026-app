import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          CETL AI Symposium <span className={styles.year}>2026</span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link to="/" className={styles.navLink} activeOptions={{ exact: true }}>
            Schedule
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
