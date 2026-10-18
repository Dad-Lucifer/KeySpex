import { formatINR, formatINRCompact } from "@/lib/admin/format"
import { cn } from "@/lib/utils"

export type MoneyProps = {
  value: number
  compact?: boolean
  digits?: number
  tone?: "default" | "info" | "success" | "danger"
  className?: string
}

/**
 * Money — Standardized INR currency renderer (admin.md §10.2 & §8.4).
 * Enforces tabular numbers and Indian digit grouping.
 */
export function Money({
  value,
  compact = false,
  digits = 2,
  tone = "default",
  className,
}: MoneyProps) {
  const display = compact ? formatINRCompact(value, digits) : formatINR(value)

  return (
    <span
      aria-label={formatINR(value)}
      className={cn(
        "tabular-nums font-semibold",
        tone === "default" && "text-[#090B10]",
        tone === "info" && "text-[#0866F5]",
        tone === "success" && "text-[#15803D]",
        tone === "danger" && "text-[#B91C1C]",
        className
      )}
    >
      {display}
    </span>
  )
}
