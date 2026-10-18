import React from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type AdminLoginSubmitBtnProps = {
  loading?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * AdminLoginSubmitBtn — Primary submission button for the Admin Login flow.
 * Adheres to KeySpex brand royal blue button tokens (DESIGN.md §5, admin.md §8.2).
 */
export function AdminLoginSubmitBtn({
  loading = false,
  disabled = false,
  className,
  children = "Sign In to Admin Workspace",
}: AdminLoginSubmitBtnProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "relative flex h-11 w-full items-center justify-center rounded-[10px] text-[14px] font-semibold text-white",
        "bg-[#0866F5] shadow-[0_1px_2px_rgba(8,102,245,0.30),0_8px_20px_-6px_rgba(8,102,245,0.45)]",
        "hover:bg-[#0556D1] hover:-translate-y-px hover:shadow-[0_1px_2px_rgba(8,102,245,0.30),0_12px_28px_-8px_rgba(8,102,245,0.55)]",
        "active:bg-[#0445A8] active:translate-y-0",
        "transition-all duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60 disabled:translate-y-0 cursor-pointer select-none",
        className
      )}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2} aria-hidden="true" />
          <span>Authenticating admin...</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          <span>{children}</span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
    </button>
  )
}
