import { useNavigate } from "react-router-dom"
import {
  Menu,
  ChevronRight,
  Search,
  Bell,
  CircleHelp,
  LogOut,
  User,
} from "lucide-react"
import { signOutFirebase } from "@/lib/authService"
import { cn } from "@/lib/utils"

export type TopbarProps = {
  onToggleSidebar?: () => void
  className?: string
}

/**
 * Topbar — Global application header per admin.md §10.1.3.
 */
export function Topbar({ onToggleSidebar, className }: TopbarProps) {
  const navigate = useNavigate()

  let user = { name: "Alex Rivera", role: "Super Admin" }
  try {
    const raw = localStorage.getItem("keyspex_admin_user")
    if (raw) user = { ...user, ...JSON.parse(raw) }
  } catch {
    // ignore
  }

  const handleSignOut = async () => {
    await signOutFirebase()
    navigate("/admin/login")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 sm:px-6 backdrop-blur-md select-none",
        className
      )}
    >
      {/* Left Area: Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#334155] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-[14px]">
          <span className="text-[#64748B]">Overview</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" strokeWidth={2} />
          <span className="font-semibold text-[#090B10]" aria-current="page">
            Dashboard
          </span>
        </nav>
      </div>

      {/* Center Search Input */}
      <div className="flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" strokeWidth={1.75} />
          <input
            type="text"
            readOnly
            placeholder="Search employees, projects, clients…"
            onClick={() => {
              // Simulated ⌘K command palette trigger
            }}
            className="h-9 w-full rounded-[10px] border border-[#DCE4F0] bg-[#F8FAFC] pl-9 pr-12 text-[13px] text-[#090B10] placeholder:text-[#94A3B8] transition-colors hover:border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0866F5] cursor-pointer"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[#CBD5E1] bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#64748B]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Pill */}
        <div className="hidden md:inline-flex items-center rounded-full border border-[#DCE4F0] bg-[#F8FAFC] px-3 py-1 text-[12px] font-semibold text-[#090B10]">
          ₹ INR (₹)
        </div>

        {/* Notification Bell with Badge */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
          aria-label="Notifications, 3 unread"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white leading-none">
            3
          </span>
        </button>

        {/* Help Icon */}
        <button
          type="button"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
          aria-label="Help and documentation"
        >
          <CircleHelp className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-[1px] bg-[#E5E7EB]" aria-hidden="true" />

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0866F5] text-white shadow-xs">
            <User className="h-4 w-4" strokeWidth={2} />
          </div>

          <div className="hidden lg:block text-left">
            <p className="text-[13px] font-semibold text-[#090B10] leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] text-[#64748B] leading-tight">
              {user.role}
            </p>
          </div>

          {/* Sign Out Trigger */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#FEE2E2]/60 hover:text-[#B91C1C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] cursor-pointer"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
