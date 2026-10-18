import React from "react"
import { AdminCard } from "./AdminCard"
import { Money } from "./Money"
import { DeltaChip } from "./DeltaChip"
import { StatusBadge } from "./StatusBadge"
import { cn } from "@/lib/utils"
import type { Tone } from "@/types/admin"
import type { LucideIcon } from "lucide-react"

export type KpiCardProps = {
  id: string
  label: string
  icon: LucideIcon
  iconTone?: Tone
  value: number | string
  isCurrency?: boolean
  delta?: string
  badgeText?: string
  chipText?: string
  caption?: string
  breakdown?: Array<{ label: string; count: number; tone: Tone }>
  className?: string
}

const ICON_TONES: Record<Tone, { bg: string; fg: string }> = {
  info: { bg: "bg-[#E8F1FE]", fg: "text-[#0866F5]" },
  success: { bg: "bg-[#DCFCE7]", fg: "text-[#15803D]" },
  warning: { bg: "bg-[#FEF3C7]", fg: "text-[#B45309]" },
  danger: { bg: "bg-[#FEE2E2]", fg: "text-[#B91C1C]" },
  neutral: { bg: "bg-[#F1F5F9]", fg: "text-[#475569]" },
  purple: { bg: "bg-[#EDE9FE]", fg: "text-[#6D28D9]" },
}

/**
 * KpiCard — 3-row KPI statistics card conforming to admin.md §10.3.1.
 */
export function KpiCard({
  label,
  icon: Icon,
  iconTone = "info",
  value,
  isCurrency = false,
  delta,
  badgeText,
  chipText,
  caption,
  breakdown,
  className,
}: KpiCardProps) {
  const iconStyle = ICON_TONES[iconTone]

  return (
    <AdminCard padded={false} className={cn("p-4 min-h-[130px] justify-between", className)}>
      {/* Row 1: Label + Icon Tile */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748B] truncate">
          {label}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]",
            iconStyle.bg,
            iconStyle.fg
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>

      {/* Row 2: Value */}
      <div className="my-1.5">
        <span className="text-[24px] sm:text-[26px] font-bold leading-tight text-[#090B10] tracking-tight whitespace-nowrap">
          {isCurrency && typeof value === "number" ? (
            <Money value={value} />
          ) : (
            <span className="tabular-nums">{value}</span>
          )}
        </span>
      </div>

      {/* Row 3: Meta line (chips, captions, breakdowns) */}
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
        {delta && <DeltaChip value={delta} />}

        {badgeText && (
          <StatusBadge tone="warning" dot size="sm">
            {badgeText}
          </StatusBadge>
        )}

        {chipText && (
          <span className="rounded-full border border-[#D3E4FD] bg-[#E8F1FE] px-2 py-0.5 text-[11px] font-semibold text-[#0556D1]">
            {chipText}
          </span>
        )}

        {breakdown && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {breakdown.map((item, idx) => (
              <React.Fragment key={item.label}>
                {idx > 0 && <span className="text-[#CBD5E1]">•</span>}
                <span className="flex items-center gap-1 whitespace-nowrap font-medium">
                  {item.tone === "success" && <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />}
                  <span className={cn(
                    "font-bold tabular-nums",
                    item.tone === "success" ? "text-[#15803D]" : item.tone === "warning" ? "text-[#B45309]" : item.tone === "danger" ? "text-[#B91C1C]" : "text-[#090B10]"
                  )}>
                    {item.count}
                  </span>
                  <span className="text-[#64748B]">{item.label}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {caption && (
          <span className="text-[12px] text-[#64748B] truncate">
            {caption}
          </span>
        )}
      </div>
    </AdminCard>
  )
}
