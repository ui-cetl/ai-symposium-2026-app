import type { Schedule } from './types'

export interface ScheduleStats {
  blockCount: number
  roomCount: number
  onSiteSessionCount: number
  remoteSessionCount: number
  trackCount: number
  speakerCount: number
}

/** Derives summary counts from the schedule, for landing-page highlights. */
export function computeScheduleStats(schedule: Schedule): ScheduleStats {
  const tracks = new Set<string>()
  const speakers = new Set<string>()
  let onSiteSessionCount = 0
  let remoteSessionCount = 0

  for (const block of schedule.blocks) {
    for (const roomTrack of block.rooms) {
      for (const item of roomTrack.items) {
        if (item.kind !== 'session') continue
        onSiteSessionCount += 1
        if (item.track) tracks.add(item.track)
        for (const speaker of item.speakers) speakers.add(speaker)
      }
    }
    for (const session of block.remote) {
      remoteSessionCount += 1
      if (session.track) tracks.add(session.track)
      for (const speaker of session.speakers) speakers.add(speaker)
    }
  }

  return {
    blockCount: schedule.blocks.length,
    roomCount: schedule.rooms.length,
    onSiteSessionCount,
    remoteSessionCount,
    trackCount: tracks.size,
    speakerCount: speakers.size,
  }
}
