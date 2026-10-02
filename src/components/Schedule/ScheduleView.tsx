import { useMemo, useState } from 'react'

import type { Schedule } from '../../data/schedule/types'
import {
  getAllSessions,
  getScheduleEntries,
  groupEntriesByStartTime,
  listRoomOptions,
  listTrackOptions,
} from '../../data/schedule/sessions'
import { formatTime, minutesBetween } from '../../data/schedule/timing'
import { useMySchedule } from '../../hooks/useMySchedule'
import { BreakCard } from './BreakCard'
import { DEFAULT_SCHEDULE_FILTERS, ScheduleToolbar, type ScheduleFilters } from './ScheduleToolbar'
import { SessionCard } from './SessionCard'
import styles from './ScheduleView.module.css'

export function ScheduleView({ schedule }: Readonly<{ schedule: Schedule }>) {
  const { isSelected, toggle } = useMySchedule(schedule)
  const [filters, setFilters] = useState<ScheduleFilters>(DEFAULT_SCHEDULE_FILTERS)

  const allSessions = useMemo(() => getAllSessions(schedule), [schedule])
  const entries = useMemo(() => getScheduleEntries(schedule), [schedule])
  const trackOptions = useMemo(() => listTrackOptions(allSessions), [allSessions])
  const roomOptions = useMemo(() => listRoomOptions(schedule, allSessions), [schedule, allSessions])

  const isFiltering =
    filters.query.trim() !== '' || filters.track !== 'All' || filters.room !== 'All' || filters.savedOnly

  const filteredEntries = useMemo(() => {
    const words = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean)

    return entries.filter((entry) => {
      if (entry.kind === 'break') return !isFiltering

      const session = entry.session
      if (filters.track !== 'All' && session.track !== filters.track) return false
      if (filters.room !== 'All' && entry.location !== filters.room) return false
      if (filters.savedOnly && !isSelected(session.id)) return false
      if (words.length > 0) {
        const haystack = [session.title, session.abstract, session.track, entry.location, ...session.speakers]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return words.every((word) => haystack.includes(word))
      }
      return true
    })
  }, [entries, filters, isFiltering])

  const slots = useMemo(() => groupEntriesByStartTime(schedule, filteredEntries), [schedule, filteredEntries])

  const shownCount = filteredEntries.filter((entry) => entry.kind === 'session').length
  const resultText = isFiltering
    ? `Showing ${shownCount} of ${allSessions.length} sessions`
    : `${allSessions.length} sessions`
  const savedCount = allSessions.filter((session) => isSelected(session.id)).length

  return (
    <div className={styles.schedule}>
      <ScheduleToolbar
        filters={filters}
        onChange={setFilters}
        trackOptions={trackOptions}
        roomOptions={roomOptions}
        savedCount={savedCount}
        resultText={resultText}
        isFiltering={isFiltering}
        onClear={() => setFilters(DEFAULT_SCHEDULE_FILTERS)}
      />

      {slots.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {filters.savedOnly && savedCount === 0
              ? "You haven't added any talks yet. Use the bookmark beside any session to add it."
              : 'No sessions match these filters.'}
          </p>
          <button type="button" className={styles.clearEmpty} onClick={() => setFilters(DEFAULT_SCHEDULE_FILTERS)}>
            Clear filters
          </button>
        </div>
      ) : (
        <ol className={styles.spineList}>
          {slots.map((slot) => (
            <li key={slot.start} className={styles.slot}>
              <p className={styles.slotTime}>
                {formatTime(slot.start)}
                <span className={styles.slotUntil}>until {formatTime(slot.end)}</span>
              </p>
              <ul className={styles.slotEntries}>
                {slot.entries.map((entry) =>
                  entry.kind === 'break' ? (
                    <BreakCard
                      key={entry.key}
                      timeRange={`${formatTime(entry.start)}–${formatTime(entry.end)}`}
                      durationMinutes={minutesBetween(entry.start, entry.end)}
                      label={entry.label}
                    />
                  ) : (
                    <SessionCard
                      key={entry.key}
                      id={entry.session.id}
                      timeRange={entry.session.timeRange}
                      location={entry.session.location}
                      title={entry.session.title}
                      speakers={entry.session.speakers}
                      track={entry.session.track}
                      abstract={entry.session.abstract}
                      joinInfo={entry.session.joinInfo}
                      isSelected={isSelected(entry.session.id)}
                      onToggleSelect={() => toggle(entry.session.id)}
                    />
                  ),
                )}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
