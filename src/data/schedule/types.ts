/**
 * Data model for the symposium schedule.
 *
 * Authoring contract for YAML files under `src/data/schedule/`:
 * - `rooms.yaml` is a single list of `Room` objects.
 * - `blocks/*.yaml` — one file per time block — each parses to a `Block`.
 *
 * A block is a single physical time slot (e.g. 75 minutes). Within that
 * slot, each room runs its own independent sequence of `items` (sessions
 * and/or breaks) whose `durationMinutes` should sum to the block's
 * `durationMinutes`. This lets one room hold a single long session while
 * another splits the same slot into two shorter sessions with a break.
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

/** A remote-only session, running alongside the on-site rooms in a block. */
export interface RemoteSession extends SessionInfo {
  durationMinutes: number
  joinInfo?: string
}

export interface Block {
  id: string
  label: string
  /** 24-hour local time, e.g. "09:00". */
  startTime: string
  durationMinutes: number
  rooms: Array<RoomTrack>
  /** Up to 3 remote sessions running alongside the on-site rooms. */
  remote: Array<RemoteSession>
}

export interface Room {
  id: string
  name: string
  number?: string
}

export interface Schedule {
  rooms: Array<Room>
  blocks: Array<Block>
}
