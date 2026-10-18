import React from "react"
import { cn } from "@/lib/utils"

export interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: "left" | "center"
  tone?: "light" | "dark"
  className?: string
  titleId?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  titleId,
}) => {
  const isDark = tone === "dark"
  const isCenter = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col",
        isCenter ? "items-center text-center mx-auto" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-3",
            isCenter && "justify-center"
          )}
        >
          <span
            className="h-[1.5px] w-6 shrink-0 bg-[#0866F5]"
            aria-hidden="true"
          />
          <span
            className={cn(
              "text-[12px] font-semibold uppercase tracking-[0.18em]",
              isDark ? "text-[#5B9BFF]" : "text-[#0866F5]"
            )}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <h2
        id={titleId}
        className={cn(
          "text-[clamp(32px,1.25rem+2.2vw,52px)] font-bold leading-[1.1] tracking-[-0.028em] [text-wrap:balance]",
          isDark ? "text-white" : "text-[#090B10]"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.65] [text-wrap:pretty]",
            isCenter ? "max-w-[32rem]" : "max-w-[34rem]",
            isDark ? "text-white/75" : "text-[#334155]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
