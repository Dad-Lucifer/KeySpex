import { useEffect, useMemo, useRef, useState } from "react"

export const TASKS = [
  { id: "scope", label: "Scope & structure", w: "w-14" },
  { id: "experience", label: "Experience design", w: "w-16" },
  { id: "build", label: "Build & launch", w: "w-12" },
]

export const STEP_MS = 1150

export interface BuildSequence {
  done: number
  pct: number
}

/** Shared clock so the panel and its caption never disagree. */
export const useBuildSequence = (enabled: boolean): BuildSequence => {
  const [done, setDone] = useState<number>(() => (enabled ? 0 : TASKS.length))
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!enabled) {
      const timer = window.setTimeout(() => setDone(TASKS.length), 0)
      return () => clearTimeout(timer)
    }

    timers.current.forEach(clearTimeout)
    timers.current = TASKS.map((_, i) =>
      window.setTimeout(() => setDone(i + 1), 900 + i * STEP_MS)
    )
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [enabled])

  return useMemo(
    () => ({ done, pct: Math.round((done / TASKS.length) * 100) }),
    [done]
  )
}
