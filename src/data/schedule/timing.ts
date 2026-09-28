/** Pure time-math helpers for rendering the schedule. All times are "HH:MM" 24-hour strings. */

export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = hours * 60 + mins + minutes
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const hh = Math.floor(wrapped / 60)
  const mm = wrapped % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function formatTime(time: string): string {
  const [hours, mins] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${String(mins).padStart(2, '0')} ${period}`
}

export function formatTimeRange(start: string, durationMinutes: number): string {
  return `${formatTime(start)}\u2013${formatTime(addMinutesToTime(start, durationMinutes))}`
}

export interface TimedItem<T> {
  item: T
  start: string
  end: string
}

/** Walks a sequential list of items, stamping each with its computed start/end time. */
export function withTiming<T extends { durationMinutes: number }>(
  items: Array<T>,
  blockStart: string,
): Array<TimedItem<T>> {
  let cursor = blockStart
  return items.map((item) => {
    const start = cursor
    const end = addMinutesToTime(cursor, item.durationMinutes)
    cursor = end
    return { item, start, end }
  })
}
