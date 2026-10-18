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
}

/**
 * RevenueOverviewCard — Primary trajectory comparison card per admin.md §10.4.
 */
export function RevenueOverviewCard({ className }: RevenueOverviewCardProps) {
  const [period, setPeriod] = useState<string>("6M")

  const periodOptions = [
    { value: "6M", label: "6M" },
    { value: "YTD", label: "YTD" },
    { value: "1Y", label: "1Y" },
  ]

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

      <div className="my-2">
        <AreaLineChart
          labels={revenueOverviewChartData.labels}
          currentSeries={revenueOverviewChartData.currentSeries}
          previousSeries={revenueOverviewChartData.previousSeries}
        />
      </div>

      <CardFooter
        href="/admin/budgets-revenue"
        linkLabel="Full Financials"
        icon={<TrendingUp className="h-4 w-4 text-[#15803D]" strokeWidth={2} />}
      >
        <span className="text-[13px] text-[#334155]">
          Monthly run-rate projected to breach <span className="font-bold text-[#090B10]">₹9.2L</span> in Nov 2026.
        </span>
      </CardFooter>
    </AdminCard>
  )
}
