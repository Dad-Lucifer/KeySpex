import React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type AdminLoginFieldProps = {
  id: string
  label: string
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  error?: string | null
  helperText?: string
  leftIcon?: LucideIcon
  rightSlot?: React.ReactNode
  className?: string
}

/**
 * AdminLoginField — Labeled input atom with left icon, right action slot, and validation state.
 * Conforms to admin.md §9.2 FormField/TextInput specification:
 * Height 40px, border #DCE4F0, radius 10px, focus ring royal blue (#0866F5), label 13/600.
 */
export function AdminLoginField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightSlot,
  className,
}: AdminLoginFieldProps) {
  const errorId = `${id}-error`
  const helperId = `${id}-helper`

  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[13px] font-semibold text-[#090B10] select-none"
        >
          {label}
          {required && <span className="ml-0.5 text-[#B91C1C]" aria-hidden="true">*</span>}
        </label>
      </div>

      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "h-10 w-full rounded-[10px] border bg-[#F8FAFC] text-[14px] text-[#090B10]",
            "placeholder:text-[#94A3B8] transition-all duration-150 ease-in-out",
            "focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            LeftIcon ? "pl-10" : "pl-3.5",
            rightSlot ? "pr-10" : "pr-3.5",
            error
              ? "border-[#FECACA] bg-[#FEE2E2]/25 text-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/10"
              : "border-[#DCE4F0]"
          )}
        />

        {rightSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-[12px] font-medium text-[#B91C1C]">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[12px] text-[#64748B]">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
