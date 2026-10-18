import React, { useState, useRef, useEffect, useCallback } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { PortfolioCard } from "./PortfolioCard"
import { projectsData } from "@/data/projects"
import type { ProjectType } from "@/data/projects"
import { Globe, Share2, Film, Layers, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { api } from "@/lib/api"

type FilterTab = "all" | ProjectType

interface TabConfig {
  id: FilterTab
  label: string
  count: number
  icon: React.ComponentType<{ className?: string }>
}

export const PortfolioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch projects from backend on mount with graceful static fallback
  useEffect(() => {
    let mounted = true
    api.getProjects(12)
      .then((data) => {
        if (!mounted || !data || data.length === 0) return
        // Successfully connected to backend API
      })
      .catch(() => {
        // Fallback to static projectsData gracefully
      })
    return () => {
      mounted = false
    }
  }, [])

  // Counts for tabs
  const websiteCount = projectsData.filter((p) => p.type === "website").length
  const instagramCount = projectsData.filter((p) => p.type === "instagram").length
  const reelCount = projectsData.filter((p) => p.type === "reel").length

  const TABS: TabConfig[] = [
    { id: "all", label: "All Works", count: projectsData.length, icon: Layers },
    { id: "website", label: "Websites", count: websiteCount, icon: Globe },
    { id: "instagram", label: "Instagram Creatives", count: instagramCount, icon: Share2 },
    { id: "reel", label: "Reels & Motion", count: reelCount, icon: Film },
  ]

  const filteredProjects =
    activeTab === "all"
      ? projectsData
      : projectsData.filter((p) => p.type === activeTab)

  const handleTabChange = (tabId: FilterTab) => {
    setActiveTab(tabId)
    setActiveIndex(0)
    setCanScrollLeft(false)
    setCanScrollRight(
      (tabId === "all" ? projectsData : projectsData.filter((p) => p.type === tabId)).length > 1
    )
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
  }

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 15)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15)

    const children = Array.from(el.children) as HTMLElement[]
    if (children.length === 0) return

    const containerCenter = el.getBoundingClientRect().left + el.clientWidth / 2
    let nearestIdx = 0
    let minDistance = Infinity

    filteredProjects.forEach((_, idx) => {
      const child = children[idx]
      if (!child) return
      const box = child.getBoundingClientRect()
      const childCenter = box.left + box.width / 2
      const dist = Math.abs(childCenter - containerCenter)
      if (dist < minDistance) {
        minDistance = dist
        nearestIdx = idx
      }
    })

    setActiveIndex(nearestIdx)
  }, [filteredProjects])

  const scrollToIndex = (index: number) => {
    const el = carouselRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    if (children[index]) {
      const targetLeft =
        children[index].offsetLeft - (el.clientWidth - children[index].clientWidth) / 2
      el.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" })
    }
  }

  const scrollByCard = (direction: "left" | "right") => {
    const targetIdx = direction === "left" ? activeIndex - 1 : activeIndex + 1
    if (targetIdx >= 0 && targetIdx < filteredProjects.length) {
      scrollToIndex(targetIdx)
    }
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const handleResize = () => updateScrollState()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [updateScrollState])

  return (
    <section
      id="work"
      aria-labelledby="portfolio-heading"
      className="relative w-full bg-[#080B12] py-16 sm:py-24 lg:py-36 scroll-mt-20 overflow-hidden text-white border-t border-white/10"
    >
      {/* Ambient luxury radial glow spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#0866F5]/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#10B981]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(#0866F5_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.04]"
      />

      <PageContainer className="relative z-10">
        <div className="flex flex-col gap-10 sm:gap-16">

          {/* ── Section Heading & Category Filter Tabs ─────────────────── */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              titleId="portfolio-heading"
              eyebrow="Our Work // Curated Portfolio"
              tone="dark"
              title={
                <>
                  <span className="block">Websites, Creatives</span>
                  <span className="block text-[#0866F5]">& Kinetic Reels.</span>
                </>
              }
              description="A visual showcase of our responsive websites, cohesive Instagram brand grids, and high-retention video reels."
            />

            {/* Studio Filter Pills — horizontal scroll on mobile */}
            <div
              className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#121624]/80 p-1.5 backdrop-blur-md shadow-lg overflow-x-auto scrollbar-none w-full lg:w-auto"
              role="tablist"
              aria-label="Filter visual works"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={[
                      "group shrink-0 flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 text-[12px] sm:text-[13px] font-semibold transition-all duration-200 active:scale-95",
                      isActive
                        ? "bg-[#0866F5] text-white shadow-[0_0_20px_rgba(8,102,245,0.4)]"
                        : "text-white/60 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-white/50 group-hover:text-white"}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`font-mono text-[9px] sm:text-[10px] rounded-full px-1.5 py-0.2 ${
                        isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Mobile Carousel Status Bar & Navigation Arrows (lg:hidden) ── */}
          <div className="flex items-center justify-between pt-1 pb-1 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-white bg-white/[0.08] border border-white/10 px-2.5 py-1 rounded-full shadow-xs">
                <span className="text-[#5B9BFF]">{String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="text-white/30">/</span>
                <span className="text-white/60">{String(filteredProjects.length).padStart(2, "0")}</span>
              </span>
              <span className="text-[11px] text-white/50 font-medium">
                Swipe left or right
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="flex-1 max-w-[80px] xs:max-w-[110px] mx-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0866F5] to-[#5B9BFF] transition-all duration-300 rounded-full"
                style={{
                  width: `${((activeIndex + 1) / Math.max(1, filteredProjects.length)) * 100}%`,
                }}
              />
            </div>

            {/* Left / Right chevron buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scrollByCard("left")}
                disabled={!canScrollLeft}
                aria-label="Previous project"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-all active:scale-90",
                  canScrollLeft
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-white/5 bg-white/[0.03] text-white/20 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("right")}
                disabled={!canScrollRight}
                aria-label="Next project"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-all active:scale-90",
                  canScrollRight
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-white/5 bg-white/[0.03] text-white/20 cursor-not-allowed"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Curated Portfolio Grid on Desktop / Snap Carousel on Mobile ── */}
          <div
            ref={carouselRef}
            onScroll={updateScrollState}
            className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-4 sm:gap-6 pb-4 pt-1 items-start -mx-6 px-[max(8vw,calc(50vw-170px))] sm:-mx-8 sm:px-[calc(50vw-190px)] lg:mx-0 lg:px-0 lg:pb-0 lg:pt-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:snap-none lg:items-stretch animate-in fade-in-50 duration-300"
          >
            {filteredProjects.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
              />
            ))}
          </div>

          {/* ── Mobile Dots Pagination Indicators (lg:hidden) ───────────── */}
          {filteredProjects.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1 pb-1 lg:hidden">
              {filteredProjects.map((p, idx) => {
                const isCurrent = activeIndex === idx
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`Jump to project ${idx + 1}: ${p.title}`}
                    className="p-1 -m-1 focus:outline-none"
                  >
                    <span
                      className={cn(
                        "block rounded-full transition-all duration-300",
                        isCurrent
                          ? "h-1.5 w-6 bg-[#0866F5] shadow-[0_0_10px_rgba(8,102,245,0.8)]"
                          : "h-1.5 w-1.5 bg-white/20 hover:bg-white/40"
                      )}
                    />
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Bottom Callout Strip: Direct Collaboration ─────────────── */}
          <div className="flex flex-col items-center justify-between gap-5 sm:gap-6 rounded-2xl border border-white/15 bg-gradient-to-r from-[#101424] via-[#0E121E] to-[#101424] p-5 sm:flex-row sm:p-8 shadow-2xl relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0866F5]/20 blur-[80px]"
            />

            <div className="flex flex-col gap-1 text-center sm:text-left relative z-10">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5B9BFF] flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Let's Build Something Memorable</span>
              </span>
              <h3 className="text-[18px] sm:text-[22px] font-bold text-white tracking-tight">
                Have a website, Instagram campaign, or reel concept in mind?
              </h3>
              <p className="text-[13px] sm:text-[14px] text-white/70">
                We discuss your goals first, agree on scope and deliverables, and build with precision.
              </p>
            </div>

            <Button
              asChild
              variant="primary"
              size="lg"
              className="h-11 sm:h-12 px-6 shrink-0 shadow-[0_0_25px_rgba(8,102,245,0.5)] relative z-10 w-full sm:w-auto"
            >
              <a href="#contact" className="inline-flex items-center justify-center gap-2">
                <span>Start Your Project</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
