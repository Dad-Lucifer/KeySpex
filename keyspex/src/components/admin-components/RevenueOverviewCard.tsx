import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { AdminCard } from "./AdminCard"
import { CardHeader } from "./CardHeader"
import { CardFooter } from "./CardFooter"
import { LegendItem } from "./LegendItem"
import { SegmentedControl } from "./SegmentedControl"
import { AreaLineChart } from "./AreaLineChart"
import { revenueOverviewChartData } from "@/data/admin/dashboardData"

export type RevenueOverviewCardProps = {
  className?: string
  data?: {
    labels: string[]
    currentSeries: number[]
    previousSeries: number[]
    projectionText?: string
  }
  periodData?: {
    "6M"?: { labels: string[]; currentSeries: number[]; previousSeries: number[] }
    YTD?: { labels: string[]; currentSeries: number[]; previousSeries: number[] }
    "1Y"?: { labels: string[]; currentSeries: number[]; previousSeries: number[] }
  }
  loading?: boolean
}

/**
 * RevenueOverviewCard — Primary trajectory comparison card per admin.md §10.4.
 * Connected to live Firestore database with reactive period adaptation.
 */
export function RevenueOverviewCard({
  className,
  data,
  periodData,
  loading = false,
}: RevenueOverviewCardProps) {
  const [period, setPeriod] = useState<string>("6M")

  const periodOptions = [
    { value: "6M", label: "6M" },
    { value: "YTD", label: "YTD" },
    { value: "1Y", label: "1Y" },
  ]

  // Select active period data from live Firestore or fallback
  const activeSeries =
    periodData && periodData[period as keyof typeof periodData]
      ? periodData[period as keyof typeof periodData]!
      : data
      ? {
          labels: data.labels,
          currentSeries: data.currentSeries,
          previousSeries: data.previousSeries,
        }
      : revenueOverviewChartData

  const projectionText =
    data?.projectionText ||
    "Monthly run-rate projected to breach ₹9.2L in Nov 2026."

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Revenue Overview"
        subtitle="Comparative trajectory across trailing periods"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-[11px] text-[#94A3B8] uppercase">
              H1/H2 FY26-27
            </span>
            <div className="flex items-center gap-2">
              <LegendItem color="#0866F5" label="Current" />
              <LegendItem color="#94A3B8" label="Previous" />
            </div>
            <SegmentedControl
              options={periodOptions}
              value={period}
              onChange={setPeriod}
              ariaLabel="Revenue period toggle"
            />
          </div>
        }
      />

      <div className="my-2 relative min-h-[230px]">
        {loading ? (
          <div className="flex h-[230px] w-full items-center justify-center rounded-lg bg-[#F8FAFC]/50">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0866F5] border-t-transparent" />
              <span>Syncing live chart data…</span>
            </div>
          </div>
        ) : (
          <AreaLineChart
            labels={activeSeries.labels}
            currentSeries={activeSeries.currentSeries}
            previousSeries={activeSeries.previousSeries}
          />
        )}
      </div>

      <CardFooter
        href="/admin/budgets-revenue"
        linkLabel="Full Financials"
        icon={<TrendingUp className="h-4 w-4 text-[#15803D]" strokeWidth={2} />}
      >
        <span className="text-[13px] text-[#334155]">
          {projectionText}
        </span>
      </CardFooter>
    </AdminCard>
  )
}
