import { cn } from "@/lib/utils"

export type StatusBarProps = {
  className?: string
}

/**
 * StatusBar — Honest demo status bar placed at bottom of page content per admin.md §10.1.9.
 */
export function StatusBar({ className }: StatusBarProps) {
  return (
    <footer
      aria-label="System status bar"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[10px] border border-[#DCE4F0] bg-white px-4 py-3 shadow-xs text-[13px] select-none",
        className
      )}
    >
      {/* Left indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15803D]" />
        </span>
        <span className="font-medium text-[#334155]">
          KeySpex Admin • Demo environment — data is illustrative
        </span>
      </div>

      {/* Right operational telemetry */}
      <div className="flex items-center gap-4 font-mono text-[11px] text-[#64748B]">
        <span>REFRESH: 60s</span>
        <span>•</span>
        <span>SERVER: AP-SOUTH-1</span>
        <span>•</span>
        <span>LATENCY: 24ms</span>
      </div>
    </footer>
  )
}
