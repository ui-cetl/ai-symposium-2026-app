import type { ResourceLink, Schedule, SessionInfo } from './types'
import { addMinutesToTime, formatTime, withTiming } from './timing'

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

/** One schedule item (session or break) with its time/location resolved, in chronological order. */
export type ScheduleEntry =
  | { key: string; kind: 'session'; start: string; end: string; location: string; blockLabel: string; session: ResolvedSession }
  | { key: string; kind: 'break'; start: string; end: string; location: string; blockLabel: string; label?: string }

function resolveSession(item: SessionInfo & { durationMinutes: number }, start: string, end: string, blockLabel: string, location: string, joinInfo?: string): ResolvedSession {
  return {
    ...item,
    joinInfo,
    start,
    end,
    timeRange: `${formatTime(start)}–${formatTime(end)}`,
    blockLabel,
    location,
  }
}

/**
 * Flattens every plenary session/break, workshop-room session/break, and
 * virtual-track session across the schedule, with timing/location
 * resolved, in schedule order (on-site blocks, then the virtual track).
 * This is the single source every other view (the flat time-grouped
 * schedule list, "My Schedule", the presenters/materials indexes) reads
 * from — nothing here is specific to any one page's presentation.
 */
export function getScheduleEntries(schedule: Schedule): Array<ScheduleEntry> {
  const roomName = (id: string) => schedule.rooms.find((room) => room.id === id)?.name ?? id
  const entries: Array<ScheduleEntry> = []

  for (const block of schedule.blocks) {
    if (block.kind === 'plenary') {
      const start = block.startTime
      const end = addMinutesToTime(start, block.item.durationMinutes)
      const location = block.location ?? ''

      if (block.item.kind === 'session') {
        entries.push({
          key: block.item.id,
          kind: 'session',
          start,
          end,
          location,
          blockLabel: block.label,
          session: resolveSession(block.item, start, end, block.label, location),
        })
      } else {
        entries.push({
          key: `${block.id}-break`,
          kind: 'break',
          start,
          end,
          location,
          blockLabel: block.label,
          label: block.item.label,
        })
      }
      continue
    }

    for (const roomTrack of block.rooms) {
      const location = roomName(roomTrack.room)
      const timedItems = withTiming(roomTrack.items, block.startTime)
      for (const { item, start, end } of timedItems) {
        if (item.kind === 'session') {
          entries.push({
            key: item.id,
            kind: 'session',
            start,
            end,
            location,
            blockLabel: block.label,
            session: resolveSession(item, start, end, block.label, location),
          })
        } else {
          entries.push({
            key: `${block.id}-${roomTrack.room}-${start}-break`,
            kind: 'break',
            start,
            end,
            location,
            blockLabel: block.label,
            label: item.label,
          })
        }
      }
    }
  }

  for (const session of schedule.virtualTrack) {
    const start = session.startTime
    const end = addMinutesToTime(start, session.durationMinutes)
    entries.push({
      key: session.id,
      kind: 'session',
      start,
      end,
      location: 'Remote',
      blockLabel: 'Virtual Sessions',
      session: resolveSession(session, start, end, 'Virtual Sessions', 'Remote', session.joinInfo),
    })
  }

  return entries
}

