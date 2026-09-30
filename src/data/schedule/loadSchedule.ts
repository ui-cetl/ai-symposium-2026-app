import { load } from 'js-yaml'

import type { Block, Room, Schedule, VirtualSession } from './types'

const roomModules = import.meta.glob('./rooms.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const blockModules = import.meta.glob('./blocks/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const virtualModule = import.meta.glob('./virtual.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseRooms(): Array<Room> {
  const [raw] = Object.values(roomModules)
  return raw ? (load(raw) as Array<Room>) : []
}

function parseBlocks(): Array<Block> {
  return Object.values(blockModules)
    .map((raw) => load(raw) as Block)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

function parseVirtualTrack(): Array<VirtualSession> {
  const [raw] = Object.values(virtualModule)
  const sessions = raw ? (load(raw) as Array<VirtualSession>) : []
  return sessions.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

/** Parsed once at module load, since the YAML source is static build-time content. */
export const schedule: Schedule = {
  rooms: parseRooms(),
  blocks: parseBlocks(),
  virtualTrack: parseVirtualTrack(),
}
