import {
  TrendingUp,
  Landmark,
  Wallet,
  Flame,
  Hourglass,
  Sparkles,
} from "lucide-react"
import { KpiCard } from "../KpiCard"
import type { BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type BRTopKpiRowProps = {
  data: BudgetRevenueData
  onEditCap?: () => void
}

/**
 * BRTopKpiRow — 6 strategic financial KPIs for startup leadership.
 * Displays revenue, cap, surplus, burn rate, runway, and projected EOY.
 */
export function BRTopKpiRow({ data, onEditCap }: BRTopKpiRowProps) {
  const { kpis } = data

  const items = [
    {
      id: "total-revenue",
      label: "TOTAL REVENUE",
      icon: TrendingUp,
      iconTone: "info" as const,
      value: kpis.totalRevenue,
      isCurrency: true,
      delta: kpis.revenueGrowth,
      caption: "Trailing 10 Months",
    },
    {
      id: "annual-budget-cap",
      label: "ANNUAL BUDGET CAP",
      icon: Landmark,
      iconTone: "purple" as const,
      value: kpis.annualBudgetCap,
      isCurrency: true,
      badgeText: `${kpis.budgetUtilized}% Spent`,
      caption: "FY 2026-27 Target",
    },
    {
      id: "net-surplus",
      label: "NET SURPLUS",
      icon: Wallet,
      iconTone: "success" as const,
      value: kpis.netSurplus,
      isCurrency: true,
      chipText: "Available Buffer",
      caption: "Uncommitted Capital",
    },
    {
      id: "monthly-burn-rate",
      label: "MONTHLY BURN RATE",
      icon: Flame,
      iconTone: "warning" as const,
      value: kpis.burnRate,
      isCurrency: true,
      caption: "Avg Outflow / Mo",
    },
    {
      id: "runway-estimate",
      label: "RUNWAY ESTIMATE",
      icon: Hourglass,
      iconTone: "info" as const,
      value: `${kpis.monthsRunway} Months`,
      isCurrency: false,
      badgeText: "Zero Inflow Safety",
      caption: "At current burn rate",
    },
    {
      id: "projected-eoy",
      label: "PROJECTED EOY REVENUE",
      icon: Sparkles,
      iconTone: "success" as const,
      value: kpis.projectedEOYRevenue,
      isCurrency: true,
      delta: `+${data.forecast.cagr}% CAGR`,
      caption: "Extrapolated Year-End",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <KpiCard {...item} />
          {item.id === "annual-budget-cap" && onEditCap && (
            <button
              type="button"
              onClick={onEditCap}
              className="absolute top-3.5 right-12 text-[11px] font-semibold text-[#0866F5] hover:text-[#0556D1] hover:underline cursor-pointer opacity-90 transition-opacity"
              aria-label="Edit annual budget cap"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
