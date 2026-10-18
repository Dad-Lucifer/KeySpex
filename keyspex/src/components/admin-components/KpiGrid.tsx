import { KpiCard, type KpiCardProps } from "./KpiCard"
import { cn } from "@/lib/utils"

export type KpiGridProps = {
  items: KpiCardProps[]
  className?: string
}

/**
 * KpiGrid — Responsive grid containing the 6 primary metrics (admin.md §10.3.1).
 * Scales from 1 column (<400px), 2 columns (400-720px), 3 columns (720-1180px), to 6 columns (≥1180px).
 */
export function KpiGrid({ items, className }: KpiGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4",
        className
      )}
    >
      {items.map((item) => (
        <KpiCard key={item.id} {...item} />
      ))}
    </div>
  )
}
