import React from "react"
import { cn } from "@/lib/utils"
import type { Tone } from "@/types/admin"

export type StatusBadgeProps = {
  tone: Tone
  dot?: boolean
  children: React.ReactNode
  size?: "sm" | "md"
  className?: string
}

const TONE_CLASSES: Record<Tone, { badge: string; dot: string }> = {
  info: {
    badge: "border-[#D3E4FD] bg-[#E8F1FE] text-[#0556D1]",
    dot: "bg-[#0556D1]",
  },
  success: {
    badge: "border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]",
    dot: "bg-[#15803D]",
  },
  warning: {
    badge: "border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]",
    dot: "bg-[#B45309]",
  },
  danger: {
    badge: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
    dot: "bg-[#B91C1C]",
  },
  neutral: {
    badge: "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]",
    dot: "bg-[#475569]",
  },
  purple: {
    badge: "border-[#DDD6FE] bg-[#EDE9FE] text-[#6D28D9]",
    dot: "bg-[#6D28D9]",
  },
}

/**
 * StatusBadge — Standard pill badge per admin.md §10.2 & §7.2 tone system.
 */
export function StatusBadge({
  tone,
  dot = false,
  children,
  size = "md",
  className,
}: StatusBadgeProps) {
  const styles = TONE_CLASSES[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold select-none",
        size === "sm" ? "h-5 px-2 text-[11px]" : "h-[22px] px-2.5 text-[12px]",
        styles.badge,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  )
}
