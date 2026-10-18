import React, { useState } from "react"
import { X, FolderKanban, ReceiptText, CalendarDays, History } from "lucide-react"
import type { DbProject, DbObligation, DbEvent, DbActivity } from "@/lib/admin/dashboardService"

export type CreateNewModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddProject: (project: Omit<DbProject, "id">) => Promise<void>
  onAddObligation: (obligation: Omit<DbObligation, "id">) => Promise<void>
  onAddEvent: (event: Omit<DbEvent, "id">) => Promise<void>
  onAddActivity: (activity: DbActivity) => Promise<void>
}

type TabType = "project" | "obligation" | "event" | "activity"

export function CreateNewModal({
  isOpen,
  onClose,
  onAddProject,
  onAddObligation,
  onAddEvent,
  onAddActivity,
}: CreateNewModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("project")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Project form state
  const [projectName, setProjectName] = useState("")
  const [projectCode, setProjectCode] = useState(`PRJ-${Math.floor(3013 + Math.random() * 800)}`)
  const [projectAmount, setProjectAmount] = useState("120000")
  const [projectStatus, setProjectStatus] = useState<"on_track" | "near" | "alert">("on_track")
  const [projectClient, setProjectClient] = useState("Acme Global")
  const [projectClientCode, setProjectClientCode] = useState("CLI-2012")

  // Obligation form state
  const [obTitle, setObTitle] = useState("")
  const [obAmount, setObAmount] = useState("45000")
  const [obClient, setObClient] = useState("Vercel Enterprise")
  const [obClientCode, setObClientCode] = useState("CLI-2015")
  const [obStatus, setObStatus] = useState<"due_soon" | "scheduled" | "pending_auth">("due_soon")
  const [obDate, setObDate] = useState("2026-11-08")

  // Event form state
  const [evtTitle, setEvtTitle] = useState("")
  const [evtCategory, setEvtCategory] = useState<"project_deadline" | "operations" | "financial" | "client_meeting">("client_meeting")
  const [evtDate, setEvtDate] = useState("2026-11-06")
  const [evtTime, setEvtTime] = useState("03:30 PM")
  const [evtContext, setEvtContext] = useState("Google Meet / Video Sync")

  // Activity form state
  const [actAction, setActAction] = useState("Reconciled Inward Wire")
  const [actTargetCode, setActTargetCode] = useState("PAY-6015")
  const [actContext, setActContext] = useState("₹1,45,000 disbursement confirmation")
  const [actStatus, setActStatus] = useState<"completed" | "verified" | "reconciled" | "updated">("completed")

  if (!isOpen) return null

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) {
      setError("Please provide a project name.")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await onAddProject({
        name: projectName.trim(),
        code: projectCode.trim().toUpperCase(),
        amount: Number(projectAmount) || 0,
        status: projectStatus,
        clientName: projectClient.trim(),
        clientCode: projectClientCode.trim().toUpperCase(),
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to save project to Firestore.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleObligationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!obTitle.trim()) {
      setError("Please provide an obligation title.")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const d = new Date(obDate)
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
      const month = months[d.getMonth()] || "NOV"
      const day = String(d.getDate()).padStart(2, "0")

      await onAddObligation({
        title: obTitle.trim(),
        amount: Number(obAmount) || 0,
        clientName: obClient.trim(),
        clientCode: obClientCode.trim().toUpperCase(),
        status: obStatus,
        month,
        day,
        dueLabel: obStatus === "due_soon" ? "Due in 3 days" : obStatus === "scheduled" ? "Scheduled" : "Pending Auth",
        dueDate: obDate,
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to save obligation to Firestore.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evtTitle.trim()) {
      setError("Please provide an event title.")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const d = new Date(evtDate)
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
      const month = months[d.getMonth()] || "NOV"
      const day = String(d.getDate()).padStart(2, "0")

      const categoryLabels: Record<string, string> = {
        project_deadline: "Project Deadline",
        operations: "Operations",
        financial: "Financial",
        client_meeting: "Client Meeting",
      }

      await onAddEvent({
        title: evtTitle.trim(),
        category: evtCategory,
        categoryLabel: categoryLabels[evtCategory] || "Meeting",
        time: evtTime,
        context: evtContext.trim(),
        month,
        day,
        date: evtDate,
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to schedule event in Firestore.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onAddActivity({
        actor: { name: "Alex Rivera", role: "Super Admin", kind: "person" },
        actionText: actAction.trim(),
        targetCode: actTargetCode.trim().toUpperCase(),
        context: actContext.trim(),
        timestamp: new Date().toISOString(),
        status: actStatus,
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to log activity in Firestore.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-[#DCE4F0] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h2 id="modal-title" className="text-[18px] font-bold text-[#090B10]">
              Create New Live Record
            </h2>
            <p className="text-[13px] text-[#64748B]">
              Directly persists to Firestore database and syncs all dashboard cards.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#090B10] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="mt-4 flex border-b border-[#E5E7EB] text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("project")}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "project"
                ? "border-[#0866F5] text-[#0866F5]"
                : "border-transparent text-[#64748B] hover:text-[#090B10]"
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            <span>Project</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("obligation")}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "obligation"
                ? "border-[#0866F5] text-[#0866F5]"
                : "border-transparent text-[#64748B] hover:text-[#090B10]"
            }`}
          >
            <ReceiptText className="h-4 w-4" />
            <span>Obligation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("event")}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "event"
                ? "border-[#0866F5] text-[#0866F5]"
                : "border-transparent text-[#64748B] hover:text-[#090B10]"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Calendar Event</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "activity"
                ? "border-[#0866F5] text-[#0866F5]"
                : "border-transparent text-[#64748B] hover:text-[#090B10]"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Log Activity</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-2.5 text-xs font-medium text-[#B91C1C]">
            {error}
          </div>
        )}

        {/* Tab 1: Project Form */}
        {activeTab === "project" && (
          <form onSubmit={handleProjectSubmit} className="mt-4 space-y-3.5 text-[13px]">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. AI-Powered Workflow Automations"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Project Code</label>
                <input
                  type="text"
                  required
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] font-mono uppercase focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={projectAmount}
                  onChange={(e) => setProjectAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={projectClient}
                  onChange={(e) => setProjectClient(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Client Code</label>
                <input
                  type="text"
                  required
                  value={projectClientCode}
                  onChange={(e) => setProjectClientCode(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] font-mono uppercase focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">Health Status</label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value as any)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none bg-white"
              >
                <option value="on_track">On Track (Healthy)</option>
                <option value="near">Near (Caution)</option>
                <option value="alert">Alert (Critical)</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#DCE4F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#0866F5] font-semibold text-white hover:bg-[#0556D1] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Writing to Firestore…" : "Save Project"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Obligation Form */}
        {activeTab === "obligation" && (
          <form onSubmit={handleObligationSubmit} className="mt-4 space-y-3.5 text-[13px]">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Obligation Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Cloud Hosting SLA Settlement"
                value={obTitle}
                onChange={(e) => setObTitle(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={obAmount}
                  onChange={(e) => setObAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={obDate}
                  onChange={(e) => setObDate(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Recipient / Client</label>
                <input
                  type="text"
                  required
                  value={obClient}
                  onChange={(e) => setObClient(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Client Code</label>
                <input
                  type="text"
                  required
                  value={obClientCode}
                  onChange={(e) => setObClientCode(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] font-mono uppercase focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">Disbursement Status</label>
              <select
                value={obStatus}
                onChange={(e) => setObStatus(e.target.value as any)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none bg-white"
              >
                <option value="due_soon">Due Soon (Urgent)</option>
                <option value="scheduled">Scheduled (Normal)</option>
                <option value="pending_auth">Pending Authorization</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#DCE4F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#0866F5] font-semibold text-white hover:bg-[#0556D1] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Writing to Firestore…" : "Schedule Obligation"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Calendar Event Form */}
        {activeTab === "event" && (
          <form onSubmit={handleEventSubmit} className="mt-4 space-y-3.5 text-[13px]">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Executive Strategy Sync"
                value={evtTitle}
                onChange={(e) => setEvtTitle(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={evtDate}
                  onChange={(e) => setEvtDate(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:30 AM"
                  value={evtTime}
                  onChange={(e) => setEvtTime(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Category</label>
                <select
                  value={evtCategory}
                  onChange={(e) => setEvtCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none bg-white"
                >
                  <option value="client_meeting">Client Meeting</option>
                  <option value="project_deadline">Project Deadline</option>
                  <option value="financial">Financial</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Context / Location</label>
                <input
                  type="text"
                  required
                  value={evtContext}
                  onChange={(e) => setEvtContext(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#DCE4F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#0866F5] font-semibold text-white hover:bg-[#0556D1] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Scheduling in Firestore…" : "Add Event"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Activity Audit Form */}
        {activeTab === "activity" && (
          <form onSubmit={handleActivitySubmit} className="mt-4 space-y-3.5 text-[13px]">
            <div>
              <label className="block font-medium text-[#334155] mb-1">Action Description</label>
              <input
                type="text"
                required
                value={actAction}
                onChange={(e) => setActAction(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Target Code</label>
                <input
                  type="text"
                  required
                  value={actTargetCode}
                  onChange={(e) => setActTargetCode(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] font-mono uppercase focus:border-[#0866F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#334155] mb-1">Audit Status</label>
                <select
                  value={actStatus}
                  onChange={(e) => setActStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none bg-white"
                >
                  <option value="completed">Completed</option>
                  <option value="verified">Verified</option>
                  <option value="reconciled">Reconciled</option>
                  <option value="updated">Updated</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">Context Notes</label>
              <input
                type="text"
                required
                value={actContext}
                onChange={(e) => setActContext(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2 text-[#090B10] focus:border-[#0866F5] focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#DCE4F0] font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#0866F5] font-semibold text-white hover:bg-[#0556D1] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Logging in Firestore…" : "Record Activity"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
