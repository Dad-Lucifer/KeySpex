import { AdminCard } from "./AdminCard"
import { CardHeader } from "./CardHeader"
import { StatusBadge } from "./StatusBadge"
import { MonoCode } from "./MonoCode"
import { Money } from "./Money"
import { ProgressBar } from "./ProgressBar"
import { rankedProjectsData } from "@/data/admin/dashboardData"
import type { ProjectRankItem } from "@/types/admin"

export type RevenueByProjectCardProps = {
  className?: string
  items?: ProjectRankItem[]
  loading?: boolean
}

const RANK_TONES = ["primary", "mid", "slate", "soft"] as const

/**
 * RevenueByProjectCard — Ranked portfolio projects list per admin.md §10.7.
 * Renders live projects with actual billing realization and dynamically computed share percentages.
 */
export function RevenueByProjectCard({
  className,
  items,
  loading = false,
}: RevenueByProjectCardProps) {
  const activeItems = items || rankedProjectsData

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Revenue by Project"
        subtitle="Portfolio share and billing realization"
        actions={
          <StatusBadge tone="neutral" size="sm">
            Top {activeItems.length} Accounts
          </StatusBadge>
        }
      />

      {loading ? (
        <div className="flex h-44 w-full items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0866F5] border-t-transparent" />
            <span>Calculating project rankings…</span>
          </div>
        </div>
      ) : activeItems.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#64748B]">
          No active projects recorded yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4 py-1">
          {activeItems.map((project, idx) => {
            const tone = RANK_TONES[idx % RANK_TONES.length]

            return (
              <div key={project.code} className="flex flex-col gap-1.5">
                {/* Row Line 1: Rank, Name, Code, Money, Share */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[#E8F1FE] text-[12px] font-bold text-[#0556D1] select-none">
                      {project.rank}
                    </div>
                    <span className="text-[14px] sm:text-[15px] font-medium text-[#090B10] truncate">
                      {project.name}
                    </span>
                    <MonoCode variant="muted">{project.code}</MonoCode>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Money value={project.amount} className="text-[14px] sm:text-[15px] font-bold text-[#090B10]" />
                    <span className="font-mono text-[12px] text-[#64748B] w-12 text-right">
                      {project.sharePct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Row Line 2: Progress bar */}
                <ProgressBar
                  value={project.sharePct}
                  tone={tone}
                  height={8}
                  label={`${project.name} revenue share`}
                />
              </div>
            )
          })}
        </div>
      )}
    </AdminCard>
  )
}
