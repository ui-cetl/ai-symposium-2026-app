import { Link, createFileRoute } from '@tanstack/react-router'

import { NextSectionPager } from '../components/NextSectionPager/NextSectionPager'
import { getAllSessions, listMaterials } from '../data/schedule/sessions'
import { schedule } from '../data/schedule/loadSchedule'
import styles from './materials.module.css'

export const Route = createFileRoute('/materials')({ component: MaterialsPage })

function MaterialsPage() {
  const sessions = getAllSessions(schedule)
  const materials = listMaterials(sessions)
  const pendingCount = sessions.length - materials.length

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Materials</h1>
      <p className={styles.lede}>Slides, handouts, and readings from each session, posted as presenters share them.</p>

      {materials.length === 0 ? (
        <p className={styles.note}>No materials have been posted yet.</p>
      ) : (
        <ul className={styles.list}>
          {materials.map(({ session, links }) => (
            <li key={session.id} className={styles.row}>
              <p className={styles.time}>{session.timeRange}</p>
              <h3 className={styles.sessionTitle}>
                <Link
                  to="."
                  search={(prev: Record<string, unknown>) => ({ ...prev, session: session.id })}
                  resetScroll={false}
                >
                  {session.title}
                </Link>
              </h3>
              <div className={styles.links}>
                {links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {link.format && <span className={styles.fmt}>{link.format}</span>}
                    {link.label}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingCount > 0 && (
        <p className={styles.note}>
          Materials for {pendingCount} more {pendingCount === 1 ? 'session' : 'sessions'} will appear here once
          presenters share them.
        </p>
      )}

      <NextSectionPager label="CETL AI Symposium 2026" to="/" />
    </div>
  )
}
