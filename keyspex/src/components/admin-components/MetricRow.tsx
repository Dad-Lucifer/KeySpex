import React from "react"
import { cn } from "@/lib/utils"

export type MetricRowProps = {
  label: string
  value: React.ReactNode
  tone?: "default" | "info" | "success" | "danger"
  className?: string
}

/**
 * MetricRow — Key/value statistical row per admin.md §10.2.
 */
export function MetricRow({
  label,
  value,
  tone = "default",
  className,
}: MetricRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-1.5 text-[14px]", className)}>
      <span className="text-[#475569] font-medium">{label}</span>
      <span
        className={cn(
          "font-bold tabular-nums",
          tone === "default" && "text-[#090B10]",
          tone === "info" && "text-[#0866F5]",
          tone === "success" && "text-[#15803D]",
          tone === "danger" && "text-[#B91C1C]"
        )}
      >
        {value}
      </span>
    </div>
  )
}
