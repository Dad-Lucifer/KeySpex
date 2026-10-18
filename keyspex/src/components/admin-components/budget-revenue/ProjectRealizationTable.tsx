import { useState, useMemo } from "react"
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { MonoCode } from "../MonoCode"
import { Money } from "../Money"
import { ProgressBar } from "../ProgressBar"
import { StatusBadge } from "../StatusBadge"
import type { RealizationProjectItem, BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type ProjectRealizationTableProps = {
  projects: RealizationProjectItem[]
  summary: BudgetRevenueData["projectRealizationSummary"]
  className?: string
}

type SortField = "rank" | "contractAmount" | "collectedAmount" | "realizationRate" | "estimatedMargin"
type SortOrder = "asc" | "desc"

export function ProjectRealizationTable({
  projects,
  summary,
  className,
}: ProjectRealizationTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const filteredAndSorted = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
          statusFilter === "all" || p.status === statusFilter
        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        let diff = 0
        if (sortField === "rank") diff = a.rank - b.rank
        else if (sortField === "contractAmount") diff = a.contractAmount - b.contractAmount
        else if (sortField === "collectedAmount") diff = a.collectedAmount - b.collectedAmount
        else if (sortField === "realizationRate") diff = a.realizationRate - b.realizationRate
        else if (sortField === "estimatedMargin") diff = a.estimatedMargin - b.estimatedMargin

        return sortOrder === "asc" ? diff : -diff
      })
  }, [projects, searchQuery, statusFilter, sortField, sortOrder])

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-[#94A3B8] opacity-60" />
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#0866F5]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#0866F5]" />
    )
  }

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Project Contract Realization & Margins"
        subtitle="Individual contract tracking, cash realization rates, and calculated gross profitability"
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 sm:w-56 rounded-lg border border-[#DCE4F0] bg-white pl-8 pr-3 text-[12px] text-[#090B10] placeholder-[#94A3B8] focus:border-[#0866F5] focus:outline-none focus:ring-1 focus:ring-[#0866F5]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#DCE4F0] bg-white px-2.5 text-[12px] font-medium text-[#475569] focus:border-[#0866F5] focus:outline-none"
            >
              <option value="all">All Statuses ({projects.length})</option>
              <option value="on_track">On Track</option>
              <option value="near">Near Delivery</option>
              <option value="alert">At Risk</option>
            </select>
          </div>
        }
      />

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <table className="w-full text-left text-[13px] border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <th
                onClick={() => handleSort("rank")}
                className="py-3 px-3 cursor-pointer hover:text-[#090B10] select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>#</span>
                  {renderSortIcon("rank")}
                </div>
              </th>

              <th className="py-3 px-3 font-bold">PROJECT & CLIENT</th>

              <th
                onClick={() => handleSort("contractAmount")}
                className="py-3 px-3 cursor-pointer hover:text-[#090B10] select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>CONTRACT</span>
                  {renderSortIcon("contractAmount")}
                </div>
              </th>

              <th
                onClick={() => handleSort("collectedAmount")}
                className="py-3 px-3 cursor-pointer hover:text-[#090B10] select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>COLLECTED</span>
                  {renderSortIcon("collectedAmount")}
                </div>
              </th>

              <th
                onClick={() => handleSort("realizationRate")}
                className="py-3 px-3 cursor-pointer hover:text-[#090B10] select-none w-44"
              >
                <div className="flex items-center gap-1.5">
                  <span>REALIZATION</span>
                  {renderSortIcon("realizationRate")}
                </div>
              </th>

              <th
                onClick={() => handleSort("estimatedMargin")}
                className="py-3 px-3 cursor-pointer hover:text-[#090B10] select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>MARGIN</span>
                  {renderSortIcon("estimatedMargin")}
                </div>
              </th>

              <th className="py-3 px-3 text-center">STATUS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredAndSorted.map((p) => {
              const isAlert = p.status === "alert"
              const isNear = p.status === "near"

              return (
                <tr
                  key={p.code}
                  className="transition-colors hover:bg-[#F8FAFC] group"
                >
                  <td className="py-3.5 px-3 text-[#64748B] font-semibold tabular-nums">
                    {p.rank}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#090B10] group-hover:text-[#0866F5] transition-colors">
                          {p.name}
                        </span>
                        <MonoCode>{p.code}</MonoCode>
                      </div>
                      <span className="text-[12px] text-[#64748B] mt-0.5">
                        {p.clientName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-[#090B10] tabular-nums">
                    <Money value={p.contractAmount} />
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-[#0866F5] tabular-nums">
                    <Money value={p.collectedAmount} />
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold tabular-nums">
                        <span className="text-[#090B10]">{p.realizationRate}%</span>
                        <span className="text-[#64748B]">
                          ₹{((p.contractAmount - p.collectedAmount) / 1000).toFixed(0)}k left
                        </span>
                      </div>
                      <ProgressBar
                        value={p.realizationRate}
                        tone={isAlert ? "soft" : isNear ? "mid" : "primary"}
                        height={6}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold tabular-nums">
                    <span
                      className={
                        p.estimatedMargin >= 70
                          ? "text-[#15803D]"
                          : p.estimatedMargin >= 60
                          ? "text-[#0866F5]"
                          : "text-[#B45309]"
                      }
                    >
                      {p.estimatedMargin}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <StatusBadge
                      tone={
                        p.status === "on_track"
                          ? "success"
                          : p.status === "near"
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                    >
                      {p.status === "on_track"
                        ? "On Track"
                        : p.status === "near"
                        ? "Near Term"
                        : "At Risk"}
                    </StatusBadge>
                  </td>
                </tr>
              )
            })}

            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#64748B]">
                  No matching projects found for "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Totals Footer */}
          <tfoot>
            <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] font-bold text-[#090B10]">
              <td colSpan={2} className="py-3 px-3 uppercase text-[11px] tracking-wider text-[#64748B]">
                TOTALS ({projects.length} PROJECTS)
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-[#090B10]">
                <Money value={summary.totalContracted} />
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-[#0866F5]">
                <Money value={summary.totalCollected} />
              </td>
              <td className="py-3 px-3 text-[12px] text-[#64748B] tabular-nums">
                Avg: {summary.avgRealizationRate}%
              </td>
              <td className="py-3 px-3 text-right text-[12px] text-[#15803D] tabular-nums">
                Avg: {summary.avgMarginRate}%
              </td>
              <td className="py-3 px-3 text-center text-[11px] text-[#64748B]">
                100% Active
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between gap-4 w-full text-xs text-[#64748B] flex-wrap">
          <span>Showing {filteredAndSorted.length} of {projects.length} contracts</span>
          <span>Click any column header to sort</span>
        </div>
      </CardFooter>
    </AdminCard>
  )
}
