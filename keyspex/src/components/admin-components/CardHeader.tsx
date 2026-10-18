import React from "react"
import { cn } from "@/lib/utils"

export type CardHeaderProps = {
  id?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  divider?: boolean
  titleAdornment?: React.ReactNode
  className?: string
}

/**
 * CardHeader — Standard card header with title, subtitle, right actions slot and bottom hairline.
 * Conforms to admin.md §10.2.
 */
export function CardHeader({
  id,
  title,
  subtitle,
  actions,
  divider = true,
  titleAdornment,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2
              id={id}
              className="text-[18px] sm:text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#090B10] truncate"
            >
              {title}
            </h2>
            {titleAdornment}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-[13px] text-[#64748B] leading-[1.45]">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {divider && (
        <div className="my-3.5 h-[1px] w-full bg-[#E5E7EB]" aria-hidden="true" />
      )}
    </div>
  )
}
