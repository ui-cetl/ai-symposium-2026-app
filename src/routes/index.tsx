import { createFileRoute } from '@tanstack/react-router'

import { Highlights } from '../components/Highlights/Highlights'
import { MySchedule } from '../components/MySchedule/MySchedule'
import { schedule } from '../data/schedule/loadSchedule'
import { computeScheduleStats } from '../data/schedule/stats'
import { useMySchedule } from '../hooks/useMySchedule'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const stats = computeScheduleStats(schedule)
  const { selectedSessions } = useMySchedule(schedule)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>CETL AI Symposium 2026</h1>
        <p className={styles.lede}>
          A one-day, hybrid symposium for on-site and remote attendees &mdash; talks,
          abstracts, resources, and handouts, all in one place.
        </p>
      </section>

      <Highlights stats={stats} openingBlock={schedule.blocks[0]} />

      <MySchedule sessions={selectedSessions} />
    </div>
  )
}

