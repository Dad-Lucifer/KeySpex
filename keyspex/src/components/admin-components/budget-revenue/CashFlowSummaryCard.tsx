import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { Money } from "../Money"
import { DateTile } from "../DateTile"
import { StatusBadge } from "../StatusBadge"
import type { BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type CashFlowSummaryCardProps = {
  data: BudgetRevenueData["cashFlow"]
  className?: string
}

export function CashFlowSummaryCard({
  data,
  className,
}: CashFlowSummaryCardProps) {
  const {
    monthlyInflow,
    monthlyOutflow,
    netCashDelta,
    burnRate,
    runwayMonths,
    obligations,
    payrollSharePct,
    infraSharePct,
    operationsSharePct,
  } = data

  const maxFlow = Math.max(monthlyInflow, monthlyOutflow, 100000)
  const inflowWidth = Math.round((monthlyInflow / maxFlow) * 100)
  const outflowWidth = Math.round((monthlyOutflow / maxFlow) * 100)

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Cash Flow & Working Capital"
        subtitle="Monthly cash velocity, net burn rate, and committed liquidity outflows"
      />

      {/* Inflow vs Outflow Visual Bars */}
      <div className="space-y-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
        {/* Inflow */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#15803D]">
              <ArrowDownRight className="h-4 w-4" />
              <span>MONTHLY CASH INFLOW</span>
            </div>
            <span className="font-bold text-[#090B10]">
              <Money value={monthlyInflow} />
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${inflowWidth}%` }}
            />
          </div>
        </div>

        {/* Outflow */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#B91C1C]">
              <ArrowUpRight className="h-4 w-4" />
              <span>MONTHLY OPERATING OUTFLOW</span>
            </div>
            <span className="font-bold text-[#090B10]">
              <Money value={monthlyOutflow} />
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F43F5E] transition-all duration-500"
              style={{ width: `${outflowWidth}%` }}
            />
          </div>
        </div>

        {/* Net Cash Position Strip */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
          <span className="font-semibold text-[#64748B]">NET MONTHLY DELTA</span>
          <span
            className={`font-bold tabular-nums text-[13px] ${
              netCashDelta >= 0 ? "text-[#15803D]" : "text-[#B91C1C]"
            }`}
          >
            {netCashDelta >= 0 ? "+" : ""}
            <Money value={netCashDelta} />
          </span>
        </div>
      </div>

      {/* Runway & Burn Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex flex-col rounded-lg border border-[#E2E8F0] p-3 bg-white">
          <span className="text-[11px] font-semibold text-[#64748B]">
            CURRENT RUNWAY
          </span>
          <span className="text-[18px] font-bold text-[#090B10] mt-0.5">
            {runwayMonths} Months
          </span>
          <span className="text-[10px] text-[#15803D] font-medium mt-0.5">
            Surplus buffer active
          </span>
        </div>

        <div className="flex flex-col rounded-lg border border-[#E2E8F0] p-3 bg-white">
          <span className="text-[11px] font-semibold text-[#64748B]">
            MONTHLY BURN RATE
          </span>
          <span className="text-[18px] font-bold text-[#0866F5] mt-0.5">
            <Money value={burnRate} />
          </span>
          <span className="text-[10px] text-[#64748B] mt-0.5">
            Payroll + Infra + Ops
          </span>
        </div>
      </div>

      {/* Upcoming Obligations List */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
            UPCOMING FISCAL OBLIGATIONS
          </span>
          <span className="text-[11px] text-[#0866F5] font-semibold">
            {obligations.length} Scheduled
          </span>
        </div>

        <div className="space-y-2.5">
          {obligations.map((ob) => (
            <div
              key={ob.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#F1F5F9] bg-white p-2.5 transition-colors hover:border-[#DCE4F0]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <DateTile month={ob.month} day={ob.day} />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#090B10] truncate">
                    {ob.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    {ob.clientName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[13px] font-bold text-[#090B10]">
                  <Money value={ob.amount} />
                </span>
                <StatusBadge
                  tone={
                    ob.status === "due_soon"
                      ? "warning"
                      : ob.status === "scheduled"
                      ? "info"
                      : "neutral"
                  }
                  size="sm"
                >
                  {ob.dueLabel}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full text-[11px] text-[#64748B]">
          <span>Payroll: {payrollSharePct}%</span>
          <span>•</span>
          <span>Infra: {infraSharePct}%</span>
          <span>•</span>
          <span>Ops: {operationsSharePct}%</span>
        </div>
      </CardFooter>
    </AdminCard>
  )
}
