import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { TASKS } from "@/hooks/useBuildSequence"

/** Extra chart points uncovered as each task lands. */
const CHART_BY_STAGE = [
  "M 0 34 Q 20 30, 36 31",
  "M 0 34 Q 20 30, 36 31 T 70 20",
  "M 0 34 Q 20 30, 36 31 T 70 20 T 100 7",
]

export const BuildPanel: React.FC<{
  done: number
  pct: number
  className?: string
}> = ({ done: initialDone, pct: initialPct, className }) => {
  const [manualDone, setManualDone] = useState<number | null>(null)
  const [switchActive, setSwitchActive] = useState<boolean>(true)

  const effectiveDone = manualDone !== null ? manualDone : initialDone
  const effectivePct = manualDone !== null ? Math.round((manualDone / TASKS.length) * 100) : initialPct
  const stage = Math.max(0, Math.min(effectiveDone, 3))

  const handleTaskClick = (index: number) => {
    // If clicking on a task, toggle up to that index
    if (manualDone === index + 1) {
      setManualDone(index)
    } else {
      setManualDone(index + 1)
    }
  }

  return (
    <div className={cn("flex h-full flex-col bg-white select-none", className)}>
      {/* Titlebar */}
      <div className="flex h-7 shrink-0 items-center justify-between bg-[#090B10] px-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-10 rounded-xs bg-white/85" />
          <div className="h-1.5 w-4 rounded-xs bg-white/25" />
        </div>
        <span className="ks-pulse h-1.5 w-1.5 rounded-full bg-[#0866F5]" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
        {/* Headline figure with tactile interactive status */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[15px] font-extrabold leading-none tracking-[-0.02em] text-[#090B10] tabular-nums"
              aria-hidden="true"
            >
              {effectivePct}
            </span>
            <span className="text-[7px] font-semibold leading-none text-[#64748B]">%</span>
          </div>
          <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#0866F5]">
            {effectiveDone === TASKS.length ? "System Live" : "Pipeline Active"}
          </span>
        </div>

        {/* Progress hairline under the figure */}
        <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-[#EEF2F7]">
          <div
            className="h-full rounded-full bg-[#0866F5] transition-[width] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{ width: `${effectivePct}%` }}
          />
        </div>

        {/* Chart re-draws dynamically to the ratio */}
        <div className="relative mt-2 h-11 w-full">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="h-px w-full bg-[#E5E7EB]" />
            <div className="h-px w-full bg-[#E5E7EB]" />
            <div className="h-px w-full bg-[#E5E7EB]" />
          </div>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="relative h-full w-full">
            <defs>
              <linearGradient id="ks-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0866F5" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0866F5" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${CHART_BY_STAGE[stage]} L 100 40 L 0 40 Z`}
              fill="url(#ks-area)"
              className="transition-opacity duration-500"
              opacity={stage === 0 ? 0 : 1}
            />
            <path
              d={CHART_BY_STAGE[stage]}
              fill="none"
              stroke="#0866F5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            />
          </svg>
          {/* Leading marker */}
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <circle
              cx={stage >= 3 ? 100 : stage === 2 ? 70 : stage === 1 ? 36 : 0}
              cy={stage >= 3 ? 7 : stage === 2 ? 20 : 34}
              r="3"
              fill="#FFFFFF"
              stroke="#0866F5"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            />
          </svg>
        </div>

        {/* Pipeline: Clickable interactive tasks */}
        <div className="my-1.5 flex flex-col gap-1.5">
          {TASKS.map((task, i) => {
            const isDone = i < effectiveDone
            const isActive = i === effectiveDone && effectiveDone < TASKS.length
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => handleTaskClick(i)}
                className="flex items-center gap-2 group cursor-pointer text-left w-full py-0.5"
                title={`Click to toggle ${task.label}`}
              >
                <span
                  className={cn(
                    "flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border transition-all duration-300 group-hover:border-[#0866F5]",
                    isDone
                      ? "border-[#0866F5] bg-[#0866F5]"
                      : isActive
                        ? "border-[#0866F5] bg-[#E8F1FE]"
                        : "border-[#D8DEE8] bg-transparent"
                  )}
                >
                  {isDone && (
                    <svg viewBox="0 0 12 12" className="h-2 w-2 text-white" aria-hidden="true">
                      <path
                        d="M 2 6 L 5 9 L 10 3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ks-tick"
                      />
                    </svg>
                  )}
                  {isActive && <span className="ks-spin-dot h-1.5 w-1.5 rounded-full bg-[#0866F5]" />}
                </span>
                <span
                  className={cn(
                    "h-1.5 rounded-xs transition-colors duration-300",
                    task.w,
                    isDone ? "bg-[#090B10]" : "bg-[#D8DEE8]"
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Footer with Interactive Toggle Switch */}
        <div className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] pt-2">
          <div className="h-1.5 w-8 rounded-xs bg-[#D8DEE8]" />
          <div className="flex items-end gap-[3px]">
            {[effectiveDone >= 1, effectiveDone >= 2, effectiveDone >= 3].map((on, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-[1px] transition-all duration-300",
                  i === 0 && "h-1.5",
                  i === 1 && "h-2.5",
                  i === 2 && "h-3.5",
                  on ? "bg-[#0866F5]" : "bg-[#D3E4FD]"
                )}
              />
            ))}
          </div>

          {/* Clickable Toggle Switch */}
          <button
            type="button"
            onClick={() => setSwitchActive(!switchActive)}
            className={cn(
              "flex h-4 w-7 items-center rounded-full p-0.5 transition-colors duration-300 cursor-pointer",
              switchActive && effectiveDone === TASKS.length
                ? "justify-end bg-[#0866F5]"
                : switchActive
                  ? "justify-end bg-[#0866F5]/80"
                  : "justify-start bg-[#D8DEE8]"
            )}
            title="Toggle System Switch"
          >
            <div className="h-3 w-3 rounded-full bg-white shadow-xs transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
