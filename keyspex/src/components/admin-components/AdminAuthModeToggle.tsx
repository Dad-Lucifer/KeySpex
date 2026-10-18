import { LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

export type AuthMode = "signin" | "signup"

export type AdminAuthModeToggleProps = {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
  className?: string
}

/**
 * AdminAuthModeToggle — Segmented control tab switching between Sign In and Sign Up.
 * Conforms to admin.md §10.2 SegmentedControl and §9.2 Tabs/view toggles.
 */
export function AdminAuthModeToggle({
  mode,
  onChange,
  className,
}: AdminAuthModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Authentication mode"
      className={cn(
        "grid w-full grid-cols-2 rounded-[10px] border border-[#DCE4F0] bg-[#F1F5FB] p-1",
        className
      )}
    >
      <button
        type="button"
        role="tab"
        id="tab-signin"
        aria-selected={mode === "signin"}
        aria-controls="auth-panel"
        onClick={() => onChange("signin")}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-[8px] text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none",
          mode === "signin"
            ? "border border-[#DCE4F0] bg-white text-[#090B10] shadow-[0_1px_2px_rgba(9,11,16,0.04)]"
            : "text-[#64748B] hover:text-[#090B10]"
        )}
      >
        <LogIn className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span>Sign In</span>
      </button>

      <button
        type="button"
        role="tab"
        id="tab-signup"
        aria-selected={mode === "signup"}
        aria-controls="auth-panel"
        onClick={() => onChange("signup")}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-[8px] text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none",
          mode === "signup"
            ? "border border-[#DCE4F0] bg-white text-[#090B10] shadow-[0_1px_2px_rgba(9,11,16,0.04)]"
            : "text-[#64748B] hover:text-[#090B10]"
        )}
      >
        <UserPlus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span>Sign Up</span>
      </button>
    </div>
  )
}
