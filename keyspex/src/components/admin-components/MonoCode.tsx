import React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export type MonoCodeProps = {
  children: React.ReactNode
  variant?: "muted" | "link" | "strong"
  href?: string
  className?: string
}

/**
 * MonoCode — Monospace identifier tag (PRJ-3001, CLI-2001, etc.) per admin.md §10.2 & §8.4.
 */
export function MonoCode({
  children,
  variant = "muted",
  href,
  className,
}: MonoCodeProps) {
  const baseClasses = cn(
    "font-mono text-[12px] tracking-[0.02em]",
    variant === "muted" && "text-[#64748B] font-medium",
    variant === "strong" && "text-[#090B10] font-bold",
    variant === "link" && "text-[#0866F5] font-semibold hover:underline",
    className
  )

  if (href) {
    return (
      <Link to={href} className={baseClasses}>
        {children}
      </Link>
    )
  }

  return <span className={baseClasses}>{children}</span>
}
