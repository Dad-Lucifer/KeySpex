import { cn } from "@/lib/utils"

export type LegendItemProps = {
  color: string
  label: string
  shape?: "square" | "dash"
  className?: string
}

/**
 * LegendItem — Chart series legend item per admin.md §10.2.
 */
export function LegendItem({
  color,
  label,
  shape = "square",
  className,
}: LegendItemProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium text-[#475569] select-none", className)}>
      {shape === "square" ? (
        <span
          className="h-2.5 w-2.5 rounded-[2px]"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      ) : (
        <span
          className="h-[2px] w-3.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </div>
  )
}
