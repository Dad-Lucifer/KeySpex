import { useState } from "react"
import { X, Landmark, Check } from "lucide-react"

export type EditBudgetCapModalProps = {
  isOpen: boolean
  onClose: () => void
  currentCap: number
  onSave: (newCap: number) => Promise<void>
}

export function EditBudgetCapModal({
  isOpen,
  onClose,
  currentCap,
  onSave,
}: EditBudgetCapModalProps) {
  const [capValue, setCapValue] = useState(String(currentCap))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const numeric = Number(capValue.replace(/[^0-9]/g, ""))
    if (isNaN(numeric) || numeric <= 0) {
      setError("Please enter a valid positive budget amount.")
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onSave(numeric)
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to update budget cap.")
    } finally {
      setIsSaving(false)
    }
  }

  const presets = [
    { label: "₹20,00,000 (Current)", value: 2000000 },
    { label: "₹25,00,000 (+25%)", value: 2500000 },
    { label: "₹30,00,000 (+50%)", value: 3000000 },
    { label: "₹35,00,000 (+75%)", value: 3500000 },
  ]

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
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#090B10]">
                Modify Annual Budget Cap
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Updates live Firestore targets for FY 2026-27
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
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-2.5 text-xs text-[#B91C1C]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Annual Cap (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#64748B]">
                ₹
              </span>
              <input
                type="text"
                value={capValue}
                onChange={(e) => setCapValue(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#DCE4F0] bg-white pl-8 pr-3 text-[15px] font-semibold text-[#090B10] focus:border-[#0866F5] focus:outline-none focus:ring-1 focus:ring-[#0866F5]"
                placeholder="2000000"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#64748B]">
              Real-time calculations for utilization % and surplus will immediately update.
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-[11px] font-semibold text-[#64748B] mb-2">
              QUICK TARGET PRESETS
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setCapValue(String(preset.value))}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-left text-xs font-semibold text-[#334155] hover:border-[#0866F5] hover:bg-[#E8F1FE] hover:text-[#0866F5] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
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
