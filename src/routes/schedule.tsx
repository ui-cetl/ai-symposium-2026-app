import { createFileRoute } from '@tanstack/react-router'

import { ScheduleView } from '../components/Schedule/ScheduleView'
import { schedule } from '../data/schedule/loadSchedule'
import styles from './schedule.module.css'

export const Route = createFileRoute('/schedule')({ component: SchedulePage })

function SchedulePage() {
  return (
    <div className={styles.page}>
      <h1>Schedule</h1>
      <p className={styles.lede}>
        Full session listing by time block, including on-site room assignments, plus an
        independent Virtual Sessions track running on its own schedule below.
      </p>

      <ScheduleView schedule={schedule} />
    </div>
  )
}
