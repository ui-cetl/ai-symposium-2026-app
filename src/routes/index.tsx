import { Link, createFileRoute } from '@tanstack/react-router'

import { MySchedule } from '../components/MySchedule/MySchedule'
import { schedule } from '../data/schedule/loadSchedule'
import { useMySchedule } from '../hooks/useMySchedule'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { selectedSessions } = useMySchedule(schedule)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>CETL AI Symposium 2026</h1>
        <p className={styles.lede}>
          A one-day, hybrid symposium for on-site and remote attendees &mdash; talks,
          abstracts, resources, and handouts, all in one place. Build your day below by
          picking the sessions you want to attend, or browse the full schedule to see
          everything on offer.
        </p>
      </section>

      <MySchedule schedule={schedule} sessions={selectedSessions} />

      <div className={styles.notices}>
        <p>On-site at the Pitman Center, or join remotely &mdash; no login required.</p>
        <p>Sessions are not recorded. Zoom links are emailed to registered attendees only.</p>
      </div>

      <Link to="/schedule" className={styles.cta}>
        View full schedule
      </Link>
    </div>
  )
}

