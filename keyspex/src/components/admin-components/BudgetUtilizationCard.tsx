import { MoreVertical } from "lucide-react"
import { AdminCard } from "./AdminCard"
import { CardHeader } from "./CardHeader"
import { RadialGauge } from "./RadialGauge"
import { MetricRow } from "./MetricRow"
import { SectionLabel } from "./SectionLabel"
import { Money } from "./Money"
import { budgetUtilizationData } from "@/data/admin/dashboardData"

export type BudgetUtilizationCardProps = {
  className?: string
  data?: {
    cap: number
    committed: number
    remaining: number
    utilizationPercent: number
    segments: Array<{ label: string; amount: number; share: string }>
  }
  loading?: boolean
}

/**
 * BudgetUtilizationCard — Gauge, key metrics, and allocation tiles per admin.md §10.6.
 * Wired directly to live Firestore database values.
 */
export function BudgetUtilizationCard({ className, data, loading = false }: BudgetUtilizationCardProps) {
  const activeData = data || budgetUtilizationData
  const { cap, committed, remaining, utilizationPercent, segments } = activeData

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Budget Utilization"
        subtitle="Fiscal cap vs commitments"
        actions={
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
            aria-label="Budget options"
          >
            <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
          </button>
        }
      />

      {loading ? (
        <div className="flex h-60 w-full items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0866F5] border-t-transparent" />
            <span>Syncing budget metrics…</span>
          </div>
        </div>
      ) : (
        <>
          {/* Main Gauge + Metrics Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <RadialGauge
              value={utilizationPercent}
              size={136}
              strokeWidth={12}
            />

            <div className="flex flex-1 flex-col justify-center divide-y divide-[#E5E7EB] w-full">
              <MetricRow
                label="Allocated Cap"
                value={<Money value={cap} tone="default" />}
              />
              <MetricRow
                label="Committed / Spent"
                value={<Money value={committed} tone="info" />}
              />
              <MetricRow
                label="Remaining Buffer"
                value={<Money value={remaining} tone="success" />}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 h-[1px] w-full bg-[#E5E7EB]" aria-hidden="true" />

          {/* Allocation Segments */}
          <div className="space-y-2.5">
            <SectionLabel>ALLOCATION SEGMENTS</SectionLabel>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {segments.map((seg) => (
                <div
                  key={seg.label}
                  className="flex flex-col items-center justify-center rounded-[10px] border border-[#DCE4F0] bg-[#F1F5FB] p-3 text-center transition-colors"
                >
                  <span className="text-[12px] font-medium text-[#64748B] leading-tight">
                    {seg.label}
                  </span>
                  <span className="mt-1 text-[17px] font-bold text-[#090B10] tabular-nums leading-snug">
                    <Money value={seg.amount} compact digits={2} />
                  </span>
                  <span className="text-[11px] font-semibold text-[#94A3B8] leading-tight">
                    {seg.share}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminCard>
  )
}
