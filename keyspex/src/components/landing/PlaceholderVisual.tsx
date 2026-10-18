import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Laptop, Smartphone } from "lucide-react"

interface PlaceholderVisualProps {
  variant: "website" | "tool" | "optimization"
  aspectClass: string
  className?: string
  hasFold?: boolean
}

export const PlaceholderVisual: React.FC<PlaceholderVisualProps> = ({
  variant,
  aspectClass,
  className,
  hasFold = false,
}) => {
  // Interactive state for Website variant
  const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile">("desktop")

  // Interactive state for Tool variant (selected table row)
  const [selectedRow, setSelectedRow] = useState<number>(2)

  // Interactive state for Optimization variant (chart scrub x-coordinate)
  const [scrubX, setScrubX] = useState<number | null>(null)

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[14px] bg-[#E8F1FE] border border-[#E5E7EB] select-none",
        hasFold && "ks-fold",
        aspectClass,
        className
      )}
    >
      {/* Fold Corner Ornament for Featured Card (§8.2) */}
      {hasFold && (
        <div
          className="absolute top-0 right-0 h-6 w-6 pointer-events-none z-30"
          style={{
            background: "linear-gradient(135deg, transparent 50%, #E8F1FE 50%)",
            borderLeft: "1px solid #FFFFFF",
            borderBottom: "1px solid #FFFFFF",
          }}
        />
      )}

      {/* Demonstration Preview Chip (§10.5) */}
      <div className="absolute top-3 left-3 z-30 rounded-[4px] bg-white/95 px-2 py-1 shadow-xs border border-[#E5E7EB]/70 backdrop-blur-xs">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
          Demonstration Preview
        </span>
      </div>

      {/* Inner composition */}
      <div className="relative h-full w-full p-4 sm:p-6 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.02]">
        {/* Facet Backdrop Graphic */}
        <svg
          viewBox="0 0 400 300"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
        >
          <polygon
            points="180,300 400,20 400,300"
            fill="#D3E4FD"
            fillOpacity="0.45"
          />
          <polygon
            points="260,300 400,120 400,300"
            fill="#A9CBFB"
            fillOpacity="0.3"
          />
          <line
            x1="180"
            y1="300"
            x2="400"
            y2="20"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.9"
          />
        </svg>

        {/* ==================== Variant: Website ==================== */}
        {variant === "website" && (
          <div className="relative w-full h-[88%] flex items-center justify-center">
            {/* Desktop Screen Wireframe */}
            <div
              className={cn(
                "w-[88%] h-full rounded-[10px] bg-white border border-[#E5E7EB] shadow-[0_2px_4px_rgba(9,11,16,0.04),0_12px_32px_-8px_rgba(9,11,16,0.10)] overflow-hidden flex flex-col transition-all duration-300",
                activeDevice === "desktop" ? "ring-2 ring-[#0866F5]/40" : "opacity-90"
              )}
            >
              {/* Chrome bar with interactive device switch */}
              <div className="h-6 w-full bg-[#F8FAFC] border-b border-[#E5E7EB] px-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D8DEE8]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D8DEE8]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D8DEE8]" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDevice("desktop")
                    }}
                    className={cn(
                      "p-0.5 rounded transition-colors",
                      activeDevice === "desktop" ? "text-[#0866F5]" : "text-[#94A3B8] hover:text-[#090B10]"
                    )}
                    title="View Desktop Layout"
                  >
                    <Laptop className="h-2.5 w-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDevice("mobile")
                    }}
                    className={cn(
                      "p-0.5 rounded transition-colors",
                      activeDevice === "mobile" ? "text-[#0866F5]" : "text-[#94A3B8] hover:text-[#090B10]"
                    )}
                    title="View Mobile Layout"
                  >
                    <Smartphone className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>

              {/* Wireframe content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
                    <div className="h-2 w-12 rounded-xs bg-[#D8DEE8]" />
                    <div className="flex gap-2">
                      <div className="h-1.5 w-6 rounded-xs bg-[#D8DEE8]" />
                      <div className="h-1.5 w-6 rounded-xs bg-[#D8DEE8]" />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-1.5 max-w-[65%]">
                    <div className="h-3 w-full rounded-xs bg-[#090B10]" />
                    <div className="h-3 w-3/4 rounded-xs bg-[#0866F5]" />
                    <div className="h-1.5 w-full rounded-xs bg-[#D8DEE8] mt-1" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                  <div className="h-2.5 w-10 rounded-full bg-[#0866F5] shadow-xs" />
                  <div className="h-2.5 w-12 rounded-full border border-[#D8DEE8]" />
                </div>
              </div>
            </div>

            {/* Overlapping Mobile Frame */}
            <div
              onClick={() => setActiveDevice("mobile")}
              className={cn(
                "absolute -bottom-2 -right-1 w-[28%] h-[74%] rounded-[10px] bg-white border border-[#E5E7EB] shadow-[0_4px_16px_rgba(9,11,16,0.12)] p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-300",
                activeDevice === "mobile" ? "ring-2 ring-[#0866F5] scale-105 z-20" : "hover:scale-102 z-10"
              )}
            >
              <div className="h-1 w-6 rounded-full bg-[#D8DEE8] mx-auto mb-1" />
              <div className="flex flex-col gap-1 flex-1 pt-1">
                <div className="h-2 w-full rounded-xs bg-[#090B10]" />
                <div className="h-2 w-2/3 rounded-xs bg-[#0866F5]" />
                <div className="h-1 w-full rounded-xs bg-[#D8DEE8]" />
              </div>
              <div className="h-3 w-full rounded-xs bg-[#0866F5]" />
            </div>
          </div>
        )}

        {/* ==================== Variant: Tool ==================== */}
        {variant === "tool" && (
          <div className="relative w-full h-[90%] rounded-[10px] bg-white border border-[#E5E7EB] shadow-[0_2px_4px_rgba(9,11,16,0.04),0_12px_32px_-8px_rgba(9,11,16,0.10)] overflow-hidden flex">
            {/* Sidebar Skeleton */}
            <div className="w-[30%] bg-[#F8FAFC] border-r border-[#E5E7EB] p-3 flex flex-col gap-2.5">
              <div className="h-2 w-12 rounded-xs bg-[#D8DEE8] mb-1" />
              <div className="h-5 w-full rounded-xs bg-[#E8F1FE] border-l-2 border-[#0866F5] flex items-center px-2">
                <div className="h-1.5 w-10 rounded-xs bg-[#0866F5]" />
              </div>
              <div className="h-5 w-full rounded-xs flex items-center px-2">
                <div className="h-1.5 w-8 rounded-xs bg-[#D8DEE8]" />
              </div>
              <div className="h-5 w-full rounded-xs flex items-center px-2">
                <div className="h-1.5 w-10 rounded-xs bg-[#D8DEE8]" />
              </div>
            </div>

            {/* Main Content: Clickable Interactive Table Rows */}
            <div className="flex-1 p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-2.5 w-20 rounded-xs bg-[#090B10]" />
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8px] text-[#64748B]">Active Row: {selectedRow}</span>
                    <div className="h-5 w-12 rounded-full bg-[#0866F5] shadow-xs" />
                  </div>
                </div>

                {/* 5 table rows with interactive click selection */}
                <div className="flex flex-col gap-1.5 border-t border-[#E5E7EB] pt-2">
                  {[1, 2, 3, 4, 5].map((row) => {
                    const isSelected = row === selectedRow
                    return (
                      <div
                        key={row}
                        onClick={() => setSelectedRow(row)}
                        className={cn(
                          "flex items-center justify-between p-1.5 rounded transition-colors duration-200 cursor-pointer border-b border-[#E5E7EB]/40",
                          isSelected ? "bg-[#E8F1FE] border-l-2 border-l-[#0866F5]" : "hover:bg-[#F8FAFC]"
                        )}
                        title={`Select record ${row}`}
                      >
                        <div
                          className={cn(
                            "h-1.5 w-14 rounded-xs transition-colors",
                            isSelected ? "bg-[#0866F5]" : "bg-[#334155]"
                          )}
                        />
                        <div className="h-1.5 w-10 rounded-xs bg-[#D8DEE8]" />
                        <div
                          className={cn(
                            "h-1.5 w-6 rounded-xs transition-colors",
                            isSelected ? "bg-[#0866F5]" : "bg-[#D8DEE8]"
                          )}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== Variant: Optimization ==================== */}
        {variant === "optimization" && (
          <div className="relative w-full h-[90%] rounded-[10px] bg-white border border-[#E5E7EB] shadow-[0_2px_4px_rgba(9,11,16,0.04),0_12px_32px_-8px_rgba(9,11,16,0.10)] p-3.5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="h-2.5 w-24 rounded-xs bg-[#090B10]" />
              <span className="font-mono text-[8px] text-[#0866F5]">Real-time Telemetry</span>
            </div>

            {/* Scrubbable Line Chart Area */}
            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                setScrubX(Math.max(0, Math.min(100, Math.round(x))))
              }}
              onMouseLeave={() => setScrubX(null)}
              className="relative h-20 w-full my-2 border-b border-[#E5E7EB] cursor-crosshair"
            >
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="h-[1px] w-full bg-[#E5E7EB]/50" />
                <div className="h-[1px] w-full bg-[#E5E7EB]/50" />
                <div className="h-[1px] w-full bg-[#E5E7EB]/50" />
              </div>

              <svg
                className="relative h-full w-full"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 35 Q 20 10, 45 22 T 80 8 T 100 4"
                  fill="none"
                  stroke="#0866F5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Crosshair indicator on hover */}
              {scrubX !== null && (
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-[#0866F5]"
                  style={{ left: `${scrubX}%` }}
                >
                  <div className="absolute top-1 -left-2.5 h-5 w-5 rounded-full border border-[#0866F5] bg-white/90 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0866F5]" />
                  </div>
                </div>
              )}
            </div>

            {/* Outlined Bar Charts */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-end gap-1.5 h-10 border-b border-[#E5E7EB] pb-1">
                <div className="w-2.5 h-4 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-6 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-8 bg-[#0866F5] rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-5 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
              </div>
              <div className="flex items-end gap-1.5 h-10 border-b border-[#E5E7EB] pb-1">
                <div className="w-2.5 h-5 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-7 bg-[#0866F5] rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-4 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
                <div className="w-2.5 h-6 border border-[#090B10]/30 rounded-xs transition-transform hover:scale-y-110 origin-bottom" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
