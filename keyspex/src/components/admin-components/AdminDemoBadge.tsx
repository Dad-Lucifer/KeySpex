import { cn } from "@/lib/utils"

/**
 * AdminDemoBadge — Standalone "Demo Environment" indicator pill.
 * Derived from: StatusBadge (admin.md §10.2, §7.2 info tone).
 * Used on: AdminLoginPage and administrative headers.
 */
export type AdminDemoBadgeProps = {
  className?: string
}

export function AdminDemoBadge({ className }: AdminDemoBadgeProps) {
  return (
    <span
      role="status"
      aria-label="Demo environment — data is illustrative"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "border-[#D3E4FD] bg-[#E8F1FE] text-[11px] font-semibold text-[#0556D1]",
        "tracking-[0.06em] uppercase select-none transition-colors",
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#0556D1] animate-pulse"
        aria-hidden="true"
      />
      <span>Demo Environment</span>
    </span>
  )
}
