import { useState, useEffect } from "react"
import { X, Edit3, Check } from "lucide-react"
import type { PayeeItem } from "@/lib/admin/payrollService"

export type EditPayeeModalProps = {
  isOpen: boolean
  onClose: () => void
  payee: PayeeItem | null
  onSave: (code: string, updates: Partial<PayeeItem>) => Promise<void>
}

export function EditPayeeModal({
  isOpen,
  onClose,
  payee,
  onSave,
}: EditPayeeModalProps) {
  const [salaryValue, setSalaryValue] = useState("")
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const [status, setStatus] = useState<any>("Active")
  const [assignedProject, setAssignedProject] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (payee) {
      setSalaryValue(String(payee.salary))
      setRole(payee.role)
      setDepartment(payee.department)
      setStatus(payee.status)
      setAssignedProject(payee.assignedProject || "Company-wide")
      setError(null)
    }
  }, [payee])

  if (!isOpen || !payee) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericSalary = Number(salaryValue.replace(/[^0-9]/g, ""))
    if (isNaN(numericSalary) || numericSalary <= 0) {
      setError("Please enter a valid positive salary amount.")
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onSave(payee.code, {
        salary: numericSalary,
        role: role.trim(),
        department,
        status,
        assignedProject,
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to update payee compensation.")
    } finally {
      setIsSaving(false)
    }
  }

  const isContractor = payee.type === "contractor"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#DCE4F0] bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F1FE] text-[#0866F5]">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#090B10]">
                Modify Compensation & Details
              </h3>
              <p className="text-[12px] text-[#64748B]">
                {payee.name} ({payee.code}) • {isContractor ? "Contractor Payout" : "Core Employee"}
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

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          {error && (
            <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-2.5 text-xs text-[#B91C1C]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
              {isContractor ? "Milestone Rate (INR)" : "Monthly Salary (INR)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#64748B]">
                ₹
              </span>
              <input
                type="text"
                required
                value={salaryValue}
                onChange={(e) => setSalaryValue(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#DCE4F0] pl-7 pr-3 text-xs font-bold text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#64748B]">
              Directly recalculates Dashboard Salary Payable and Project Profitability.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
              Role / Designation
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#DCE4F0] px-3 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="On Leave">On Leave</option>
                <option value="Completed">Completed</option>
                <option value="Pending Payment">Pending Payment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#64748B] mb-1">
              Assigned Project
            </label>
            <select
              value={assignedProject}
              onChange={(e) => setAssignedProject(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#DCE4F0] px-2 text-xs text-[#090B10] focus:border-[#0866F5] focus:outline-none"
            >
              <option value="Company-wide">Company-wide (General Operations)</option>
              <option value="PRJ-3001">PRJ-3001: Apex Spatial Architecture</option>
              <option value="PRJ-3002">PRJ-3002: Veloce Streetwear E-Commerce</option>
              <option value="PRJ-3003">PRJ-3003: Nexa Core Banking Portal</option>
              <option value="PRJ-3004">PRJ-3004: Pulse Health Mobile App</option>
              <option value="PRJ-3005">PRJ-3005: KeySpex Community Platform</option>
              <option value="PRJ-3006">PRJ-3006: ShopSphere Checkout API</option>
              <option value="PRJ-3007">PRJ-3007: SecureCorp Identity Engine</option>
              <option value="PRJ-3008">PRJ-3008: Synthex Real-Time AI Agent</option>
              <option value="PRJ-3009">PRJ-3009: Alpha Capital Lakehouse</option>
              <option value="PRJ-3010">PRJ-3010: CargoLink Telematics</option>
              <option value="PRJ-3011">PRJ-3011: Vendor Modernization</option>
              <option value="PRJ-3012">PRJ-3012: PayFlux Payout Gateway</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-9 rounded-lg border border-[#DCE4F0] px-4 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0866F5] px-4 text-xs font-semibold text-white hover:bg-[#0556D1] shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save to Database"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
