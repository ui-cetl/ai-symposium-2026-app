import { useEffect, useMemo, useState } from 'react'

import type { Schedule } from '../data/schedule/types'
import { findConflicts, getAllSessions, getDefaultSelectedIds } from '../data/schedule/sessions'

const STORAGE_KEY = 'ai-symposium-2026:my-schedule'

function loadIds(schedule: Schedule): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      // First visit (no saved selection yet) — auto-enroll in the
      // whole-audience plenary sessions (keynote, closing, etc.), since
      // they never conflict with anything and everyone attends them.
      return new Set(getDefaultSelectedIds(schedule))
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed.filter((id) => typeof id === 'string')) : new Set()
  } catch {
    // localStorage unavailable (private mode, etc.) — falls back to the
    // same default for this page load, though it won't persist
    return new Set(getDefaultSelectedIds(schedule))
  }
}

function saveIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // localStorage unavailable (private mode, etc.) — selection just won't persist
  }
}

/**
 * Manages the attendee's personal talk selection, persisted to localStorage.
 * Selecting a talk that overlaps an existing pick automatically removes the
 * conflicting pick(s) first (last click wins).
 */
export function useMySchedule(schedule: Schedule) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => loadIds(schedule))

  useEffect(() => {
    saveIds(selectedIds)
  }, [selectedIds])

  const allSessions = useMemo(() => getAllSessions(schedule), [schedule])

  const selectedSessions = useMemo(
    () =>
      allSessions
        .filter((session) => selectedIds.has(session.id))
        .sort((a, b) => a.start.localeCompare(b.start)),
    [allSessions, selectedIds],
  )

  function isSelected(id: string): boolean {
    return selectedIds.has(id)
  }

  function toggle(id: string) {
    setSelectedIds((current) => {
      if (current.has(id)) {
        const next = new Set(current)
        next.delete(id)
        return next
      }

      const candidate = allSessions.find((session) => session.id === id)
      if (!candidate) return current

      const currentlySelected = allSessions.filter((session) => current.has(session.id))
      const conflicts = findConflicts(candidate, currentlySelected)

      const next = new Set(current)
      for (const conflict of conflicts) next.delete(conflict.id)
      next.add(id)
      return next
    })
  }

  return { selectedSessions, isSelected, toggle }
}
