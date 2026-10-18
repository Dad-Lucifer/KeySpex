import React from "react"
import { cn } from "@/lib/utils"

export interface ProcessStepProps {
  index: string
  title: string
  description: string
  isActive?: boolean
  isPast?: boolean
  isLast?: boolean
  onSelect?: () => void
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  index,
  title,
  description,
  isActive = false,
  isPast = false,
  isLast = false,
  onSelect,
}) => {
  return (
    <li
      onClick={onSelect}
      className="relative flex flex-col list-none group cursor-pointer select-none transition-all duration-300"
    >
      {/* Desktop Horizontal Rail (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex items-center mb-8 w-full">
        {/* Ring: 10px key-head motif */}
        <div
          className={cn(
            "relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-300",
            isActive
              ? "border-[#0866F5] scale-125 shadow-[0_0_12px_rgba(8,102,245,0.45)] ring-2 ring-[#0866F5]/20"
              : isPast
                ? "border-[#0866F5] bg-[#0866F5]"
                : "border-[#A9CBFB] group-hover:border-[#0866F5]"
          )}
        >
          {isPast && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#0866F5] animate-pulse" />}
        </div>

        {/* Dashed line to next step */}
        {!isLast && (
          <div
            className={cn(
              "h-[1.5px] w-full border-t border-dashed ml-2 transition-colors duration-300",
              isPast || isActive ? "border-[#0866F5]" : "border-[#A9CBFB]"
            )}
          />
        )}
      </div>

      {/* Large Decorative Numeral (72px, light blue, aria-hidden) */}
      <span
        aria-hidden="true"
        className={cn(
          "text-[56px] lg:text-[72px] font-extralight leading-none select-none tracking-[-0.04em] transition-colors duration-300",
          isActive ? "text-[#A9CBFB]" : "text-[#D3E4FD] group-hover:text-[#A9CBFB]"
        )}
      >
        {index}
      </span>

      {/* Content */}
      <div className="mt-2 flex flex-col">
        <span className="font-mono text-[13px] font-semibold tabular-nums text-[#0866F5] tracking-[0.14em]">
          {index}
        </span>

        <h3
          className={cn(
            "mt-2 text-[24px] lg:text-[28px] font-bold leading-tight tracking-[-0.015em] transition-colors duration-200",
            isActive ? "text-[#0866F5]" : "text-[#090B10] group-hover:text-[#0866F5]"
          )}
        >
          {title}
        </h3>

        <p className="mt-3 text-[16px] leading-[1.65] text-[#334155] max-w-[16rem]">
          {description}
        </p>
      </div>
    </li>
  )
}
