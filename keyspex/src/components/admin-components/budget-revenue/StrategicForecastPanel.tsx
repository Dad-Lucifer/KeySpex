import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { Money } from "../Money"
import { StatusBadge } from "../StatusBadge"
import type { BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type StrategicForecastPanelProps = {
  data: BudgetRevenueData["forecast"]
  className?: string
}

export function StrategicForecastPanel({
  data,
  className,
}: StrategicForecastPanelProps) {
  const {
    cagr,
    growthTrajectoryText,
    healthScore,
    healthReason,
    projections,
    strategicRecommendations,
  } = data

  const getHealthTone = (score: string) => {
    switch (score) {
      case "excellent":
        return "success"
      case "good":
        return "info"
      case "caution":
        return "warning"
      case "critical":
        return "danger"
      default:
        return "neutral"
    }
  }

  const getHealthLabel = (score: string) => {
    switch (score) {
      case "excellent":
        return "Financial Health: Excellent"
      case "good":
        return "Financial Health: Stable"
      case "caution":
        return "Financial Health: Caution"
      case "critical":
        return "Financial Health: At Risk"
      default:
        return "Financial Health"
    }
  }

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Strategic Forecast & Planning Matrix"
        subtitle="Automated CAGR extrapolation, forward revenue modeling, and quantitative recommendations"
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D3E4FD] bg-[#E8F1FE] px-2.5 py-1 text-[11px] font-bold text-[#0556D1]">
              <TrendingUp className="h-3 w-3" />
              <span>+{cagr}% CAGR</span>
            </span>
          </div>
        }
      />

      {/* Health Score Summary Banner */}
      <div className="flex items-start gap-3.5 rounded-xl border border-[#DCE4F0] bg-[#F8FAFC] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FE] text-[#0866F5]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge tone={getHealthTone(healthScore)} size="sm">
              {getHealthLabel(healthScore)}
            </StatusBadge>
            <span className="text-[12px] font-semibold text-[#64748B]">
              Active Model v2.4
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[#334155] leading-relaxed">
            {healthReason}
          </p>
        </div>
      </div>

      {/* 2x2 Projection Matrix */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            NOV '26 RUN-RATE
          </span>
          <span className="text-[16px] font-bold text-[#090B10] mt-0.5">
            <Money value={projections.nextMonth} />
          </span>
          <span className="text-[10px] text-[#15803D] font-semibold mt-0.5">
            +5.2% vs October
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Q4 REVENUE TARGET
          </span>
          <span className="text-[16px] font-bold text-[#0866F5] mt-0.5">
            <Money value={projections.q4Estimate} />
          </span>
          <span className="text-[10px] text-[#64748B] mt-0.5">
            Nov + Dec Close
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            PROJECTED EOY
          </span>
          <span className="text-[16px] font-bold text-[#15803D] mt-0.5">
            <Money value={projections.projectedEOY} />
          </span>
          <span className="text-[10px] text-[#15803D] font-semibold mt-0.5">
            On track to breach ₹18L
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            LIQUIDITY BUFFER
          </span>
          <span className="text-[16px] font-bold text-[#7C3AED] mt-0.5">
            <Money value={projections.breakevenBuffer} />
          </span>
          <span className="text-[10px] text-[#64748B] mt-0.5">
            Uncommitted safety
          </span>
        </div>
      </div>

      {/* Strategic AI Recommendations */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#0866F5]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
            STRATEGIC RECOMMENDATIONS & ADVISORY
          </span>
        </div>

        <div className="space-y-2.5">
          {strategicRecommendations.map((rec) => {
            const isHigh = rec.impact === "high"

            return (
              <div
                key={rec.id}
                className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3 transition-colors hover:border-[#CBD5E1]"
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isHigh
                      ? "bg-[#FEE2E2] text-[#B91C1C]"
                      : "bg-[#FEF3C7] text-[#B45309]"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-bold text-[#090B10]">
                      {rec.title}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        isHigh
                          ? "bg-[#FEE2E2] text-[#B91C1C]"
                          : "bg-[#FEF3C7] text-[#B45309]"
                      }`}
                    >
                      {rec.impact} Priority
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#475569] leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <CardFooter className="pt-3">
        <p className="text-[12px] text-[#64748B]">
          {growthTrajectoryText}
        </p>
      </CardFooter>
    </AdminCard>
  )
}
