import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tone } from "@/types/admin"

export type AvatarInitialsProps = {
  name: string
  size?: 28 | 32 | 36
  shape?: "circle" | "rounded"
  tone?: Tone
  variant?: "initials" | "bot" | "solid-user"
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * AvatarInitials — Avatar with initials, bot icon, or solid user icon (admin.md §10.2).
 */
export function AvatarInitials({
  name,
  size = 36,
  shape = "circle",
  tone = "info",
  variant = "initials",
  className,
}: AvatarInitialsProps) {
  const sizeClasses = {
    28: "h-7 w-7 text-[11px]",
    32: "h-8 w-8 text-[12px]",
    36: "h-9 w-9 text-[13px]",
  }[size]

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-[10px]"

  if (variant === "solid-user") {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-[#0866F5] text-white shadow-xs select-none",
          sizeClasses,
          shapeClasses,
          className
        )}
      >
        <User className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </div>
    )
  }

  if (variant === "bot") {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center border border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] shadow-xs select-none",
          sizeClasses,
          shapeClasses,
          className
        )}
      >
        <Bot className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </div>
    )
  }

  const toneBgMap: Record<Tone, string> = {
    info: "border-[#D3E4FD] bg-[#E8F1FE] text-[#0556D1]",
    success: "border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]",
    warning: "border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]",
    danger: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
    neutral: "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]",
    purple: "border-[#DDD6FE] bg-[#EDE9FE] text-[#6D28D9]",
  }

  return (
    <div
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center border font-bold select-none",
        toneBgMap[tone],
        sizeClasses,
        shapeClasses,
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
