import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CardFooterProps = {
  children?: React.ReactNode
  href?: string
  linkLabel?: string
  icon?: React.ReactNode
  className?: string
}

/**
 * CardFooter — Bottom metadata and action link container with top hairline.
 * Conforms to admin.md §10.2.
 */
export function CardFooter({
  children,
  href,
  linkLabel,
  icon,
  className,
}: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3.5 text-[13px] text-[#64748B]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>{children}</div>
      </div>

      {href && linkLabel && (
        <Link
          to={href}
          className="group inline-flex items-center gap-1 font-semibold text-[#0866F5] hover:text-[#0556D1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] rounded-xs select-none"
        >
          <span>{linkLabel}</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  )
}
