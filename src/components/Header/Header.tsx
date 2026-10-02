import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Link, useRouterState } from '@tanstack/react-router'

import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import cetlLogo from '../../assets/images/cetl-logo.png'
import styles from './Header.module.css'

const navItems: Array<{ to: string; label: string; exact?: boolean }> = [
  { to: '/', label: 'Home', exact: true },
  { to: '/schedule', label: 'Schedule' },
  { to: '/presenters', label: 'Presenters' },
  { to: '/materials', label: 'Materials' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className={isScrolled ? `${styles.header} ${styles.headerScrolled}` : styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img
            src={cetlLogo}
            alt="University of Idaho Center for Excellence in Teaching and Learning"
            className={styles.logo}
          />
          <span className={styles.brandText}>
            AI Symposium <span className={styles.year}>2026</span>
          </span>
        </Link>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
        </button>
        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={styles.navLink}
              activeOptions={item.exact ? { exact: true } : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      {isMenuOpen
        ? createPortal(
            <div id="primary-navigation" className={styles.overlay} role="dialog" aria-modal="true" aria-label="Primary">
              <button
                type="button"
                className={styles.overlayClose}
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </button>
              <nav className={styles.overlayNav} aria-label="Primary">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={styles.overlayLink}
                    activeOptions={item.exact ? { exact: true } : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  )
}
