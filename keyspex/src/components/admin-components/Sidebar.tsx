import { NavLink, Link } from "react-router-dom"
import { Settings } from "lucide-react"
import { SectionLabel } from "./SectionLabel"
import { AvatarInitials } from "./AvatarInitials"
import { navigationConfig } from "@/data/admin/dashboardData"
import logoImg from "@/assets/KeySpex-Logo-png.png"
import { cn } from "@/lib/utils"

export type SidebarProps = {
  className?: string
  onCloseMobile?: () => void
}

/**
 * Sidebar — Left navigation sidebar per admin.md §10.1.2.
 * Sticky, 100dvh, scrolls nav items, user card pinned at bottom.
 */
export function Sidebar({ className, onCloseMobile }: SidebarProps) {
  // Retrieve user from storage if available
  let user = { name: "Alex Rivera", role: "Super Admin", email: "superadmin@brand.com" }
  try {
    const raw = localStorage.getItem("keyspex_admin_user")
    if (raw) user = { ...user, ...JSON.parse(raw) }
  } catch {
    // ignore
  }

  return (
    <aside
      aria-label="Admin navigation"
      className={cn(
        "flex h-dvh w-64 shrink-0 flex-col border-r border-[#E5E7EB] bg-[#F8FAFC] select-none",
        className
      )}
    >
      {/* Sidebar Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-[#E5E7EB] px-4">
        <Link
          to="/admin/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] rounded-lg"
          aria-label="KeySpex Admin Dashboard"
        >
          <img
            src={logoImg}
            alt="KeySpex"
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav Groups Scrollable Area */}
      <nav
        aria-label="Admin Navigation"
        className="flex-1 overflow-y-auto px-3 py-3 space-y-4"
      >
        {navigationConfig.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-3 pt-2 pb-1">
              <SectionLabel>{group.label}</SectionLabel>
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.route}
                    to={item.route}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      cn(
                        "flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium transition-colors",
                        isActive
                          ? "bg-[#D3E4FD] font-semibold text-[#0556D1]"
                          : "text-[#334155] hover:bg-[#EEF3FA] hover:text-[#090B10]"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            isActive ? "text-[#0556D1]" : "text-[#64748B]"
                          )}
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Pinned User Card at Bottom */}
      <div className="shrink-0 border-t border-[#E5E7EB] p-3.5 bg-white">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <AvatarInitials
              name={user.name}
              size={36}
              shape="rounded"
              tone="info"
            />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#090B10] truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-[#64748B] font-mono truncate">
                {user.email || "superadmin@brand.com"}
              </p>
            </div>
          </div>

          <Link
            to="/admin/settings"
            onClick={onCloseMobile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
            aria-label="Account settings"
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
