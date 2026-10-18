import { cn } from "@/lib/utils"
import type { Tone } from "@/types/admin"

export type DateTileProps = {
  month: string
  day: string | number
  tone?: Tone
  className?: string
}

const TONE_BORDERS: Record<Tone, { border: string; bg: string; monthColor: string }> = {
  info: {
    border: "border-[#D3E4FD]",
    bg: "bg-[#F3F8FF]",
    monthColor: "text-[#0556D1]",
  },
  success: {
    border: "border-[#BBF7D0]",
    bg: "bg-[#DCFCE7]/60",
    monthColor: "text-[#15803D]",
  },
  warning: {
    border: "border-[#FDE68A]",
    bg: "bg-[#FEF3C7]/60",
    monthColor: "text-[#B45309]",
  },
  danger: {
    border: "border-[#FECACA]",
    bg: "bg-[#FEE2E2]/60",
    monthColor: "text-[#B91C1C]",
  },
  neutral: {
    border: "border-[#E2E8F0]",
    bg: "bg-[#F1F5F9]",
    monthColor: "text-[#475569]",
  },
  purple: {
    border: "border-[#DDD6FE]",
    bg: "bg-[#EDE9FE]/60",
    monthColor: "text-[#6D28D9]",
  },
}

/**
 * DateTile — Calendar date badge (36x40px) per admin.md §10.2.
 */
export function DateTile({
  month,
  day,
  tone = "info",
  className,
}: DateTileProps) {
  const styles = TONE_BORDERS[tone]

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-10 w-9 shrink-0 flex-col items-center justify-center rounded-[8px] border text-center select-none",
        styles.border,
        styles.bg,
        className
      )}
    >
      <span className={cn("text-[9px] font-bold uppercase tracking-wider leading-none", styles.monthColor)}>
        {month}
      </span>
      <span className="text-[16px] font-bold leading-tight text-[#090B10] tabular-nums">
        {day}
      </span>
    </div>
  )
}
