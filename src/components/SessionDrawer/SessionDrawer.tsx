import { useEffect, useMemo, useRef, useState } from 'react'

import { Link, useNavigate } from '@tanstack/react-router'

import { ResourceLinks } from '../Schedule/ResourceLinks'
import { TrackBadge } from '../TrackBadge/TrackBadge'
import { getScheduleEntries, groupEntriesByStartTime } from '../../data/schedule/sessions'
import { schedule } from '../../data/schedule/loadSchedule'
import { useMySchedule } from '../../hooks/useMySchedule'
import styles from './SessionDrawer.module.css'

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export interface SessionDrawerProps {
  sessionId: string
}

export function SessionDrawer({ sessionId }: Readonly<SessionDrawerProps>) {
  const navigate = useNavigate()
  const { isSelected, toggle } = useMySchedule(schedule)
  const panelRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  const orderedSessions = useMemo(() => {
    const slots = groupEntriesByStartTime(schedule, getScheduleEntries(schedule))
    return slots.flatMap((slot) => slot.entries.filter((entry) => entry.kind === 'session').map((entry) => entry.session))
  }, [])

  const index = orderedSessions.findIndex((candidate) => candidate.id === sessionId)
  const session = index === -1 ? undefined : orderedSessions[index]
  const prev = index > 0 ? orderedSessions[index - 1] : undefined
  const next = index !== -1 && index < orderedSessions.length - 1 ? orderedSessions[index + 1] : undefined

  // Dropping the `session` search param reveals whatever page was already
  // mounted underneath — we never navigated away from it in the first place.
  const close = () => {
    navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({ ...prev, session: undefined }),
      resetScroll: false,
    })
  }

  // Slide-in animation: start closed, flip to open a frame after mount so
  // the transform transition actually runs instead of jumping straight in.
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Treat the rest of the page as background while the drawer is open:
  // lock scroll, mark it inert so focus/AT can't reach it, and move focus
  // into the panel itself.
  useEffect(() => {
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    const main = document.querySelector('main')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    header?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    main?.setAttribute('inert', '')
    panelRef.current?.focus({ preventScroll: true })

    return () => {
      document.body.style.overflow = previousOverflow
      header?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      main?.removeAttribute('inert')
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
        (el) => el.offsetParent !== null,
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function copyLink() {
    // Build the shareable deep link from the app's base path (not the current
    // page's path, since the drawer can be open over any page) — opening it
    // redirects through /sessions/$sessionId to land on /schedule with this
    // session open.
    const basepath = import.meta.env.BASE_URL.replace(/\/$/, '')
    const url = `${window.location.origin}${basepath}/sessions/${sessionId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus('Link copied. Anyone with it can open this session.')
    } catch {
      setCopyStatus(url)
    }
  }

  if (!session) {
    return (
      <div className={styles.drawer}>
        <div className={styles.scrim} onClick={close} />
        <article className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} ref={panelRef} tabIndex={-1}>
          <div className={styles.panelBar}>
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>
          <div className={styles.panelBody}>
            <h1>Session not found</h1>
            <p>We couldn&apos;t find a session with that id.</p>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className={styles.drawer}>
      <div className={styles.scrim} onClick={close} />
      <article className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} ref={panelRef} tabIndex={-1}>
        <div className={styles.panelBar}>
          <span className={styles.crumb}>
            {session.blockLabel} · {session.timeRange}
          </span>
          <button type="button" className={styles.close} onClick={close}>
            <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Close
          </button>
        </div>

        <div className={styles.panelBody}>
          <h2 className={styles.title}>{session.title}</h2>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Block</dt>
              <dd>{session.blockLabel}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Time</dt>
              <dd>{session.timeRange}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Location</dt>
              <dd>{session.location}</dd>
            </div>
          </dl>
          {session.track && <TrackBadge track={session.track} />}
          <p className={styles.speakers}>{session.speakers.join(', ')}</p>

          <div className={styles.actions}>
            <button
              type="button"
              className={
                isSelected(session.id) ? `${styles.selectButton} ${styles.selectButtonActive}` : styles.selectButton
              }
              aria-pressed={isSelected(session.id)}
              onClick={() => toggle(session.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
              <span className={styles.selectLabel}>
                {isSelected(session.id) ? '✓ In my schedule' : '+ Add to my schedule'}
              </span>
            </button>
            <button type="button" className={styles.btnSmall} onClick={copyLink}>
              Copy link
            </button>
          </div>
          {copyStatus && (
            <p className={styles.status} aria-live="polite">
              {copyStatus}
            </p>
          )}

          {session.joinInfo && <p className={styles.joinInfo}>{session.joinInfo}</p>}
          {(session.description ?? session.abstract) && (
            <>
              <h3 className={styles.sectionHeading}>Abstract</h3>
              <p className={styles.body}>{session.description ?? session.abstract}</p>
            </>
          )}

          {(session.resources?.length || session.artifacts?.length) && (
            <h3 className={styles.sectionHeading}>Materials</h3>
          )}
          <ResourceLinks label="Resources" links={session.resources} />
          <ResourceLinks label="Artifacts" links={session.artifacts} />

          <nav className={styles.pager} aria-label="Other sessions">
            {prev ? (
              <Link
                to="."
                search={(prev2: Record<string, unknown>) => ({ ...prev2, session: prev.id })}
                resetScroll={false}
                className={styles.pagerLink}
              >
                <span className={styles.pagerLabel}>Previous session</span>
                <span className={styles.pagerTitle}>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="."
                search={(prev2: Record<string, unknown>) => ({ ...prev2, session: next.id })}
                resetScroll={false}
                className={`${styles.pagerLink} ${styles.pagerLinkNext}`}
              >
                <span className={styles.pagerLabel}>Next session</span>
                <span className={styles.pagerTitle}>{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </article>
    </div>
  )
}
