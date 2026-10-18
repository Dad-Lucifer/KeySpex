import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { AdminCard } from "./AdminCard"
import { SectionLabel } from "./SectionLabel"
import { AvatarInitials } from "./AvatarInitials"
import { MonoCode } from "./MonoCode"
import { StatusBadge } from "./StatusBadge"
import { activityRowsData } from "@/data/admin/dashboardData"
import type { Tone } from "@/types/admin"

export type RecentActivityCardProps = {
  className?: string
}

const STATUS_MAP: Record<string, { label: string; tone: Tone }> = {
  completed: { label: "Completed", tone: "success" },
  verified: { label: "Verified", tone: "info" },
  reconciled: { label: "Reconciled", tone: "success" },
  updated: { label: "Updated", tone: "neutral" },
  failed: { label: "Failed", tone: "danger" },
}

/**
 * RecentActivityCard — Live audit table per admin.md §10.9.
 */
export function RecentActivityCard({ className }: RecentActivityCardProps) {
  return (
    <AdminCard className={className}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#15803D]" aria-hidden="true" />
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#090B10]">
            Recent Activity
          </h2>
        </div>

        <Link
          to="/admin/activity"
          className="group inline-flex items-center gap-1 text-[13px] font-semibold text-[#0866F5] hover:underline"
        >
          <span>Full Audit Log</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Semantic Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-2.5 pr-4 font-normal">
                <SectionLabel>ACTOR</SectionLabel>
              </th>
              <th className="py-2.5 px-4 font-normal">
                <SectionLabel>ACTION &amp; TARGET</SectionLabel>
              </th>
              <th className="py-2.5 px-4 font-normal whitespace-nowrap">
                <SectionLabel>TIME</SectionLabel>
              </th>
              <th className="py-2.5 pl-4 text-right font-normal">
                <SectionLabel>STATUS</SectionLabel>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {activityRowsData.map((row) => {
              const statusCfg = STATUS_MAP[row.status] || { label: row.status, tone: "neutral" as Tone }

              return (
                <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                  {/* Actor Cell */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <AvatarInitials
                        name={row.actor.name}
                        size={32}
                        shape="circle"
                        variant={row.actor.kind === "bot" ? "bot" : "initials"}
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#090B10] leading-tight truncate">
                          {row.actor.name}
                        </p>
                        <p className="text-[12px] text-[#64748B] leading-tight truncate">
                          {row.actor.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Action & Target Cell */}
                  <td className="py-3.5 px-4">
                    <p className="text-[13px] text-[#090B10] font-medium leading-tight">
                      <span>{row.actionText} </span>
                      <MonoCode variant="link">{row.targetCode}</MonoCode>
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#64748B] leading-tight truncate">
                      {row.context}
                    </p>
                  </td>

                  {/* Time Cell */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[13px] text-[#64748B] tabular-nums">
                    {row.timeAgo}
                  </td>

                  {/* Status Cell */}
                  <td className="py-3.5 pl-4 text-right">
                    <StatusBadge tone={statusCfg.tone} dot size="sm">
                      {statusCfg.label}
                    </StatusBadge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AdminCard>
  )
}
