import { useEffect, useState } from 'react'

/** Keep in sync with the mobile/desktop breakpoint used across schedule component CSS. */
const MOBILE_QUERY = '(max-width: 640px)'

/**
 * True when the viewport matches the mobile breakpoint. SSR-safe (defaults to
 * `false` before hydration). Intended for small behavioral defaults (e.g.
 * whether a `<details>` starts open) — layout should be handled by CSS.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_QUERY).matches
  })

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mediaQueryList.matches)
    onChange()
    mediaQueryList.addEventListener('change', onChange)
    return () => mediaQueryList.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
