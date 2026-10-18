import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { RadialGauge } from "../RadialGauge"
import { Money } from "../Money"
import { ProgressBar } from "../ProgressBar"
import { StatusBadge } from "../StatusBadge"
import { formatINRCompact } from "@/lib/admin/format"
import type { BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type SpendBreakdownPanelProps = {
  data: BudgetRevenueData["spendBreakdown"]
  onEditCap?: () => void
  className?: string
}

export function SpendBreakdownPanel({
  data,
  onEditCap,
  className,
}: SpendBreakdownPanelProps) {
  const { cap, committed, remaining, utilizationPercent, categories } = data

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Spend Breakdown & Allocation"
        subtitle="Operational cost centers measured against the annual expenditure cap"
        actions={
          onEditCap && (
            <button
              type="button"
              onClick={onEditCap}
              className="text-[12px] font-semibold text-[#0866F5] hover:text-[#0556D1] hover:underline cursor-pointer"
            >
              Modify Cap
            </button>
          )
        }
      />

      {/* Top Gauge + Metrics Row */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
        <RadialGauge
          value={utilizationPercent}
          size={110}
          strokeWidth={10}
          label="COMMITTED"
        />

        <div className="flex-1 w-full grid grid-cols-3 gap-3 text-center sm:text-left">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              ANNUAL CAP
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#090B10] mt-0.5">
              <Money value={cap} />
            </span>
            <span className="text-[11px] text-[#64748B]">FY 26-27</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              COMMITTED
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#0866F5] mt-0.5">
              <Money value={committed} />
            </span>
            <span className="text-[11px] text-[#64748B]">{utilizationPercent}% of cap</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              BUFFER
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#15803D] mt-0.5">
              <Money value={remaining} />
            </span>
            <span className="text-[11px] text-[#15803D] font-medium">Liquid reserve</span>
          </div>
        </div>
      </div>

      {/* Stacked Proportional Bar (Pure SVG) */}
      <div className="mt-5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
          <span>CAPITAL DISTRIBUTION</span>
          <span>100% ALLOCATED</span>
        </div>

        <div
          role="img"
          aria-label="Proportional budget distribution bar"
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${cat.sharePct}%`,
                backgroundColor: cat.color,
              }}
              title={`${cat.label}: ${cat.sharePct}% (₹${formatINRCompact(cat.amount, 1)})`}
            />
          ))}
        </div>
      </div>

      {/* Department Line Items */}
      <div className="mt-5 space-y-3.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col gap-1.5 rounded-lg border border-[#F1F5F9] bg-white p-2.5 transition-colors hover:border-[#E2E8F0]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                <span className="text-[13px] font-semibold text-[#090B10] truncate">
                  {cat.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px] font-bold text-[#090B10]">
                  <Money value={cat.amount} />
                </span>
                <span className="text-[11px] font-semibold text-[#64748B] w-12 text-right">
                  {cat.sharePct}%
                </span>
                <StatusBadge
                  tone={
                    cat.status === "optimal"
                      ? "success"
                      : cat.status === "near_limit"
                      ? "warning"
                      : "danger"
                  }
                  size="sm"
                >
                  {cat.status === "optimal"
                    ? "In Budget"
                    : cat.status === "near_limit"
                    ? "Near Limit"
                    : "Exceeded"}
                </StatusBadge>
              </div>
            </div>

            {/* Department mini progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  value={Math.min(100, cat.utilizationPct)}
                  tone={
                    cat.status === "optimal"
                      ? "primary"
                      : cat.status === "near_limit"
                      ? "mid"
                      : "slate"
                  }
                  height={5}
                />
              </div>
              <span className="text-[10px] text-[#64748B] tabular-nums shrink-0">
                {cat.utilizationPct}% cap
              </span>
            </div>
          </div>
        ))}
      </div>

      <CardFooter className="pt-3">
        <p className="text-[12px] text-[#64748B]">
          Zero unhedged deficit detected. Contingency liquidity buffer is sufficient for next 60+ operational days.
        </p>
      </CardFooter>
    </AdminCard>
  )
}
