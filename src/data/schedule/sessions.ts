import type { Schedule, SessionInfo } from './types'
import { addMinutesToTime, formatTime, formatTimeRange, withTiming } from './timing'

/** A session with its schedule context resolved, for standalone display (e.g. a details page). */
export interface ResolvedSession extends SessionInfo {
  joinInfo?: string
  /** 24-hour "HH:MM" start/end, for overlap comparisons. */
  start: string
  end: string
  timeRange: string
  blockLabel: string
  location: string
}

/**
 * Flattens every plenary session, workshop-room session, and virtual-track
 * session across the schedule, with timing/location resolved. Plenary
 * sessions (keynotes, panels, etc.) have no inline select toggle on the
 * schedule grid itself (see `PlenaryCard`), but they do get a details page
 * and can be added to / removed from "My Schedule" there — whole-audience
 * ones are auto-enrolled by default on a user's first visit (see
 * `getDefaultSelectedIds`).
 */
export function getAllSessions(schedule: Schedule): Array<ResolvedSession> {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id

  const sessions: Array<ResolvedSession> = []

  for (const block of schedule.blocks) {
    if (block.kind === 'plenary') {
      if (block.item.kind !== 'session') continue
      const start = block.startTime
      const end = addMinutesToTime(start, block.item.durationMinutes)
      sessions.push({
        ...block.item,
        start,
        end,
        timeRange: `${formatTime(start)}\u2013${formatTime(end)}`,
        blockLabel: block.label,
        location: block.location ?? '',
      })
      continue
    }

    for (const roomTrack of block.rooms) {
      const timedItems = withTiming(roomTrack.items, block.startTime)
      for (const { item, start, end } of timedItems) {
        if (item.kind !== 'session') continue
        sessions.push({
          ...item,
          start,
          end,
          timeRange: `${formatTime(start)}\u2013${formatTime(end)}`,
          blockLabel: block.label,
          location: roomName(roomTrack.room),
        })
      }
    }
  }

  for (const session of schedule.virtualTrack) {
    sessions.push({
      ...session,
      start: session.startTime,
      end: addMinutesToTime(session.startTime, session.durationMinutes),
      timeRange: formatTimeRange(session.startTime, session.durationMinutes),
      blockLabel: 'Virtual Sessions',
      location: 'Remote',
    })
  }

  return sessions
}

/** Finds a single session by id across all blocks, or undefined if no session matches. */
export function findSessionById(schedule: Schedule, id: string): ResolvedSession | undefined {
  return getAllSessions(schedule).find((session) => session.id === id)
}

/**
 * Ids of the whole-audience plenary sessions (keynote, welcome, panel,
 * closing, etc.) that should be auto-enrolled into "My Schedule" by
 * default — they never conflict with anything and everyone attends them.
 * Plenary sessions marked `optional` (e.g. an off-site social) are excluded.
 */
export function getDefaultSelectedIds(schedule: Schedule): Array<string> {
  const ids: Array<string> = []
  for (const block of schedule.blocks) {
    if (block.kind === 'plenary' && block.item.kind === 'session' && !block.optional) {
      ids.push(block.item.id)
    }
  }
  return ids
}

/** True if two sessions' [start, end) time ranges overlap. Assumes same-day "HH:MM" strings. */
export function sessionsOverlap(a: ResolvedSession, b: ResolvedSession): boolean {
  return a.start < b.end && b.start < a.end
}

/** Every session in `selected` (other than `candidate` itself) that overlaps `candidate`. */
export function findConflicts(
  candidate: ResolvedSession,
  selected: Array<ResolvedSession>,
): Array<ResolvedSession> {
  return selected.filter((session) => session.id !== candidate.id && sessionsOverlap(candidate, session))
}
