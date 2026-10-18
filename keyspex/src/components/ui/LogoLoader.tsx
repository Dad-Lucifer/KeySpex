import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface LogoLoaderProps {
  /** If true, renders as fixed full-screen splash overlay (default: true) */
  fullScreen?: boolean
  /** Duration in milliseconds for the loading animation (default: 1800ms) */
  duration?: number
  /** Callback fired after completion and fade-out */
  onComplete?: () => void
  /** Additional CSS class names */
  className?: string
  /** If true, keeps looping indefinitely without auto-dismissing (useful for testing) */
  infinite?: boolean
}

interface LetterDef {
  char: string
  isAccent: boolean
}

const LETTERS: LetterDef[] = [
  { char: "K", isAccent: false },
  { char: "e", isAccent: false },
  { char: "y", isAccent: false },
  { char: "S", isAccent: true },
  { char: "p", isAccent: true },
  { char: "e", isAccent: true },
  { char: "x", isAccent: true },
]

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  fullScreen = true,
  duration = 1800,
  onComplete,
  className,
  infinite = false,
}) => {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [isExited, setIsExited] = useState(false)

  useEffect(() => {
    if (infinite) {
      setProgress(100)
      return
    }

    const startTime = performance.now()
    let rafId: number

    const update = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(elapsed / duration, 1)

      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - rawProgress, 3)
      const currentPct = Math.min(100, Math.round(eased * 100))

      setProgress(currentPct)

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(update)
      } else {
        // Peaceful hold before dissolve
        setTimeout(() => {
          setIsDone(true)
          // Wait for the full 700ms fade-out transition before unmounting
          setTimeout(() => {
            setIsExited(true)
            onComplete?.()
          }, 700)
        }, 220)
      }
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [duration, onComplete, infinite])

  if (isExited && fullScreen) {
    return null
  }

  const content = (
    <div className="relative z-10 flex flex-col items-center justify-center text-center select-none">
      {/* ── Soft Ambient Glow Spotlight behind text ───────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-80 rounded-full bg-[#0866F5]/15 blur-[120px] ks-halo-pulse"
      />

      {/* ── Minimalist Staggered Text "KeySpex" ──────────────────────── */}
      <div className="relative flex items-center justify-center ks-word-glow">
        <h1
          className="flex items-center text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.14em] sm:tracking-[0.18em]"
          aria-label="KeySpex"
        >
          {LETTERS.map((item, index) => (
            <span
              key={index}
              className={cn(
                "inline-block ks-letter-anim",
                item.isAccent
                  ? "text-[#0866F5]"
                  : "text-white"
              )}
              style={{
                animationDelay: `${index * 45}ms`,
              }}
            >
              {item.char}
            </span>
          ))}
        </h1>
      </div>

      {/* ── Precision Laser Hairline (Hardware-Accelerated transform) ── */}
      <div className="relative mt-6 sm:mt-7 h-[1.5px] w-36 sm:w-48 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full w-full bg-gradient-to-r from-transparent via-[#0866F5] to-white rounded-full shadow-[0_0_12px_rgba(8,102,245,0.9)] will-change-transform"
          style={{
            transform: `scaleX(${progress / 100})`,
            transformOrigin: "left",
            transition: "transform 140ms linear",
          }}
        />
      </div>

      {/* ── Minimalist Numeric Telemetry ─────────────────────────────── */}
      <div className="mt-3 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-white/40">
        <span className="text-[#5B9BFF] font-semibold">{String(progress).padStart(3, " ")}%</span>
      </div>
    </div>
  )

  if (!fullScreen) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#080B12] p-12 border border-white/10",
          className
        )}
      >
        {content}
      </div>
    )
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Loading KeySpex"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#080B12] transition-all duration-700 ease-out",
        isDone ? "opacity-0 pointer-events-none scale-[1.02]" : "opacity-100 scale-100",
        className
      )}
    >
      {content}
    </aside>
  )
}
