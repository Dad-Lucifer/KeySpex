import React from "react"
import { cn } from "@/lib/utils"

export type SectionLabelProps = {
  children: React.ReactNode
  className?: string
}

/**
 * SectionLabel — Section heading atom per admin.md §10.2:
 * 11px font-semibold uppercase tracking 0.08em in muted slate (#64748B).
 */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B] select-none",
        className
      )}
    >
      {children}
    </span>
  )
}
