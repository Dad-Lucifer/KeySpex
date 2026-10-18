import React, { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { StatusBar } from "./StatusBar"
import { cn } from "@/lib/utils"

export type AdminShellProps = {
  children: React.ReactNode
  isLive?: boolean
  lastSynced?: Date
  onReseedBaseline?: () => void
  className?: string
}

/**
 * AdminShell — Primary layout route chrome composing Sidebar, Topbar, Main content, and StatusBar.
 * Conforms to admin.md §10.1.1.
 */
export function AdminShell({
  children,
  isLive = true,
  lastSynced,
  onReseedBaseline,
  className,
}: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#FFFFFF] text-[#090B10]">
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar className="sticky top-0" />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full w-64 max-w-[85vw] flex-col bg-[#F8FAFC] shadow-xl">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col min-w-0 bg-[#F8FAFC]">
        <Topbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main
          id="admin-main"
          tabIndex={-1}
          className={cn(
            "flex-1 p-4 sm:p-6 lg:p-6 max-w-[1600px] w-full mx-auto space-y-6 focus:outline-none",
            className
          )}
        >
          {children}

          <div className="pt-2">
            <StatusBar
              isLive={isLive}
              lastSynced={lastSynced}
              onReseedBaseline={onReseedBaseline}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
