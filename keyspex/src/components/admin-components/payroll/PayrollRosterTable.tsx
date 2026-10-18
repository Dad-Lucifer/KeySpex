import { useState, useMemo } from "react"
import {
  Search,
  Edit2,
  Trash2,
  Building,
  UserCheck,
  Cloud,
} from "lucide-react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { MonoCode } from "../MonoCode"
import { Money } from "../Money"
import { StatusBadge } from "../StatusBadge"
import type { PayeeItem, SubscriptionItem } from "@/lib/admin/payrollService"

export type UnifiedRosterRow = {
  id: string
  code: string
  name: string
  roleOrService: string
  category: "employee" | "contractor" | "subscription"
  department: string
  assignedProject: string
  amount: number
  status: string
  email?: string
  contractTerms?: string
  rawItem: PayeeItem | SubscriptionItem
}

export type PayrollRosterTableProps = {
  payees: PayeeItem[]
  subscriptions: SubscriptionItem[]
  onEditPayee: (item: PayeeItem) => void
  onDeletePayee: (code: string, name: string) => void
  onAddPayee: () => void
  className?: string
}

type TabCategory = "all" | "employee" | "contractor" | "subscription"

export function PayrollRosterTable({
  payees,
  subscriptions,
  onEditPayee,
  onDeletePayee,
  onAddPayee,
  className,
}: PayrollRosterTableProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Combine payees and subscriptions into a unified viewable roster
  const unifiedRows: UnifiedRosterRow[] = useMemo(() => {
    const payeeRows: UnifiedRosterRow[] = payees.map((p) => ({
      id: p.code,
      code: p.code,
      name: p.name,
      roleOrService: p.role,
      category: p.type,
      department: p.department,
      assignedProject: p.assignedProject,
      amount: p.salary,
      status: p.status,
      email: p.email,
      contractTerms: p.contractTerms,
      rawItem: p,
    }))

    const subRows: UnifiedRosterRow[] = subscriptions.map((s) => ({
      id: s.id,
      code: s.clientCode || s.id,
      name: s.title,
      roleOrService: s.clientName,
      category: "subscription",
      department: "Cloud & Infrastructure",
      assignedProject: "Company-wide",
      amount: s.amount,
      status: s.status === "due_soon" ? "Due Soon" : s.status === "scheduled" ? "Scheduled" : "Active",
      contractTerms: "Monthly SaaS License",
      rawItem: s,
    }))

    return [...payeeRows, ...subRows]
  }, [payees, subscriptions])

  // Filter based on tab, search, and department
  const filteredRows = useMemo(() => {
    return unifiedRows.filter((row) => {
      const matchesTab =
        activeTab === "all" || row.category === activeTab

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.code.toLowerCase().includes(query) ||
        row.roleOrService.toLowerCase().includes(query) ||
        row.assignedProject.toLowerCase().includes(query) ||
        (row.email && row.email.toLowerCase().includes(query))

      const matchesDept =
        departmentFilter === "all" || row.department === departmentFilter

      return matchesTab && matchesSearch && matchesDept
    })
  }, [unifiedRows, activeTab, searchQuery, departmentFilter])

  // Aggregate counts
  const employeeCount = payees.filter((p) => p.type === "employee").length
  const contractorCount = payees.filter((p) => p.type === "contractor").length
  const subCount = subscriptions.length
  const totalSpend = filteredRows.reduce((sum, r) => sum + r.amount, 0)

  const getCategoryBadge = (cat: "employee" | "contractor" | "subscription") => {
    switch (cat) {
      case "employee":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F1FE] px-2 py-0.5 text-[10px] font-bold text-[#0866F5]">
            <UserCheck className="h-3 w-3" />
            <span>Core Staff</span>
          </span>
        )
      case "contractor":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#B45309]">
            <Building className="h-3 w-3" />
            <span>Contractor</span>
          </span>
        )
      case "subscription":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold text-[#6D28D9]">
            <Cloud className="h-3 w-3" />
            <span>SaaS Tool</span>
          </span>
        )
    }
  }

  const getStatusTone = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("active") || s.includes("paid") || s.includes("optimal")) return "success"
    if (s.includes("onboarding") || s.includes("scheduled")) return "info"
    if (s.includes("due") || s.includes("pending")) return "warning"
    return "neutral"
  }

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Payees, Contractors & Subscriptions Roster"
        subtitle="Unified compensation register spanning core staff, milestone contractors, and cloud tooling"
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by name, role, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 sm:w-56 rounded-lg border border-[#DCE4F0] bg-white pl-8 pr-3 text-[12px] text-[#090B10] placeholder-[#94A3B8] focus:border-[#0866F5] focus:outline-none focus:ring-1 focus:ring-[#0866F5]"
              />
            </div>

            {/* Department dropdown */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#DCE4F0] bg-white px-2.5 text-[12px] font-medium text-[#475569] focus:border-[#0866F5] focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Leadership & Architecture">Leadership & Architecture</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Operations">Operations</option>
              <option value="Cloud & Infrastructure">Cloud Infrastructure</option>
            </select>

            {/* Add Payee Button */}
            <button
              type="button"
              onClick={onAddPayee}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0866F5] px-3 text-[12px] font-semibold text-white hover:bg-[#0556D1] shadow-xs cursor-pointer transition-colors"
            >
              <span>+ Add Payee</span>
            </button>
          </div>
        }
      />

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] pb-2 -mt-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-[#E8F1FE] text-[#0866F5]"
              : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10]"
          }`}
        >
          All Payees & Costs ({unifiedRows.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("employee")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "employee"
              ? "bg-[#E8F1FE] text-[#0866F5]"
              : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10]"
          }`}
        >
          Employees ({employeeCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contractor")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "contractor"
              ? "bg-[#E8F1FE] text-[#0866F5]"
              : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10]"
          }`}
        >
          Contractors & Temp ({contractorCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscription")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "subscription"
              ? "bg-[#E8F1FE] text-[#0866F5]"
              : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10]"
          }`}
        >
          SaaS & Tool Subscriptions ({subCount})
        </button>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 mt-2">
        <table className="w-full text-left text-[13px] border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">PAYEE / SERVICE</th>
              <th className="py-3 px-3">TYPE</th>
              <th className="py-3 px-3">DEPARTMENT</th>
              <th className="py-3 px-3">ASSIGNED PROJECT</th>
              <th className="py-3 px-3 text-right">COMPENSATION</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredRows.map((row, idx) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-[#F8FAFC] group"
              >
                <td className="py-3 px-3 text-[#64748B] font-semibold tabular-nums">
                  {idx + 1}
                </td>

                <td className="py-3 px-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#090B10] group-hover:text-[#0866F5] transition-colors">
                        {row.name}
                      </span>
                      <MonoCode>{row.code}</MonoCode>
                    </div>
                    <span className="text-[12px] text-[#64748B] mt-0.5">
                      {row.roleOrService}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3">
                  {getCategoryBadge(row.category)}
                </td>

                <td className="py-3 px-3 text-[#475569] font-medium text-[12px]">
                  {row.department}
                </td>

                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#0556D1] bg-[#F1F5FB] px-2 py-0.5 rounded-md">
                    {row.assignedProject}
                  </span>
                </td>

                <td className="py-3 px-3 text-right font-bold text-[#090B10] tabular-nums">
                  <div className="flex flex-col items-end">
                    <span>
                      <Money value={row.amount} />
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium">
                      {row.category === "contractor" ? "Milestone" : "/month"}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3 text-center">
                  <StatusBadge tone={getStatusTone(row.status)} size="sm">
                    {row.status}
                  </StatusBadge>
                </td>

                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {row.category !== "subscription" && (
                      <button
                        type="button"
                        onClick={() => onEditPayee(row.rawItem as PayeeItem)}
                        className="rounded p-1 text-[#64748B] hover:bg-[#E8F1FE] hover:text-[#0866F5] transition-colors cursor-pointer"
                        title="Edit Salary / Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {row.category !== "subscription" && (
                      <button
                        type="button"
                        onClick={() => onDeletePayee(row.code, row.name)}
                        className="rounded p-1 text-[#64748B] hover:bg-[#FEE2E2] hover:text-[#B91C1C] transition-colors cursor-pointer"
                        title="Archive / Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#64748B]">
                  No matching payees or subscriptions found.
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Summary Footer */}
          <tfoot>
            <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] font-bold text-[#090B10]">
              <td colSpan={5} className="py-3 px-3 uppercase text-[11px] tracking-wider text-[#64748B]">
                TOTAL MONTHLY COMMITMENT ({filteredRows.length} RECORDS)
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-[#0866F5]">
                <Money value={totalSpend} />
              </td>
              <td colSpan={2} className="py-3 px-3 text-right text-[11px] text-[#64748B]">
                Live Firestore Aggregates
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full text-xs text-[#64748B] flex-wrap gap-2">
          <span>Showing {filteredRows.length} payees and tool subscriptions</span>
          <span>Click Edit to change compensation with live Firestore reflection</span>
        </div>
      </CardFooter>
    </AdminCard>
  )
}
