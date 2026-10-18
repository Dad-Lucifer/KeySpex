import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type DeltaChipProps = {
  value: number | string
  suffix?: string
  invert?: boolean
  className?: string
}

/**
 * DeltaChip — Percentage change chip with indicator arrow (admin.md §10.2).
 */
export function DeltaChip({
  value,
  suffix = "",
  invert = false,
  className,
}: DeltaChipProps) {
  const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""))
  const isPositive = invert ? num < 0 : num >= 0
  const displayVal = typeof value === "number" ? `${num >= 0 ? "+" : ""}${value}${suffix}` : String(value)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold select-none",
        isPositive
          ? "border border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]"
          : "border border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
        className
      )}
    >
      {isPositive ? (
        <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      )}
      <span>{displayVal}</span>
    </span>
  )
}
