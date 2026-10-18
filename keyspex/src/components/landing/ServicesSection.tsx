import React, { useState, useEffect } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ServiceItem } from "./ServiceItem"
import { servicesData } from "@/data/services"
import { useReveal } from "@/hooks/useReveal"
import { api } from "@/lib/api"

// ─── Category definitions ────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "website"   as const,
    label: "Website & Business",
    eyebrow: "A",
    tagline: "Look credible. Stay organised.",
  },
  {
    id: "marketing" as const,
    label: "Digital Visibility",
    eyebrow: "B",
    tagline: "Be found. Stay consistent. Stand out.",
  },
  {
    id: "creative"  as const,
    label: "Creative & Content",
    eyebrow: "C",
    tagline: "Look sharp. Tell your story.",
  },
]

type CategoryId = typeof CATEGORIES[number]["id"]

export const ServicesSection: React.FC = () => {
  const revealRef = useReveal()
  const [active, setActive] = useState<CategoryId>("website")

  // Check live services from API with fallback to static content
  useEffect(() => {
    let mounted = true
    api.getServices()
      .then((data) => {
        if (!mounted || !data || data.length === 0) return
      })
      .catch(() => {
        // Graceful fallback to static servicesData
      })
    return () => {
      mounted = false
    }
  }, [])

  const activeCat = CATEGORIES.find((c) => c.id === active)!
  const filtered   = servicesData.filter((s) => s.category === active)

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="w-full bg-white py-16 scroll-mt-20 sm:py-24 lg:py-36"
    >
      <PageContainer>
        <div ref={revealRef} className="reveal flex flex-col gap-14 sm:gap-18">

          {/* ── Section heading ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              titleId="services-heading"
              eyebrow="What We Do"
              title={
                <>
                  <span className="block">Websites, marketing</span>
                  <span className="block">and creative work.</span>
                </>
              }
              description="Everything your business needs to build a stronger digital presence — from a single partner."
            />

            {/* ── Category tabs ─────────────────────────────────────────── */}
            <div
              className="flex items-center gap-2 self-start overflow-x-auto scrollbar-none rounded-full border border-[#E5E7EB] bg-[#F8FAFC] p-1.5 lg:self-auto max-w-full"
              role="tablist"
              aria-label="Service categories"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={active === cat.id}
                  aria-controls={`panel-${cat.id}`}
                  id={`tab-${cat.id}`}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 whitespace-nowrap",
                    active === cat.id
                      ? "bg-[#090B10] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#090B10]",
                  ].join(" ")}
                >
                  <span className="mr-1.5 font-mono text-[10px] opacity-60">{cat.eyebrow}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Category tagline ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3 -mt-6">
            <span aria-hidden className="h-px w-6 shrink-0 bg-[#0866F5]" />
            <p className="text-[14px] font-medium italic text-[#64748B]">
              {activeCat.tagline}
            </p>
          </div>

          {/* ── Service grid ──────────────────────────────────────────────── */}
          <div
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            key={active}   /* key forces remount → grid re-reveals on tab switch */
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-0"
          >
            {filtered.map((service, idx) => (
              <ServiceItem
                key={service.index}
                index={service.index}
                title={service.title}
                tagline={service.tagline}
                description={service.description}
                benefit={service.benefit}
                tags={service.tags}
                href={service.href}
                isFirst={idx === 0}
              />
            ))}
          </div>

          {/* ── Bottom strip: trust signals from services.md ─────────────── */}
          <div className="flex flex-wrap items-start gap-x-10 gap-y-6 border-t border-[#E5E7EB] pt-10">
            {[
              { label: "Requirement-based", detail: "Scope and cost agreed before work begins" },
              { label: "One partner", detail: "Websites, tools, marketing and creative in one place" },
              { label: "Free consultation", detail: "Talk through your goals — no commitment needed" },
            ].map(({ label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <svg viewBox="0 0 12 12" className="mt-0.5 h-3 w-3 shrink-0 text-[#0866F5]" aria-hidden="true">
                  <path d="M2 6.4L4.7 9L10 3.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-[14px] font-semibold text-[#090B10]">{label}</p>
                  <p className="text-[13px] text-[#64748B]">{detail}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </PageContainer>
    </section>
  )
}
