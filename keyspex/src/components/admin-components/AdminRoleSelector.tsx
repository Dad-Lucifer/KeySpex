import { Shield, Users, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/authService"

export type AdminRoleSelectorProps = {
  role: UserRole
  onChange: (role: UserRole) => void
  disabled?: boolean
  className?: string
}

const ROLES: Array<{
  id: UserRole
  label: string
  description: string
  icon: typeof Shield
}> = [
  {
    id: "Admin",
    label: "Admin",
    description: "Full management",
    icon: Shield,
  },
  {
    id: "Employee",
    label: "Employee",
    description: "Internal staff",
    icon: Users,
  },
  {
    id: "Client",
    label: "Client",
    description: "External portal",
    icon: Building2,
  },
]

/**
 * AdminRoleSelector — Accessible role selector atom for the 3 roles: Admin, Employee, Client.
 * Conforms to admin.md §10.2 SegmentedControl and tone system.
 */
export function AdminRoleSelector({
  role,
  onChange,
  disabled = false,
  className,
}: AdminRoleSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)}>
      <label className="text-[13px] font-semibold text-[#090B10] select-none">
        Select Account Role <span className="text-[#B91C1C]">*</span>
      </label>

      <div
        role="radiogroup"
        aria-label="Account role"
        className="grid grid-cols-3 gap-2"
      >
        {ROLES.map((r) => {
          const Icon = r.icon
          const isSelected = role === r.id

          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(r.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-[10px] border p-2.5 text-center transition-all duration-150 cursor-pointer select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected
                  ? "border-[#0866F5] bg-[#F3F8FF] text-[#0866F5] shadow-xs ring-1 ring-[#0866F5]"
                  : "border-[#DCE4F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isSelected ? "text-[#0866F5]" : "text-[#94A3B8]"
                )}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-[12px] font-semibold leading-tight",
                  isSelected ? "text-[#090B10]" : "text-[#475569]"
                )}
              >
                {r.label}
              </span>
              <span className="text-[10px] text-[#94A3B8] leading-none">
                {r.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
