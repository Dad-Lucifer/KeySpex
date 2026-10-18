import { cn } from "@/lib/utils"

export type SegmentOption = {
  value: string
  label: string
}

export type SegmentedControlProps = {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  size?: "sm" | "md"
  className?: string
}

/**
 * SegmentedControl — Filter / view toggle per admin.md §10.2.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel = "View selection",
  size = "sm",
  className,
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-[8px] border border-[#DCE4F0] bg-[#F1F5FB] p-0.5 select-none",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[6px] font-semibold transition-all duration-150 cursor-pointer select-none",
              size === "sm" ? "h-6 px-2.5 text-[12px]" : "h-7 px-3 text-[13px]",
              isActive
                ? "border border-[#DCE4F0] bg-white text-[#090B10] shadow-xs"
                : "text-[#64748B] hover:text-[#090B10]"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
