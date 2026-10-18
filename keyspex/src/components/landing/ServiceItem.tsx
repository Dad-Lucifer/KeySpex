import React, { useState, useRef, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ServiceItemProps {
  index: string
  title: string
  tagline: string
  description: string
  benefit: string
  tags: string[]
  href: string
  isFirst?: boolean
}

// ─── SVG sketches per service ─────────────────────────────────────────────────
// Each is a minimal line-art icon. One element is brand blue; rest are ink.
const renderSketch = (index: string) => {
  switch (index) {
    // 01 — Portfolio Website: browser frame
    case "01":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <rect x="2" y="6" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="15" x2="42" y2="15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="10.5" r="1.5" fill="currentColor" />
          <circle cx="13" cy="10.5" r="1.5" fill="currentColor" />
          <circle cx="18" cy="10.5" r="1.5" fill="currentColor" />
          <line x1="8" y1="23" x2="28" y2="23" stroke="#0866F5" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="29" x2="19" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
        </svg>
      )
    // 02 — Business Dashboard: chart bars
    case "02":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <rect x="3" y="28" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="20" width="8" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="25" y="13" width="8" height="25" rx="1.5" stroke="#0866F5" strokeWidth="2" />
          <rect x="36" y="6" width="5" height="32" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="3" y1="40" x2="41" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    // 03 — Store Management: shelf / inventory
    case "03":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <line x1="4" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="22" x2="40" y2="22" stroke="#0866F5" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="34" x2="40" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="10" x2="6" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="10" x2="38" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="10" y="13" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.4" />
          <rect x="24" y="13" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.4" />
          <rect x="10" y="25" width="10" height="6" rx="1" stroke="#0866F5" strokeWidth="1.5" strokeOpacity="0.7" />
        </svg>
      )
    // 04 — Google Business SEO: map pin / location
    case "04":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M22 4C16.48 4 12 8.48 12 14C12 21.5 22 38 22 38C22 38 32 21.5 32 14C32 8.48 27.52 4 22 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="22" cy="14" r="4.5" stroke="#0866F5" strokeWidth="2" />
        </svg>
      )
    // 05 — Social Media Marketing: connected nodes / feed
    case "05":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="8" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="36" cy="10" r="4" stroke="#0866F5" strokeWidth="2" />
          <circle cx="36" cy="34" r="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="20" x2="32" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="24" x2="32" y2="32" stroke="#0866F5" strokeWidth="2" strokeLinecap="round" className="transition-colors duration-300 group-hover:stroke-[#0866F5]" />
        </svg>
      )
    // 06 — Campaigns: megaphone / broadcast
    case "06":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M8 17H16L34 8V36L16 27H8V17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="16" y1="17" x2="16" y2="27" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 27L10 36H16L14 27" stroke="#0866F5" strokeWidth="2" strokeLinejoin="round" />
          <line x1="38" y1="22" x2="41" y2="22" stroke="#0866F5" strokeWidth="2" strokeLinecap="round" />
          <line x1="37" y1="17" x2="40" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
          <line x1="37" y1="27" x2="40" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
      )
    // 07 — Graphic Design: pen tool / shape
    case "07":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <rect x="6" y="6" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="24" y="6" width="14" height="14" rx="2" stroke="#0866F5" strokeWidth="2" />
          <rect x="6" y="24" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="31" cy="31" r="7" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="31" cy="31" r="3" fill="#0866F5" fillOpacity="0.25" stroke="#0866F5" strokeWidth="1.5" />
        </svg>
      )
    // 08 — Video Editing: film / play
    case "08":
      return (
        <svg className="h-11 w-11 text-[#090B10] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <rect x="3" y="10" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M31 16L41 11V33L31 28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 17L21.5 22L13 27V17Z" fill="#0866F5" fillOpacity="0.2" stroke="#0866F5" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export const ServiceItem: React.FC<ServiceItemProps> = ({
  index,
  title,
  tagline,
  description,
  benefit,
  tags,
  href,
  isFirst = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({ ...prev, active: false }))
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex flex-col justify-between pt-8 pb-6 transition-all duration-300",
        !isFirst && "lg:border-l lg:border-[#E5E7EB] lg:pl-10"
      )}
    >
      {/* Radial cursor spotlight */}
      {mousePos.active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-lg"
          style={{
            background: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, rgba(8,102,245,0.05), transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* 2px top rule: static blue on mobile, hover-sweep on desktop */}
        <div className="relative mb-6 sm:mb-8 h-[2px] w-full overflow-hidden bg-[#E5E7EB]">
          <div className="absolute inset-0 bg-[#0866F5] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] translate-x-0 sm:-translate-x-full sm:group-hover:translate-x-0" />
        </div>

        {/* Icon sketch */}
        <div className="mb-5 sm:mb-6 opacity-85 transition-opacity duration-200 group-hover:opacity-100">
          {renderSketch(index)}
        </div>

        {/* Index */}
        <span className="font-mono text-[13px] font-semibold tabular-nums tracking-[0.14em] text-[#0866F5]">
          {index}
        </span>

        {/* Title */}
        <h3 className="mt-3 sm:mt-4 text-[20px] sm:text-[22px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#090B10] transition-colors duration-200 group-hover:text-[#0866F5]">
          {title}
        </h3>

        {/* Tagline — who it's for */}
        <p className="mt-2 text-[13px] font-medium italic leading-[1.5] text-[#64748B]">
          {tagline}
        </p>

        {/* Description */}
        <p className="mt-3 max-w-[28rem] text-[14px] sm:text-[15px] leading-[1.72] text-[#334155]">
          {description}
        </p>

        {/* Benefit callout */}
        <div className="mt-4 inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-px w-4 shrink-0 bg-[#0866F5]" />
          <span className="text-[13px] font-semibold text-[#090B10]">{benefit}</span>
        </div>

        {/* Scope tags */}
        <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-0.5 text-[11px] font-medium text-[#64748B] transition-colors duration-200 group-hover:border-[#0866F5]/30 group-hover:text-[#090B10]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA — min-height ensures 44px touch target */}
      <div className="relative z-10 mt-6 sm:mt-8 pt-3 sm:pt-4 min-h-[44px] flex items-center">
        <Button asChild variant="link" className="p-0 text-[15px] font-semibold text-[#090B10]">
          <a href={href} aria-label={`Start a conversation about ${title}`} className="inline-flex items-center gap-1.5">
            <span>Get Started</span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </a>
        </Button>
      </div>
    </div>
  )
}
