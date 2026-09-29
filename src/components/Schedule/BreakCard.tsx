import styles from './BreakCard.module.css'

export interface BreakCardProps {
  timeRange: string
  durationMinutes: number
  label?: string
}

export function BreakCard({ timeRange, durationMinutes, label }: Readonly<BreakCardProps>) {
  return (
    <li className={styles.card}>
      <p className={styles.time}>{timeRange}</p>
      <p className={styles.label}>
        Break{label ? ` \u2014 ${label}` : ''} ({durationMinutes} min)
      </p>
    </li>
  )
}
