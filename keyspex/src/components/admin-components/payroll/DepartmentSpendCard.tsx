import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { Money } from "../Money"
import type { DepartmentSpendItem } from "@/lib/admin/payrollService"

export type DepartmentSpendCardProps = {
  departments: DepartmentSpendItem[]
  className?: string
}

export function DepartmentSpendCard({
  departments,
  className,
}: DepartmentSpendCardProps) {
  const totalSpend = departments.reduce((sum, d) => sum + d.spend, 0)

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Department Spend & Headcount Allocation"
        subtitle="Operational cost distribution across engineering, product, and leadership pods"
        actions={
          <span className="text-[12px] font-semibold text-[#0866F5]">
            Total: <Money value={totalSpend} />
          </span>
        }
      />

      {/* Stacked Proportional Bar (Pure SVG) */}
      <div className="space-y-1.5 mt-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
          <span>FUNCTIONAL DISTRIBUTION</span>
          <span>100% ALLOCATED</span>
        </div>

        <div
          role="img"
          aria-label="Department expenditure distribution bar"
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]"
        >
          {departments.map((dept) => (
            <div
              key={dept.department}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${dept.sharePct}%`,
                backgroundColor: dept.color,
              }}
              title={`${dept.department}: ${dept.sharePct}% (₹${dept.spend.toLocaleString("en-IN")})`}
            />
          ))}
        </div>
      </div>

      {/* Department Line Items */}
      <div className="mt-5 space-y-3">
        {departments.map((dept) => (
          <div
            key={dept.department}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#F1F5F9] bg-white p-3 transition-colors hover:border-[#E2E8F0]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="h-3 w-3 shrink-0 rounded-[3px]"
                style={{ backgroundColor: dept.color }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#090B10] truncate">
                  {dept.department}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {dept.headcount} Team Members • Avg ₹{dept.avgCostPerHead.toLocaleString("en-IN")}/head
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[14px] font-bold text-[#090B10] tabular-nums">
                <Money value={dept.spend} />
              </span>
              <span className="text-[11px] font-semibold text-[#64748B]">
                {dept.sharePct}% of total
              </span>
            </div>
          </div>
        ))}
      </div>

      <CardFooter className="pt-3">
        <p className="text-[12px] text-[#64748B]">
          Engineering and Cloud Infrastructure account for {departments.slice(0, 2).reduce((s, d) => s + d.sharePct, 0).toFixed(1)}% of total startup human capital investment.
        </p>
      </CardFooter>
    </AdminCard>
  )
}