/** Every session (no breaks), in schedule order. */
export function getAllSessions(schedule: Schedule): Array<ResolvedSession> {
  const sessions: Array<ResolvedSession> = []
  for (const entry of getScheduleEntries(schedule)) {
    if (entry.kind === 'session') sessions.push(entry.session)
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

/**
 * Room/location display order for the flat time-grouped schedule view and
 * the toolbar's room filter — whole-audience plenary location first, then
 * the physical workshop rooms in `rooms.yaml` order, then the remote
 * track last, matching how the editorial sample orders its own ROOMS
 * list. Anything else (e.g. an off-site social's street address) sorts
 * after all of those, in the order it's first encountered.
 */
function roomDisplayOrder(schedule: Schedule): Array<string> {
  return ['International Ballroom North', ...schedule.rooms.map((room) => room.name), 'Remote']
}

export interface ScheduleSlot {
  start: string
  end: string
  entries: Array<ScheduleEntry>
}

/**
 * Groups schedule entries that share a start time into one slot — the flat,
 * editorial "one time heading, several session rows" layout, replacing a
 * side-by-side concurrent-room grid. Pass a pre-filtered entry list (see
 * the schedule toolbar) to group only what's currently visible.
 */
export function groupEntriesByStartTime(schedule: Schedule, entries: Array<ScheduleEntry>): Array<ScheduleSlot> {
  const order = roomDisplayOrder(schedule)
  const orderIndex = (location: string) => {
    const index = order.indexOf(location)
    return index === -1 ? order.length : index
  }

  const byStart = new Map<string, Array<ScheduleEntry>>()
  for (const entry of entries) {
    const list = byStart.get(entry.start) ?? []
    list.push(entry)
    byStart.set(entry.start, list)
  }

  return [...byStart.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([start, slotEntries]) => {
      const sorted = [...slotEntries].sort((a, b) => orderIndex(a.location) - orderIndex(b.location))
      const end = sorted.reduce((latest, entry) => (entry.end > latest ? entry.end : latest), sorted[0].end)
      return { start, end, entries: sorted }
    })
}

/** Distinct room/location names that host at least one session, in display order. */
export function listRoomOptions(schedule: Schedule, sessions: Array<ResolvedSession>): Array<string> {
  const order = roomDisplayOrder(schedule)
  const present = new Set(sessions.map((session) => session.location))
  return order.filter((room) => present.has(room))
}

/** Distinct track values across sessions, in first-seen order. */
export function listTrackOptions(sessions: Array<ResolvedSession>): Array<string> {
  const seen = new Set<string>()
  const tracks: Array<string> = []
  for (const session of sessions) {
    if (session.track && !seen.has(session.track)) {
      seen.add(session.track)
      tracks.push(session.track)
    }
  }
  return tracks
}

export interface PresenterEntry {
  name: string
  sessions: Array<ResolvedSession>
}

/**
 * Every unique speaker across all sessions, grouped A-Z by the name as
 * displayed (not last name — sorting by last name while showing "First
 * Last" means the on-screen letter rarely matches what's actually first),
 * each linked to the sessions they're speaking in. Role/bio text isn't part
 * of the data model (only a plain speaker name string per session), so
 * neither is fabricated here.
 */
export function listPresenters(sessions: Array<ResolvedSession>): Array<PresenterEntry> {
  const byName = new Map<string, Array<ResolvedSession>>()
  for (const session of sessions) {
    for (const speaker of session.speakers) {
      const list = byName.get(speaker) ?? []
      list.push(session)
      byName.set(speaker, list)
    }
  }
  return [...byName.entries()]
    .map(([name, speakerSessions]) => ({ name, sessions: speakerSessions }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export interface MaterialLink extends ResourceLink {
  kind: 'resource' | 'artifact'
  /** Derived from the URL's file extension when it has one, e.g. "PDF" — never fabricated. */
  format?: string
}

export interface MaterialEntry {
  session: ResolvedSession
  links: Array<MaterialLink>
}

function deriveFormat(url: string): string | undefined {
  const match = /\.([a-zA-Z0-9]+)(?:[?#]|$)/.exec(url)
  return match ? match[1].toUpperCase() : undefined
}

/** Sessions that have at least one real resource or artifact link, with a derived format tag per link. */
export function listMaterials(sessions: Array<ResolvedSession>): Array<MaterialEntry> {
  return sessions
    .map((session): MaterialEntry => {
      const links: Array<MaterialLink> = [
        ...(session.resources ?? []).map((link) => ({ ...link, kind: 'resource' as const, format: deriveFormat(link.url) })),
        ...(session.artifacts ?? []).map((link) => ({ ...link, kind: 'artifact' as const, format: deriveFormat(link.url) })),
      ]
      return { session, links }
    })
    .filter((entry) => entry.links.length > 0)
}
