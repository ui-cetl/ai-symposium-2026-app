import { createFileRoute } from '@tanstack/react-router'

import { ScheduleTable } from '../components/Schedule/ScheduleTable'
import { schedule } from '../data/schedule/loadSchedule'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className={styles.page}>
      <h1>AI Symposium 2026</h1>
      <p className={styles.lede}>Schedule of sessions</p>

      <ScheduleTable schedule={schedule} />
    </div>
  )
}

