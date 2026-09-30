import type { Block, Schedule, SessionInfo } from './types'
import { addMinutesToTime, withTiming } from './timing'

interface RawEntry {
  kind: 'session' | 'break'
  start: string
  end: string
  location: string
  column: number
  session?: SessionInfo
  joinInfo?: string
  durationMinutes: number
  label?: string
}

export interface TimelineEntry {
  key: string
  kind: 'session' | 'break'
  start: string
  end: string
  location: string
  column: number
  rowStart: number
  rowSpan: number
  session?: SessionInfo
  joinInfo?: string
  durationMinutes: number
  label?: string
}

export interface BlockTimeline {
  columnCount: number
  entries: Array<TimelineEntry>
}

/**
 * Lays a block's rooms + remote sessions out onto a shared CSS-Grid-ready
 * timeline: one column per room (plus one per remote session), and
 * row-spans derived from the block's distinct start times — so a single
 * long session in one room visually spans the same vertical space as
 * another room's shorter split sessions+break.
 */
export function buildBlockTimeline(schedule: Schedule, block: Block): BlockTimeline {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id

  const raw: Array<RawEntry> = []
  let column = 0

  for (const roomTrack of block.rooms) {
    const timedItems = withTiming(roomTrack.items, block.startTime)
    for (const { item, start, end } of timedItems) {
      raw.push({
        kind: item.kind,
        start,
        end,
        location: roomName(roomTrack.room),
        column,
        session: item.kind === 'session' ? item : undefined,
        durationMinutes: item.durationMinutes,
        label: item.kind === 'break' ? item.label : undefined,
      })
    }
    column += 1
  }

  for (const session of block.remote) {
    raw.push({
      kind: 'session',
      start: block.startTime,
      end: addMinutesToTime(block.startTime, session.durationMinutes),
      location: 'Remote',
      column,
      session,
      joinInfo: session.joinInfo,
      durationMinutes: session.durationMinutes,
    })
    column += 1
  }

  const boundaries = [...new Set(raw.map((entry) => entry.start))].sort((a, b) => a.localeCompare(b))

  const entries: Array<TimelineEntry> = raw.map((entry) => {
    const rowStart = boundaries.indexOf(entry.start) + 1
    const endBoundaryIndex = boundaries.findIndex((boundary) => boundary >= entry.end)
    const rowSpan = (endBoundaryIndex === -1 ? boundaries.length : endBoundaryIndex) - rowStart + 1
    return {
      ...entry,
      key: entry.session?.id ?? `${entry.column}-${entry.start}-break`,
      rowStart,
      rowSpan: Math.max(1, rowSpan),
    }
  })

  entries.sort((a, b) => a.rowStart - b.rowStart || a.column - b.column)

  return { columnCount: column, entries }
}
