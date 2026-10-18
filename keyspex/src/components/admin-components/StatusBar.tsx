import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusBarProps = {
  isLive?: boolean
  lastSynced?: Date
  onReseedBaseline?: () => void
  className?: string
}

/**
 * StatusBar — Enterprise live database status telemetry bar conforming to admin.md §10.1.9.
 * Shows true live synchronization status with Firestore.
 */
export function StatusBar({
  isLive = true,
  lastSynced,
  onReseedBaseline,
  className,
}: StatusBarProps) {
  const syncTime = lastSynced
    ? lastSynced.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Live"

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
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isLive ? "bg-[#15803D]" : "bg-[#B45309]"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2.5 w-2.5",
              isLive ? "bg-[#15803D]" : "bg-[#B45309]"
            )}
          />
        </span>
        <span className="font-medium text-[#334155]">
          {isLive ? (
            <>
              KeySpex Admin • <span className="font-semibold text-[#090B10]">Live Database Connected</span> (Firestore Cloud)
            </>
          ) : (
            "KeySpex Admin • Connecting to live database…"
          )}
        </span>
      </div>

      {/* Right operational telemetry */}
      <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] text-[#64748B]">
        <span>SYNC: {syncTime}</span>
        <span>•</span>
        <span>REGION: AP-SOUTH-1</span>
        <span>•</span>
        <span className="text-[#15803D] font-semibold">STREAM: ACTIVE</span>

        {onReseedBaseline && (
          <>
            <span>•</span>
            <button
              type="button"
              onClick={onReseedBaseline}
              className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-[#0866F5] hover:underline cursor-pointer"
              title="Reseed database with clean production baseline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reseed Baseline</span>
            </button>
          </>
        )}
      </div>
    </footer>
  )
}
