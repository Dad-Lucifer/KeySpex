import { useState } from "react"
import { formatINR, formatINRCompact } from "@/lib/admin/format"

export type AreaLineChartProps = {
  labels: string[]
  currentSeries: number[]
  previousSeries: number[]
  height?: number
  className?: string
}

/**
 * Generate smooth SVG path command using cubic Bezier curve interpolation.
 */
function getSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ""
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

/**
 * AreaLineChart — Pure SVG comparative trajectory chart per admin.md §10.5.
 * Zero external library dependencies, smooth bezier interpolation, and interactive tooltips.
 */
export function AreaLineChart({
  labels,
  currentSeries,
  previousSeries,
  height = 230,
  className,
}: AreaLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Chart dimensions & margins
  const width = 640
  const margin = { top: 20, right: 16, bottom: 44, left: 48 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  const maxY = 1000000 // 10 Lakhs max for grid
  const yTicks = [0, 200000, 400000, 600000, 800000, 1000000]

  const getY = (val: number) => {
    return margin.top + plotHeight - (val / maxY) * plotHeight
  }

  const getX = (idx: number) => {
    if (labels.length <= 1) return margin.left + plotWidth / 2
    return margin.left + (idx / (labels.length - 1)) * plotWidth
  }

  // Calculate coordinates
  const currentPoints = currentSeries.map((v, i) => ({ x: getX(i), y: getY(v) }))
  const previousPoints = previousSeries.map((v, i) => ({ x: getX(i), y: getY(v) }))

  const currentLinePath = getSmoothPath(currentPoints)
  const previousLinePath = getSmoothPath(previousPoints)

  // Area paths
  const baselineY = margin.top + plotHeight
  const currentAreaPath = currentPoints.length
    ? `${currentLinePath} L ${currentPoints[currentPoints.length - 1].x} ${baselineY} L ${currentPoints[0].x} ${baselineY} Z`
    : ""

  const previousAreaPath = previousPoints.length
    ? `${previousLinePath} L ${previousPoints[previousPoints.length - 1].x} ${baselineY} L ${previousPoints[0].x} ${baselineY} Z`
    : ""

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Revenue overview comparison chart"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="revenue-current-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0866F5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0866F5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines and Y axis ticks */}
        {yTicks.map((tick) => {
          const y = getY(tick)
          return (
            <g key={tick} className="transition-colors">
              <line
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke={tick === 0 ? "#CBD5E1" : "#E5E9F2"}
                strokeWidth={tick === 0 ? 1.5 : 1}
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] font-medium fill-[#64748B] tabular-nums"
              >
                {tick === 0 ? "₹0" : formatINRCompact(tick, 0)}
              </text>
            </g>
          )
        })}

        {/* Previous Series Area (Drawn behind) */}
        {previousAreaPath && (
          <path
            d={previousAreaPath}
            fill="rgba(148,163,184,0.08)"
            aria-hidden="true"
          />
        )}

        {/* Previous Series Line (Dashed) */}
        {previousLinePath && (
          <path
            d={previousLinePath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        )}

        {/* Current Series Area Fill */}
        {currentAreaPath && (
          <path
            d={currentAreaPath}
            fill="url(#revenue-current-grad)"
            aria-hidden="true"
          />
        )}

        {/* Current Series Line */}
        {currentLinePath && (
          <path
            d={currentLinePath}
            fill="none"
            stroke="#0866F5"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Markers on Current Series */}
        {currentPoints.map((pt, i) => {
          const isLast = i === currentPoints.length - 1
          const isHovered = hoverIndex === i

          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isLast ? 6 : isHovered ? 5.5 : 4}
                fill={isLast ? "#0866F5" : "white"}
                stroke={isLast ? "white" : "#0866F5"}
                strokeWidth={isLast ? 2.5 : 2}
                className="transition-all duration-150"
              />
              {isLast && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={8}
                  fill="none"
                  stroke="#0866F5"
                  strokeWidth={1.5}
                  opacity={0.4}
                />
              )}
            </g>
          )
        })}

        {/* Vertical hover indicator & interactive zones */}
        {currentPoints.map((pt, i) => (
          <g key={i}>
            {hoverIndex === i && (
              <line
                x1={pt.x}
                y1={margin.top}
                x2={pt.x}
                y2={baselineY}
                stroke="#0866F5"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
            )}
            <rect
              x={pt.x - plotWidth / (labels.length * 2)}
              y={margin.top}
              width={plotWidth / labels.length}
              height={plotHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {labels.map((label, i) => {
          const x = getX(i)
          const isLast = i === labels.length - 1

          return (
            <g key={label} transform={`translate(${x}, ${height - 24})`}>
              <text
                textAnchor="middle"
                className={`text-[12px] ${
                  isLast ? "font-bold fill-[#0866F5]" : "font-medium fill-[#64748B]"
                }`}
              >
                {label}
              </text>
              {isLast && (
                <text
                  y={13}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-[#0866F5]"
                >
                  (Current)
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Floating Tooltip when hovered */}
      {hoverIndex !== null && (
        <div
          className="mt-2 flex items-center justify-between rounded-lg border border-[#DCE4F0] bg-white p-2.5 text-xs shadow-md animate-in fade-in-50 duration-150"
          role="status"
        >
          <span className="font-semibold text-[#090B10]">
            Month: {labels[hoverIndex]}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#0866F5] font-semibold">
              Current: {formatINR(currentSeries[hoverIndex])}
            </span>
            <span className="text-[#64748B]">
              Previous: {formatINR(previousSeries[hoverIndex])}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
