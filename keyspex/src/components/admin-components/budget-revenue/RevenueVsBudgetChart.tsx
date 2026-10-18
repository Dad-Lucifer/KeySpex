import { useState } from "react"
import { AdminCard } from "../AdminCard"
import { CardHeader } from "../CardHeader"
import { CardFooter } from "../CardFooter"
import { SegmentedControl } from "../SegmentedControl"
import { LegendItem } from "../LegendItem"
import { formatINR, formatINRCompact } from "@/lib/admin/format"
import type { BudgetRevenueData } from "@/lib/admin/budgetRevenueService"

export type RevenueVsBudgetChartProps = {
  periodsData: BudgetRevenueData["periodsData"]
  className?: string
}

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

export function RevenueVsBudgetChart({
  periodsData,
  className,
}: RevenueVsBudgetChartProps) {
  const [period, setPeriod] = useState<"6M" | "YTD" | "1Y">("6M")
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const activeData = periodsData[period]
  const { labels, actual, target, forecast, forecastStartIndex } = activeData

  // SVG plot geometry
  const width = 640
  const height = 260
  const margin = { top: 24, right: 24, bottom: 44, left: 52 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  // Find max value across all series including forecast
  const validForecast = forecast.filter((v): v is number => v !== null)
  const maxVal = Math.max(...actual, ...target, ...validForecast, 1000000)
  const maxY = Math.ceil(maxVal / 400000) * 400000 || 2000000

  const yTicks = [
    0,
    Math.round(maxY * 0.25),
    Math.round(maxY * 0.5),
    Math.round(maxY * 0.75),
    maxY,
  ]

  const getY = (val: number) => {
    return margin.top + plotHeight - (val / maxY) * plotHeight
  }

  const getX = (idx: number) => {
    if (labels.length <= 1) return margin.left + plotWidth / 2
    return margin.left + (idx / (labels.length - 1)) * plotWidth
  }

  // Points for actual (only up to forecastStartIndex)
  const actualPoints: { x: number; y: number }[] = []
  for (let i = 0; i <= forecastStartIndex && i < actual.length; i++) {
    actualPoints.push({ x: getX(i), y: getY(actual[i]) })
  }

  // Points for targets (all points)
  const targetPoints = target.map((v, i) => ({ x: getX(i), y: getY(v) }))

  // Points for forecast (from forecastStartIndex onwards)
  const forecastPoints: { x: number; y: number }[] = []
  for (let i = forecastStartIndex; i < forecast.length; i++) {
    const val = forecast[i]
    if (val !== null) {
      forecastPoints.push({ x: getX(i), y: getY(val) })
    }
  }

  const actualPath = getSmoothPath(actualPoints)
  const targetPath = getSmoothPath(targetPoints)
  const forecastPath = getSmoothPath(forecastPoints)

  // Gradient area fill for actual revenue
  const baselineY = margin.top + plotHeight
  const actualAreaPath = actualPoints.length
    ? `${actualPath} L ${actualPoints[actualPoints.length - 1].x} ${baselineY} L ${actualPoints[0].x} ${baselineY} Z`
    : ""

  // Forecast corridor area
  const forecastAreaPath = forecastPoints.length
    ? `${forecastPath} L ${forecastPoints[forecastPoints.length - 1].x} ${baselineY} L ${forecastPoints[0].x} ${baselineY} Z`
    : ""

  const boundaryX = getX(forecastStartIndex)

  return (
    <AdminCard className={className}>
      <CardHeader
        title="Revenue Trajectory vs Planned Budget"
        subtitle="Realized client collections vs budgeted revenue with CAGR forecast corridor"
        actions={
          <SegmentedControl
            options={[
              { value: "6M", label: "6M" },
              { value: "YTD", label: "YTD" },
              { value: "1Y", label: "1Y" },
            ]}
            value={period}
            onChange={(val) => {
              setPeriod(val as "6M" | "YTD" | "1Y")
              setHoverIndex(null)
            }}
          />
        }
      />

      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Revenue vs Budget Chart"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="actual-rev-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0866F5" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0866F5" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="forecast-rev-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((tick) => {
            const y = getY(tick)
            return (
              <g key={tick}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={width - margin.right}
                  y2={y}
                  stroke={tick === 0 ? "#CBD5E1" : "#E2E8F0"}
                  strokeWidth={tick === 0 ? 1.5 : 1}
                  strokeDasharray={tick === 0 ? undefined : "3 3"}
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

          {/* Shaded Forecast Corridor Background */}
          {forecastAreaPath && (
            <path
              d={forecastAreaPath}
              fill="url(#forecast-rev-gradient)"
              aria-hidden="true"
            />
          )}

          {/* Actual Revenue Area Fill */}
          {actualAreaPath && (
            <path
              d={actualAreaPath}
              fill="url(#actual-rev-gradient)"
              aria-hidden="true"
            />
          )}

          {/* Budget Target Line (Dashed Slate) */}
          {targetPath && (
            <path
              d={targetPath}
              fill="none"
              stroke="#94A3B8"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Forecast Line (Dashed Emerald) */}
          {forecastPath && (
            <path
              d={forecastPath}
              fill="none"
              stroke="#10B981"
              strokeWidth={2.25}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          )}

          {/* Actual Revenue Line (Solid Royal Blue) */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#0866F5"
              strokeWidth={2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Forecast Boundary Marker Line */}
          <line
            x1={boundaryX}
            y1={margin.top}
            x2={boundaryX}
            y2={baselineY}
            stroke="#0866F5"
            strokeWidth={1.5}
            strokeDasharray="2 2"
            opacity={0.5}
          />

          {/* Points on Actual Series */}
          {actualPoints.map((pt, i) => {
            const isCurrentMonth = i === forecastStartIndex
            const isHovered = hoverIndex === i

            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isCurrentMonth ? 6 : isHovered ? 5.5 : 3.5}
                  fill={isCurrentMonth ? "#0866F5" : "white"}
                  stroke="#0866F5"
                  strokeWidth={isCurrentMonth ? 2.5 : 2}
                  className="transition-all duration-150"
                />
                {isCurrentMonth && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={9}
                    fill="none"
                    stroke="#0866F5"
                    strokeWidth={1.5}
                    opacity={0.35}
                  />
                )}
              </g>
            )
          })}

          {/* Points on Forecast Series */}
          {forecastPoints.slice(1).map((pt, i) => {
            const globalIdx = forecastStartIndex + 1 + i
            const isHovered = hoverIndex === globalIdx

            return (
              <circle
                key={`forecast-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5 : 3.5}
                fill="#DCFCE7"
                stroke="#10B981"
                strokeWidth={2}
              />
            )
          })}

          {/* Invisible interactive hover targets */}
          {labels.map((_, i) => {
            const x = getX(i)
            const isHovered = hoverIndex === i

            return (
              <g key={`hitbox-${i}`}>
                {isHovered && (
                  <line
                    x1={x}
                    y1={margin.top}
                    x2={x}
                    y2={baselineY}
                    stroke="#0866F5"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={0.7}
                  />
                )}
                <rect
                  x={x - plotWidth / (labels.length * 2)}
                  y={margin.top}
                  width={plotWidth / labels.length}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              </g>
            )
          })}

          {/* X Axis Labels */}
          {labels.map((label, i) => {
            const x = getX(i)
            const isCurrent = i === forecastStartIndex
            const isFuture = i > forecastStartIndex

            return (
              <g key={label} transform={`translate(${x}, ${height - 20})`}>
                <text
                  textAnchor="middle"
                  className={`text-[11px] ${
                    isCurrent
                      ? "font-bold fill-[#0866F5]"
                      : isFuture
                      ? "font-semibold fill-[#10B981]"
                      : "font-medium fill-[#64748B]"
                  }`}
                >
                  {label}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && (
          <div
            className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#DCE4F0] bg-white p-3 text-xs shadow-md animate-in fade-in-50 duration-150"
            role="status"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#090B10]">
                {labels[hoverIndex]}
              </span>
              {hoverIndex === forecastStartIndex && (
                <span className="rounded bg-[#E8F1FE] px-1.5 py-0.5 text-[10px] font-bold text-[#0866F5]">
                  Current Fiscal Run
                </span>
              )}
              {hoverIndex > forecastStartIndex && (
                <span className="rounded bg-[#DCFCE7] px-1.5 py-0.5 text-[10px] font-bold text-[#15803D]">
                  Forecast Extrapolation
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {hoverIndex <= forecastStartIndex && (
                <span className="font-semibold text-[#0866F5]">
                  Actual: {formatINR(actual[hoverIndex])}
                </span>
              )}
              {hoverIndex > forecastStartIndex && forecast[hoverIndex] !== null && (
                <span className="font-semibold text-[#10B981]">
                  Forecasted: {formatINR(forecast[hoverIndex]!)}
                </span>
              )}
              <span className="text-[#64748B]">
                Budget Target: {formatINR(target[hoverIndex])}
              </span>
              {hoverIndex <= forecastStartIndex && (
                <span
                  className={`font-semibold ${
                    actual[hoverIndex] >= target[hoverIndex]
                      ? "text-[#15803D]"
                      : "text-[#B91C1C]"
                  }`}
                >
                  Variance:{" "}
                  {actual[hoverIndex] >= target[hoverIndex] ? "+" : ""}
                  {formatINR(actual[hoverIndex] - target[hoverIndex])}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Chart Legends & Takeaway */}
      <CardFooter className="pt-3">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <LegendItem label="Actual Revenue" shape="dash" color="#0866F5" />
            <LegendItem label="Target Budget" shape="dash" color="#94A3B8" />
            <LegendItem label="CAGR Forecast Corridor" shape="dash" color="#10B981" />
          </div>
          <span className="text-[11px] font-medium text-[#64748B]">
            Current Run: ₹{formatINRCompact(actual[forecastStartIndex], 1)} (+5.6% vs target)
          </span>
        </div>
      </CardFooter>
    </AdminCard>
  )
}
