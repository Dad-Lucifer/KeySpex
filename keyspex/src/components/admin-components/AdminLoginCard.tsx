import React from "react"
import { cn } from "@/lib/utils"

export type AdminLoginCardProps = {
  children: React.ReactNode
  className?: string
}

/**
 * AdminLoginCard — Structured white card container for Admin Login.
 * Conforms to admin.md §10.2 AdminCard specification:
 * bg #FFFFFF, border 1px #DCE4F0, radius 14px, shadow-xs (0 1px 2px rgba(9,11,16,0.04)).
 */
export function AdminLoginCard({ children, className }: AdminLoginCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[440px] rounded-[14px] border border-[#DCE4F0]",
        "bg-white shadow-[0_1px_2px_rgba(9,11,16,0.04)]",
        "flex flex-col gap-6 p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  )
}
