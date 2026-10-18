import { useState } from "react"
import { X, UserPlus, Building, Cloud, Check } from "lucide-react"
import type { PayeeItem, SubscriptionItem } from "@/lib/admin/payrollService"

export type AddPayeeModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddPayee: (payee: Omit<PayeeItem, "id">) => Promise<void>
  onAddSubscription: (sub: Omit<SubscriptionItem, "id">) => Promise<void>
}

type FormCategory = "employee" | "contractor" | "subscription"

export function AddPayeeModal({
  isOpen,
  onClose,
  onAddPayee,
  onAddSubscription,
}: AddPayeeModalProps) {
  const [activeTab, setActiveTab] = useState<FormCategory>("employee")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Employee fields
  const [empName, setEmpName] = useState("")
  const [empRole, setEmpRole] = useState("")
  const [empDepartment, setEmpDepartment] = useState("Engineering")
  const [empSalary, setEmpSalary] = useState("25000")
  const [empProject, setEmpProject] = useState("PRJ-3001")
  const [empStatus, setEmpStatus] = useState<"Active" | "Onboarding" | "On Leave">("Active")

  // Contractor fields
  const [ctrName, setCtrName] = useState("")
  const [ctrRole, setCtrRole] = useState("")
  const [ctrDepartment, setCtrDepartment] = useState("Engineering")
  const [ctrAmount, setCtrAmount] = useState("35000")
  const [ctrProject, setCtrProject] = useState("PRJ-3001")
  const [ctrTerms, setCtrTerms] = useState("Sprint Deliverable")

  // Subscription fields
  const [subTitle, setSubTitle] = useState("")
  const [subVendor, setSubVendor] = useState("")
  const [subAmount, setSubAmount] = useState("20000")
  const [subDueDate, setSubDueDate] = useState("2026-11-15")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (activeTab === "employee") {
        if (!empName.trim() || !empRole.trim()) {
          throw new Error("Please enter employee name and role.")
        }
        const numericSalary = Number(empSalary.replace(/[^0-9]/g, ""))
        if (isNaN(numericSalary) || numericSalary <= 0) {
          throw new Error("Please enter a valid positive salary.")
        }

        const code = `EMP-${Math.floor(1020 + Math.random() * 900)}`
        await onAddPayee({
          code,
          name: empName.trim(),
          role: empRole.trim(),
          department: empDepartment,
          status: empStatus,
          salary: numericSalary,
          type: "employee",
          assignedProject: empProject,
          email: `${empName.toLowerCase().replace(/\s+/g, ".")}@keyspex.com`,
        })
      } else if (activeTab === "contractor") {
        if (!ctrName.trim() || !ctrRole.trim()) {
          throw new Error("Please enter contractor name and scope.")
        }
        const numericAmount = Number(ctrAmount.replace(/[^0-9]/g, ""))
        if (isNaN(numericAmount) || numericAmount <= 0) {
          throw new Error("Please enter a valid milestone payout amount.")
        }

        const code = `CTR-${Math.floor(5005 + Math.random() * 900)}`
        await onAddPayee({
          code,
          name: ctrName.trim(),
          role: ctrRole.trim(),
          department: ctrDepartment,
          status: "Active",
          salary: numericAmount,
          type: "contractor",
          assignedProject: ctrProject,
          contractTerms: ctrTerms,
          email: `${ctrName.toLowerCase().replace(/\s+/g, ".")}@external.keyspex.com`,
        })
      } else {
        if (!subTitle.trim() || !subVendor.trim()) {
          throw new Error("Please enter tool name and vendor.")
        }
        const numericAmount = Number(subAmount.replace(/[^0-9]/g, ""))
        if (isNaN(numericAmount) || numericAmount <= 0) {
          throw new Error("Please enter a valid subscription cost.")
        }

        await onAddSubscription({
          title: subTitle.trim(),
          clientName: subVendor.trim(),
          clientCode: `CLI-SUB-${Math.floor(10 + Math.random() * 90)}`,
          amount: numericAmount,
          status: "scheduled",
          dueLabel: "Scheduled",
          dueDate: subDueDate,
          type: "subscription",
        })
      }

      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to add payee or subscription.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#DCE4F0] bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F1FE] text-[#0866F5]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#090B10]">
                Add Payee, Contractor or Tool
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Directly writes to Firestore and updates Dashboard totals
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 border-b border-[#E2E8F0] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("employee")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              activeTab === "employee"
                ? "bg-[#E8F1FE] text-[#0866F5]"
                : "text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Staff Employee</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contractor")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              activeTab === "contractor"
                ? "bg-[#FEF3C7] text-[#B45309]"
                : "text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Project Contractor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${
              activeTab === "subscription"
                ? "bg-[#EDE9FE] text-[#6D28D9]"
                : "text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>SaaS Tool</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {error && (
            <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-2.5 text-xs text-[#B91C1C]">
              {error}
            </div>
          )}

          {activeTab === "employee" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Department
                  </label>
                  <select
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2.5 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Leadership & Architecture">Leadership & Architecture</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Monthly Salary (INR)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="25000"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs font-semibold text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Assigned Primary Project
                  </label>
                  <select
                    value={empProject}
                    onChange={(e) => setEmpProject(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2.5 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  >
                    <option value="Company-wide">Company-wide (General Overhead)</option>
                    <option value="PRJ-3001">PRJ-3001: Apex Spatial Architecture</option>
                    <option value="PRJ-3002">PRJ-3002: Veloce Streetwear E-Commerce</option>
                    <option value="PRJ-3003">PRJ-3003: Nexa Core Banking Portal</option>
                    <option value="PRJ-3004">PRJ-3004: Pulse Health Mobile App</option>
                    <option value="PRJ-3005">PRJ-3005: KeySpex Community Platform</option>
                    <option value="PRJ-3009">PRJ-3009: Alpha Capital Lakehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Status
                  </label>
                  <select
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value as any)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2.5 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "contractor" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Contractor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Nambiar"
                    value={ctrName}
                    onChange={(e) => setCtrName(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Deliverable Scope / Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WebGL Shader Optimization"
                    value={ctrRole}
                    onChange={(e) => setCtrRole(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Project Attribution (Reduces Project Margin)
                  </label>
                  <select
                    value={ctrProject}
                    onChange={(e) => setCtrProject(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2.5 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  >
                    <option value="PRJ-3001">PRJ-3001: Apex Spatial Architecture</option>
                    <option value="PRJ-3002">PRJ-3002: Veloce Streetwear</option>
                    <option value="PRJ-3003">PRJ-3003: Nexa Core Banking</option>
                    <option value="PRJ-3004">PRJ-3004: Pulse Health Sciences</option>
                    <option value="PRJ-3009">PRJ-3009: Alpha Capital Lakehouse</option>
                    <option value="Company-wide">Company-wide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Milestone Payout (INR)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35000"
                    value={ctrAmount}
                    onChange={(e) => setCtrAmount(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs font-semibold text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Department Pod
                  </label>
                  <select
                    value={ctrDepartment}
                    onChange={(e) => setCtrDepartment(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2.5 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Leadership & Architecture">Leadership & Architecture</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Contract Terms
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fixed Milestone Release"
                    value={ctrTerms}
                    onChange={(e) => setCtrTerms(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "subscription" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Service / Tool Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Datadog APM & Logs"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Vendor / Provider
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Datadog Cloud"
                    value={subVendor}
                    onChange={(e) => setSubVendor(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Monthly License Cost (INR)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="20000"
                    value={subAmount}
                    onChange={(e) => setSubAmount(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs font-semibold text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    value={subDueDate}
                    onChange={(e) => setSubDueDate(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 rounded-lg border border-[#DCE4F0] px-4 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0866F5] px-4 text-xs font-semibold text-white hover:bg-[#0556D1] shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSubmitting ? "Writing to Database..." : "Add to Live Roster"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
