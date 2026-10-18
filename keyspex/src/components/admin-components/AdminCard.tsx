import React from "react"
import { cn } from "@/lib/utils"

export type AdminCardProps = {
  as?: "section" | "div" | "article"
  padded?: boolean
  className?: string
  children: React.ReactNode
  "aria-labelledby"?: string
}

/**
 * AdminCard — Primary building block container per admin.md §10.2.
 * White background, 1px border #DCE4F0, radius 14px, shadow-xs (0 1px 2px rgba(9,11,16,0.04)).
 */
export function AdminCard({
  as: Component = "section",
  padded = true,
  className,
  children,
  "aria-labelledby": ariaLabelledBy,
}: AdminCardProps) {
  return (
    <Component
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "min-w-0 flex flex-col rounded-[14px] border border-[#DCE4F0] bg-white shadow-[0_1px_2px_rgba(9,11,16,0.04)]",
        padded && "p-5",
        className
      )}
    >
      {children}
    </Component>
  )
}
