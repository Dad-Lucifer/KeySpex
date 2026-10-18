import { CheckCircle2 } from "lucide-react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { DateTile } from "../DateTile"
import { Money } from "../Money"
import { StatusBadge } from "../StatusBadge"
import type { UpcomingDisbursementItem } from "@/lib/admin/payrollService"

export type DisbursementTimelineCardProps = {
  items: UpcomingDisbursementItem[]
  onAuthorizePayment?: (id: string, title: string) => void
  className?: string
}

export function DisbursementTimelineCard({
  items,
  onAuthorizePayment,
  className,
}: DisbursementTimelineCardProps) {
  const totalUpcoming = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Disbursement Schedule & Banking Calendar"
        subtitle="Chronological sequence of upcoming ACH settlements, milestone releases, and SaaS renewals"
        actions={
          <span className="text-[12px] font-semibold text-[#0866F5]">
            Total Scheduled: <Money value={totalUpcoming} />
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
        {items.map((item) => {
          const isDueSoon = item.status === "due_soon"
          const isPending = item.status === "pending_auth"

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-3.5 transition-colors hover:border-[#CBD5E1]"
            >
              <div className="flex items-start gap-3">
                <DateTile
                  month={item.month}
                  day={item.day}
                  tone={isDueSoon ? "warning" : isPending ? "danger" : "info"}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <StatusBadge
                      tone={isDueSoon ? "warning" : isPending ? "danger" : "info"}
                      size="sm"
                    >
                      {item.dueLabel}
                    </StatusBadge>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-1 text-[13px] font-bold text-[#090B10] line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    {item.beneficiary}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#090B10] tabular-nums">
                  <Money value={item.amount} />
                </span>

                {onAuthorizePayment && (
                  <button
                    type="button"
                    onClick={() => onAuthorizePayment(item.id, item.title)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0866F5] hover:text-[#0556D1] hover:underline cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Authorize</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <CardFooter className="pt-3">
        <p className="text-[12px] text-[#64748B]">
          ACH Direct Debit settlement window is 48 banking hours. Core team payroll executes automatically on October 31, 2026.
        </p>
      </CardFooter>
    </AdminCard>
  )
}
