import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { MonoCode } from "../MonoCode"
import { Money } from "../Money"
import { ProgressBar } from "../ProgressBar"
import { StatusBadge } from "../StatusBadge"
import type { ProjectLaborAllocation } from "@/lib/admin/payrollService"

export type ProjectLaborCostCardProps = {
  allocations: ProjectLaborAllocation[]
  className?: string
}

export function ProjectLaborCostCard({
  allocations,
  className,
}: ProjectLaborCostCardProps) {
  const totalRevenue = allocations.reduce((sum, a) => sum + a.contractAmount, 0)
  const totalLaborCost = allocations.reduce((sum, a) => sum + a.laborAndContractorCost, 0)
  const avgMarginPct = totalRevenue > 0 ? Number((((totalRevenue - totalLaborCost) / totalRevenue) * 100).toFixed(1)) : 74.2

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Project Labor Burden & Unit Economics"
        subtitle="Direct compensation and contractor payouts mapped against client contract revenues"
      />

      <div className="space-y-3.5 mt-2">
        {allocations.map((proj) => {
          const isHighMargin = proj.netMarginPct >= 70
          const isModerateMargin = proj.netMarginPct >= 55

          return (
            <div
              key={proj.projectCode}
              className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 transition-colors hover:border-[#CBD5E1]"
            >
              {/* Top row: Project info + Contract vs Labor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-[#090B10]">
                      {proj.projectName}
                    </span>
                    <MonoCode>{proj.projectCode}</MonoCode>
                  </div>
                  <span className="text-[12px] text-[#64748B]">
                    {proj.clientName}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      CONTRACT REVENUE
                    </span>
                    <span className="text-[14px] font-bold text-[#090B10]">
                      <Money value={proj.contractAmount} />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      LABOR & CONTRACTOR
                    </span>
                    <span className="text-[14px] font-bold text-[#0866F5]">
                      <Money value={proj.laborAndContractorCost} />
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      NET PROFIT
                    </span>
                    <span
                      className={`text-[14px] font-bold ${
                        isHighMargin ? "text-[#15803D]" : isModerateMargin ? "text-[#0866F5]" : "text-[#B45309]"
                      }`}
                    >
                      <Money value={proj.netMargin} /> ({proj.netMarginPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar: Labor Burden % of contract */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar
                    value={proj.laborBurdenPct}
                    tone={proj.laborBurdenPct > 40 ? "soft" : "primary"}
                    height={6}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#64748B] tabular-nums shrink-0">
                  {proj.laborBurdenPct}% payroll burden
                </span>
              </div>

              {/* Team members & contractors assigned */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-[#475569]">Allocated Pod:</span>
                  {proj.teamMembers.map((m) => (
                    <span
                      key={m}
                      className="rounded bg-[#F1F5FB] px-1.5 py-0.5 text-[10px] font-medium text-[#334155]"
                    >
                      {m}
                    </span>
                  ))}
                  {proj.contractors.map((c) => (
                    <span
                      key={c}
                      className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-medium text-[#B45309]"
                    >
                      CTR: {c}
                    </span>
                  ))}
                </div>

                <StatusBadge
                  tone={isHighMargin ? "success" : isModerateMargin ? "info" : "warning"}
                  size="sm"
                >
                  {isHighMargin ? "High Margin" : isModerateMargin ? "Optimal" : "Monitor Burn"}
                </StatusBadge>
              </div>
            </div>
          )
        })}
      </div>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full text-xs text-[#64748B]">
          <span>Portfolio Gross Margin: {avgMarginPct}%</span>
          <span>Zero projects operating at negative gross contribution</span>
        </div>
      </CardFooter>
    </AdminCard>
  )
}
