import { cn } from "@/lib/utils"

export type RadialGaugeProps = {
  value: number // 0 - 100
  size?: number
  strokeWidth?: number
  label?: string
  valueLabel?: string
  ariaLabel?: string
  className?: string
}

/**
 * RadialGauge — Circular utilization gauge per admin.md §10.6.
 * Renders SVG arc with center percentage and label.
 */
export function RadialGauge({
  value,
  size = 132,
  strokeWidth = 12,
  label = "UTILIZED",
  valueLabel,
  ariaLabel,
  className,
}: RadialGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const strokeDashoffset = circumference - (clamped / 100) * circumference
  const center = size / 2

  return (
    <div
      role="img"
      aria-label={ariaLabel || `${clamped}% of budget utilized`}
      className={cn("relative flex shrink-0 items-center justify-center select-none", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EAF0FA"
          strokeWidth={strokeWidth}
        />

        {/* Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#0866F5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center percentage and label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[22px] font-bold tracking-tight text-[#090B10] tabular-nums leading-none">
          {valueLabel || `${clamped.toFixed(1)}%`}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#64748B] leading-none">
          {label}
        </span>
      </div>
    </div>
  )
}
