import { Link } from "react-router-dom"
import { AdminCard } from "./AdminCard"
import { CardHeader } from "./CardHeader"
import { DateTile } from "./DateTile"
import { MonoCode } from "./MonoCode"
import { Money } from "./Money"
import { StatusBadge } from "./StatusBadge"
import { obligationsData } from "@/data/admin/dashboardData"
import type { Tone } from "@/types/admin"

export type UpcomingObligationsCardProps = {
  className?: string
}

const STATUS_TONES: Record<string, Tone> = {
  due_soon: "warning",
  scheduled: "info",
  pending_auth: "neutral",
}

/**
 * UpcomingObligationsCard — Imminent payouts list per admin.md §10.8.
 */
export function UpcomingObligationsCard({ className }: UpcomingObligationsCardProps) {
  const totalOutflow = obligationsData.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Upcoming Obligations"
        subtitle="Imminent payouts & disbursements"
        actions={
          <Link
            to="/admin/payment-timeline"
            className="text-[13px] font-semibold text-[#0866F5] hover:underline"
          >
            View All
          </Link>
        }
      />

      <div className="flex flex-col divide-y divide-[#E5E7EB]">
        {obligationsData.map((ob) => {
          const tone = STATUS_TONES[ob.status] || "info"

          return (
            <div
              key={ob.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-1"
            >
              <div className="flex items-center gap-3 min-w-0">
                <DateTile month={ob.month} day={ob.day} tone={tone} />

                <div className="min-w-0">
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#090B10] truncate">
                    {ob.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#64748B] flex items-center gap-1.5 truncate">
                    <span>{ob.clientName}</span>
                    <span>•</span>
                    <MonoCode variant="muted">{ob.clientCode}</MonoCode>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                <Money value={ob.amount} className="text-[14px] sm:text-[15px] font-bold text-[#090B10]" />
                <StatusBadge tone={tone} size="sm">
                  {ob.dueLabel}
                </StatusBadge>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-3.5 text-[13px]">
        <span className="text-[#64748B]">Total Pipeline Outflow (Next 14d)</span>
        <Money value={totalOutflow} className="font-bold text-[#090B10]" />
      </div>
    </AdminCard>
  )
}
