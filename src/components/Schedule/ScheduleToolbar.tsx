import styles from './ScheduleToolbar.module.css'

export interface ScheduleFilters {
  query: string
  track: string
  room: string
  savedOnly: boolean
}

export const DEFAULT_SCHEDULE_FILTERS: ScheduleFilters = {
  query: '',
  track: 'All',
  room: 'All',
  savedOnly: false,
}

export interface ScheduleToolbarProps {
  filters: ScheduleFilters
  onChange: (next: ScheduleFilters) => void
  trackOptions: Array<string>
  roomOptions: Array<string>
  savedCount: number
  resultText: string
  isFiltering: boolean
  onClear: () => void
}

export function ScheduleToolbar({
  filters,
  onChange,
  trackOptions,
  roomOptions,
  savedCount,
  resultText,
  isFiltering,
  onClear,
}: Readonly<ScheduleToolbarProps>) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.search}>
        <span className={styles.visuallyHidden}>Search sessions</span>
        <input
          type="search"
          placeholder="Search by title, speaker, or topic"
          autoComplete="off"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </label>

      <div className={styles.filterRow}>
        <div className={styles.chips} role="group" aria-label="Track">
          {['All', ...trackOptions].map((track) => (
            <button
              key={track}
              type="button"
              className={styles.chip}
              aria-pressed={filters.track === track}
              onClick={() => onChange({ ...filters, track })}
            >
              {track === 'All' ? 'All sessions' : track}
            </button>
          ))}
        </div>

        <div className={styles.sideControls}>
          <label className={styles.select}>
            Room
            <select value={filters.room} onChange={(event) => onChange({ ...filters, room: event.target.value })}>
              <option value="All">All rooms</option>
              {roomOptions.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.toggle}
            aria-pressed={filters.savedOnly}
            onClick={() => onChange({ ...filters, savedOnly: !filters.savedOnly })}
          >
            My Schedule <span className={styles.count}>{savedCount}</span>
          </button>
        </div>
      </div>

      <p className={styles.resultCount} aria-live="polite">
        {resultText}
      </p>

      {isFiltering && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
