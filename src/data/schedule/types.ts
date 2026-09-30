/**
 * Data model for the symposium schedule.
 *
 * Authoring contract for YAML files under `src/data/schedule/`:
 * - `rooms.yaml` is a single list of `Room` objects.
 * - `blocks/*.yaml` — one file per time block — each parses to a `Block`
 *   (a discriminated union on `kind`, see below).
 * - `virtual.yaml` is a single flat list of `VirtualSession` objects, each
 *   with its own explicit `startTime` — the virtual track runs on its own
 *   independent cadence, not tied to any on-site block's timing.
 *
 * A `WorkshopBlock` is a single physical time slot (e.g. 75 minutes) split
 * across concurrent rooms. Within that slot, each room runs its own
 * independent sequence of `items` (sessions and/or breaks) whose
 * `durationMinutes` should sum to the block's `durationMinutes`. This lets
 * one room hold a single long session while another splits the same slot
 * into two shorter sessions with a break.
 *
 * A `PlenaryBlock` is a single whole-audience item (a session or a break)
 * with no concurrent rooms — e.g. registration, a keynote, or a panel.
 */

export interface ResourceLink {
  label: string
  url: string
}

/** Shared fields for anything a person can attend/watch. */
export interface SessionInfo {
  id: string
  title: string
  speakers: Array<string>
  track?: string
  /** Short teaser shown on the schedule card. */
  abstract?: string
  /** Long-form write-up shown only on the session's details page. */
  description?: string
  resources?: Array<ResourceLink>
  artifacts?: Array<ResourceLink>
}

export type ScheduleItem =
  | ({ kind: 'session'; durationMinutes: number } & SessionInfo)
  | { kind: 'break'; durationMinutes: number; label?: string }

/** One room's sequential items within a single block. */
export interface RoomTrack {
  room: string
  items: Array<ScheduleItem>
}

/** A remote-only session in the independent virtual track, with its own explicit start time. */
export interface VirtualSession extends SessionInfo {
  durationMinutes: number
  /** 24-hour local time, e.g. "10:15". Independent of any on-site block. */
  startTime: string
  joinInfo?: string
}

/** A single whole-audience time slot with no concurrent rooms (e.g. registration, a keynote, a panel). */
export interface PlenaryBlock {
  kind: 'plenary'
  id: string
  label: string
  /** 24-hour local time, e.g. "09:00". */
  startTime: string
  durationMinutes: number
  location?: string
  item: ScheduleItem
}

/** A time slot split across concurrent rooms, each running its own sequential items. */
export interface WorkshopBlock {
  kind: 'workshop'
  id: string
  label: string
  /** 24-hour local time, e.g. "09:00". */
  startTime: string
  durationMinutes: number
  rooms: Array<RoomTrack>
}

export type Block = PlenaryBlock | WorkshopBlock

export interface Room {
  id: string
  name: string
  number?: string
}

export interface Schedule {
  rooms: Array<Room>
  blocks: Array<Block>
  /** The independent virtual/remote track — its own cadence, not tied to on-site block timing. */
  virtualTrack: Array<VirtualSession>
}
