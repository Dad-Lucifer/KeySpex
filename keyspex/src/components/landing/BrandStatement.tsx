import React, { useState, useRef, useCallback } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { FacetBackdrop } from "@/components/layout/FacetBackdrop"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"

const principles = [
  {
    index: "01",
    title: "Purpose Before Complexity",
    description: "Every decision should serve a clear business objective.",
  },
  {
    index: "02",
    title: "Design With Intention",
    description: "Every interface should feel considered and easy to use.",
  },
  {
    index: "03",
    title: "Quality in Every Detail",
    description: "Every solution should reflect care, precision, and consistency.",
  },
]

export const BrandStatement: React.FC = () => {
  const revealRef = useReveal()
  const containerRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({ ...prev, active: false }))
  }, [])

  return (
    <section
      ref={containerRef}
      id="about"
      aria-labelledby="brand-heading"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#090B10] py-16 sm:py-24 lg:py-40 text-white scroll-mt-20 select-none"
    >
      {/* Subtle Ambient Refraction Tracking Cursor */}
      {mousePos.active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, rgba(8, 102, 245, 0.16), transparent 75%)`,
          }}
        />
      )}

      {/* Subtle Stroke-only Facets on Dark (§8.1) */}
      <FacetBackdrop tone="dark" />

      <PageContainer className="relative z-10">
        <div ref={revealRef} className="reveal flex flex-col">
          {/* Main Statement Headline & Lead (No eyebrow per §10.6) */}
          <div className="max-w-[56rem]">
            <h2
              id="brand-heading"
              className="text-[clamp(32px,1rem+4vw,72px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white [text-wrap:balance]"
            >
              <span className="block">Good technology should</span>
              <span className="block">
                make business <span className="text-[#0866F5]">simpler.</span>
              </span>
            </h2>

            <p className="mt-6 sm:mt-8 max-w-[36rem] text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed text-white/75 [text-wrap:pretty]">
              We focus on solutions that solve meaningful problems, respect your
              customers, and create lasting value.
            </p>
          </div>

          {/* 3 Principles with Interactive Cards */}
          <div className="mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {principles.map((p) => (
              <div
                key={p.index}
                className={cn(
                  "group relative flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 sm:p-7 transition-all duration-300",
                  "hover:border-[#0866F5]/50 hover:bg-white/[0.04] hover:-translate-y-1"
                )}
              >
                {/* 1px Hairline Top Rule — static blue on mobile, animated on desktop */}
                <div className="relative mb-5 h-[1.5px] w-full bg-white/[0.12] overflow-hidden">
                  <div className="absolute inset-0 bg-[#5B9BFF] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] translate-x-0 sm:-translate-x-full sm:group-hover:translate-x-0" />
                </div>

                <span className="font-mono text-[12px] font-semibold tabular-nums text-[#5B9BFF] tracking-[0.14em] mb-3">
                  {p.index}
                </span>

                <h3 className="text-[20px] sm:text-[22px] font-semibold leading-tight text-white tracking-[-0.015em] transition-colors duration-200 group-hover:text-white">
                  {p.title}
                </h3>

                <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.65] text-[#94A3B8] max-w-[22rem]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
