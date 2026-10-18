import { useEffect, useState } from "react"
import {
  Banknote,
  Download,
  AlertCircle,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { AdminShell } from "@/components/admin-components"
import {
  PayrollTopKpiRow,
  PayrollRosterTable,
  ProjectLaborCostCard,
  DepartmentSpendCard,
  DisbursementTimelineCard,
  AddPayeeModal,
  EditPayeeModal,
} from "@/components/admin-components"
import { usePayrollData } from "@/hooks/usePayrollData"
import type { PayeeItem } from "@/lib/admin/payrollService"

/**
 * PayrollPage — Master Total Project, Salaries & Subscriptions Tracking System.
 * Fully wired to live Google Firestore with two-way real-time recalculations
 * that directly reflect across the Admin Dashboard and Budgets & Revenue pages.
 */
export function PayrollPage() {
  const {
    data,
    error,
    isLive,
    addPayee,
    updateCompensation,
    deletePayee,
    addSubscription,
    updateSubscriptionStatus,
    processPayrollRun,
  } = usePayrollData()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPayee, setEditingPayee] = useState<PayeeItem | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    document.title = "Payroll & Salaries — KeySpex Admin"
  }, [])

  const handleProcessPayroll = async () => {
    try {
      await processPayrollRun()
      setSuccessToast(
        `Automated Payroll Run Reconciled! Disbursed ₹${(data.kpis.corePayroll / 100000).toFixed(2)}L across ${data.kpis.totalStaffCount} staff members.`
      )
      setTimeout(() => setSuccessToast(null), 5000)
    } catch (err: any) {
      alert("Failed to process payroll run: " + err.message)
    }
  }

  const handleAuthorizePayment = async (id: string, title: string) => {
    try {
      await updateSubscriptionStatus(id, "scheduled", "Authorized & Disbursed")
      setSuccessToast(`Disbursement authorized for ${title}!`)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert("Failed to authorize payment: " + err.message)
    }
  }

  const handleExportData = () => {
    const report = {
      title: "KeySpex Total Project & Salaries Register",
      generatedAt: new Date().toISOString(),
      fiscalMonth: "October 2026",
      kpis: data.kpis,
      payees: data.payees,
      subscriptions: data.subscriptions,
      projectLaborAllocations: data.projectAllocations,
      departmentBreakdown: data.departmentBreakdown,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keyspex-payroll-register-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell isLive={isLive} lastSynced={data?.lastSynced}>
      {/* Real-time sync error banner if offline */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3.5 text-[13px] text-[#B91C1C] shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {successToast && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3.5 text-[13px] text-[#15803D] shadow-xs animate-in fade-in-50">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs text-[#15803D] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#090B10] tracking-tight">
              Payroll, Subscriptions & Disbursements
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F1FE] px-2.5 py-0.5 text-[11px] font-bold text-[#0866F5]">
              <Sparkles className="h-3 w-3" />
              <span>Two-Way Live Sync</span>
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-[#64748B]">
            Manage startup human capital compensation, contractor milestone payouts, and SaaS subscriptions with instant Dashboard revenue reflection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleProcessPayroll}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE4F0] bg-white px-3 text-[12px] font-semibold text-[#090B10] hover:bg-[#F8FAFC] shadow-xs transition-colors cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 text-[#15803D]" />
            <span>Process Payroll Run</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0866F5] px-3.5 text-[12px] font-semibold text-white hover:bg-[#0556D1] shadow-xs transition-colors cursor-pointer"
          >
            <Banknote className="h-4 w-4" />
            <span>+ Add Payee / Tool</span>
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE4F0] bg-white px-3 text-[12px] font-semibold text-[#64748B] hover:text-[#090B10] hover:bg-[#F8FAFC] shadow-xs transition-colors cursor-pointer"
            title="Export full payroll register"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Section 1: Top Strategic KPI Strip (6 Cards) */}
      <PayrollTopKpiRow
        data={data}
        onAddPayee={() => setIsAddModalOpen(true)}
      />

      {/* Section 2: Universal Interactive Roster Table (Full Width) */}
      <PayrollRosterTable
        payees={data.payees}
        subscriptions={data.subscriptions}
        onEditPayee={(item) => setEditingPayee(item)}
        onDeletePayee={deletePayee}
        onAddPayee={() => setIsAddModalOpen(true)}
      />

      {/* Section 3: Project Labor Matrix (Col 7) + Department Breakdown (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ProjectLaborCostCard allocations={data.projectAllocations} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <DepartmentSpendCard departments={data.departmentBreakdown} />
        </div>
      </div>

      {/* Section 4: Upcoming Banking Settlements & Compliance Calendar */}
      <DisbursementTimelineCard
        items={data.upcomingTimeline}
        onAuthorizePayment={handleAuthorizePayment}
      />

      {/* Add Payee / Contractor / Subscription Modal */}
      <AddPayeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPayee={addPayee}
        onAddSubscription={addSubscription}
      />

      {/* Edit Payee Compensation Modal */}
      <EditPayeeModal
        isOpen={!!editingPayee}
        onClose={() => setEditingPayee(null)}
        payee={editingPayee}
        onSave={updateCompensation}
      />
    </AdminShell>
  )
}

export default PayrollPage
