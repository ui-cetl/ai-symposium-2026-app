import type { Schedule, SessionInfo } from './types'
import { formatTime, formatTimeRange, withTiming } from './timing'

/** A session with its schedule context resolved, for standalone display (e.g. a details page). */
export interface ResolvedSession extends SessionInfo {
  joinInfo?: string
  timeRange: string
  blockLabel: string
  location: string
}

/** Flattens every on-site and remote session across all blocks, with timing/location resolved. */
export function getAllSessions(schedule: Schedule): Array<ResolvedSession> {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id

  const sessions: Array<ResolvedSession> = []

  for (const block of schedule.blocks) {
    for (const roomTrack of block.rooms) {
      const timedItems = withTiming(roomTrack.items, block.startTime)
      for (const { item, start, end } of timedItems) {
        if (item.kind !== 'session') continue
        sessions.push({
          ...item,
          timeRange: `${formatTime(start)}\u2013${formatTime(end)}`,
          blockLabel: block.label,
          location: roomName(roomTrack.room),
        })
      }
    }

    for (const session of block.remote) {
      sessions.push({
        ...session,
        timeRange: formatTimeRange(block.startTime, session.durationMinutes),
        blockLabel: block.label,
        location: 'Remote',
      })
    }
  }

  return sessions
}

/** Finds a single session by id across all blocks, or undefined if no session matches. */
export function findSessionById(schedule: Schedule, id: string): ResolvedSession | undefined {
  return getAllSessions(schedule).find((session) => session.id === id)
}
