import { Calendar, ChevronDown, Download, Plus, IndianRupee } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import { cn } from "@/lib/utils"

export type PageHeaderProps = {
  userName?: string
  isLive?: boolean
  onCreateNew?: () => void
  className?: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

/**
 * PageHeader — Dashboard header with greeting, live connection badge, description, and action controls
 * conforming to admin.md §10.1.4.
 */
export function PageHeader({
  userName = "Admin",
  isLive = true,
  onCreateNew,
  className,
}: PageHeaderProps) {
  const greeting = getGreeting()
  const now = new Date()
  const monthName = now.toLocaleString("en-US", { month: "short" })
  const year = now.getFullYear()
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  const dateRangeLabel = `This Month: ${monthName} 1 – ${monthName} ${lastDay}, ${year}`

  return (
    <div className={cn("flex flex-col gap-4 pb-2", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting + Badge + Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-[#090B10]">
              {greeting}, {userName}
            </h1>
            <StatusBadge tone={isLive ? "success" : "info"} dot>
              {isLive ? "Live Database Connected" : "Connecting to Database…"}
            </StatusBadge>
          </div>
          <p className="text-[13px] sm:text-[14px] text-[#64748B]">
            Real-time business performance and metrics synced directly with Firestore.
          </p>
        </div>

        {/* Right: Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Date Range Selector */}
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[#DCE4F0] bg-white px-3 text-[13px] font-semibold text-[#090B10] shadow-xs hover:border-[#CBD5E1] transition-colors cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#64748B]" strokeWidth={1.75} />
            <span>{dateRangeLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </button>

          {/* Currency Selector */}
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#DCE4F0] bg-white px-3 text-[13px] font-semibold text-[#090B10] shadow-xs hover:border-[#CBD5E1] transition-colors cursor-pointer"
          >
            <IndianRupee className="h-3.5 w-3.5 text-[#64748B]" />
            <span>INR (₹) Default</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </button>

          {/* Export Report Outline Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#DCE4F0] bg-white px-3 text-[13px] font-semibold text-[#090B10] shadow-xs hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#64748B]" strokeWidth={1.75} />
            <span>Export Report</span>
          </button>

          {/* Create New Primary Button */}
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#0866F5] px-4 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(8,102,245,0.30),0_8px_20px_-6px_rgba(8,102,245,0.45)] hover:bg-[#0556D1] transition-all cursor-pointer select-none"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            <span>Create New</span>
          </button>
        </div>
      </div>
    </div>
  )
}
