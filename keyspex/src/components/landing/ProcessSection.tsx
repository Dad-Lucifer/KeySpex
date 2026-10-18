import React, { useState } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ProcessStep } from "./ProcessStep"
import { processStepsData } from "@/data/process"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

const DELIVERABLES: Record<string, string[]> = {
  "01": ["Objective & Goal Discovery", "User Journey Mapping", "Technical Requirements"],
  "02": ["System Architecture", "Wireframe Specifications", "Release Milestones"],
  "03": ["Modular Component Build", "Responsive UI Implementation", "Performance Tuning"],
  "04": ["Lighthouse Performance Audit", "Cross-Browser Verification", "Production Handoff"],
}

export const ProcessSection: React.FC = () => {
  const revealRef = useReveal()
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0)

  const activeStep = processStepsData[activeStepIdx]
  const deliverables = DELIVERABLES[activeStep.index] || []

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="w-full bg-white py-16 sm:py-24 lg:py-36 scroll-mt-20"
    >
      <PageContainer>
        <div ref={revealRef} className="reveal flex flex-col gap-10 sm:gap-12 sm:gap-16">
          {/* Section Heading */}
          <SectionHeading
            titleId="process-heading"
            eyebrow="How We Work"
            title="A clear path from idea to execution."
          />

          {/* Desktop Horizontal Sequence (≥ lg) */}
          <ol className="hidden lg:grid lg:grid-cols-4 gap-8">
            {processStepsData.map((step, idx) => (
              <ProcessStep
                key={step.index}
                index={step.index}
                title={step.title}
                description={step.description}
                isActive={idx === activeStepIdx}
                isPast={idx < activeStepIdx}
                isLast={idx === processStepsData.length - 1}
                onSelect={() => setActiveStepIdx(idx)}
              />
            ))}
          </ol>

          {/* Interactive Phase Deliverables Console (≥ lg) */}
          <div className="hidden lg:flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-semibold text-[#0866F5]">
                PHASE {activeStep.index} FOCUS:
              </span>
              <span className="text-[14px] font-bold text-[#090B10]">
                {activeStep.title} Deliverables
              </span>
            </div>

            <div className="flex items-center gap-6">
              {deliverables.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0866F5]" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-[#334155]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Vertical Sequence (< lg) */}
          <ol className="relative flex flex-col gap-8 sm:gap-10 pl-2 lg:hidden">
            {processStepsData.map((step, idx) => {
              const isLast = idx === processStepsData.length - 1
              const isActive = idx === activeStepIdx
              const isPast = idx < activeStepIdx

              return (
                <li
                  key={step.index}
                  onClick={() => setActiveStepIdx(idx)}
                  className="relative flex items-start list-none pl-8 cursor-pointer select-none"
                >
                  {/* Left Rail & Ring */}
                  <div className="absolute left-0 top-1.5 flex flex-col items-center h-full">
                    <div
                      className={cn(
                        "relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-300",
                        isActive
                          ? "border-[#0866F5] scale-125 shadow-xs"
                          : isPast
                            ? "border-[#0866F5] bg-[#0866F5]"
                            : "border-[#A9CBFB]"
                      )}
                    >
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#0866F5]" />}
                      {isPast && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>

                    {!isLast && (
                      <div
                        className={cn(
                          "w-[1.5px] flex-1 border-l border-dashed mt-1 transition-colors duration-300",
                          isPast || isActive ? "border-[#0866F5]" : "border-[#A9CBFB]"
                        )}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[13px] font-semibold tabular-nums text-[#0866F5] tracking-[0.14em]">
                        {step.index}
                      </span>
                      <h3
                        className={cn(
                          "text-[20px] sm:text-[22px] font-bold transition-colors duration-200",
                          isActive ? "text-[#0866F5]" : "text-[#090B10]"
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-[16px] leading-[1.65] text-[#334155] max-w-[24rem]">
                      {step.description}
                    </p>

                    {/* Expandable phase deliverable tags on mobile */}
                    {isActive && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {deliverables.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#0866F5]/20 bg-[#E8F1FE] px-2.5 py-1 text-[11px] font-medium text-[#0866F5]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </PageContainer>
    </section>
  )
}
