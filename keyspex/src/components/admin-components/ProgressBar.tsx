import { cn } from "@/lib/utils"

export type ProgressBarProps = {
  value: number // 0 - 100
  tone?: "primary" | "mid" | "slate" | "soft"
  height?: number
  label?: string
  className?: string
}

const TONE_COLORS = {
  primary: "bg-[#0866F5]",
  mid: "bg-[#4C94F8]",
  slate: "bg-[#475569]",
  soft: "bg-[#A9C1E8]",
}

/**
 * ProgressBar — Horizontal bar with tone fills per admin.md §10.2 & §10.7.
 */
export function ProgressBar({
  value,
  tone = "primary",
  height = 8,
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${clamped}%`}
      className={cn("w-full overflow-hidden rounded-full bg-[#EAF0FA]", className)}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          TONE_COLORS[tone]
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
