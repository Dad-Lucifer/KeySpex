import React, { useState } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"

const PRINCIPLES = [
  {
    title: "Business-first thinking",
    subtext: "Strategic Value",
  },
  {
    title: "Purpose-built solutions",
    subtext: "Tailored Architecture",
  },
  {
    title: "Quality-driven execution",
    subtext: "Precision & Rigor",
  },
]

export const TrustStrip: React.FC = () => {
  const revealRef = useReveal()
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <section
      aria-label="Core Principles"
      className="w-full border-t border-b border-[#E5E7EB] bg-white py-8 sm:py-10 lg:py-12"
    >
      <PageContainer>
        <div
          ref={revealRef}
          className="reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-12"
        >
          {/* Left: Statement */}
          <div className="max-w-[22rem]">
            <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold leading-tight text-[#090B10]">
              <span className="block">Built around your business.</span>
              <span className="block">
                Designed for your next stage of growth.
              </span>
            </p>
          </div>

          {/* Right: Tactile Principles with interactive focus response */}
          <div className="flex flex-col border-t border-[#E5E7EB] pt-6 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0 gap-4 sm:gap-6 lg:gap-8">
            {PRINCIPLES.map((item, idx) => (
              <React.Fragment key={item.title}>
                {idx > 0 && (
                  <>
                    <span
                      className="hidden lg:block h-6 w-[1px] bg-[#E5E7EB]"
                      aria-hidden="true"
                    />
                    <div className="h-[1px] w-full bg-[#E5E7EB] sm:hidden" />
                  </>
                )}

                <div
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                  className="group relative flex flex-col cursor-default py-1 transition-all duration-200"
                >
                  <span
                    className={cn(
                      "text-[15px] font-medium transition-colors duration-200",
                      activeIdx === idx ? "text-[#090B10] font-semibold" : "text-[#334155]"
                    )}
                  >
                    {item.title}
                  </span>

                  {/* Subtext: always visible on mobile, hover-reveal on desktop */}
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider text-[#0866F5] font-semibold transition-all duration-200",
                      // Always visible on mobile (no hover available)
                      "opacity-100 max-h-4 translate-y-0",
                      // On sm+ screens: hide unless hovered
                      activeIdx === idx
                        ? "sm:opacity-100 sm:max-h-4 sm:translate-y-0"
                        : "sm:opacity-0 sm:max-h-0 sm:-translate-y-1 sm:overflow-hidden"
                    )}
                  >
                    {item.subtext}
                  </span>

                  {/* Bottom indicator underline */}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[1.5px] bg-[#0866F5] transition-all duration-300",
                      activeIdx === idx ? "w-full" : "w-0"
                    )}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
