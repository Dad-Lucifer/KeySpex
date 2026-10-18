import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  Globe,
  LayoutDashboard,
  Store,
  Search,
  Share2,
  Megaphone,
  Palette,
  Film,
  CheckCircle2,
  ArrowUpRight,
  Laptop,
  Smartphone,
  Play,
  Pause,
  Grid,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Data mapped directly from services.md ──────────────────────────────────
export interface ServiceSpecimen {
  id: string
  num: string
  title: string
  shortLabel: string
  category: "systems" | "marketing" | "creative"
  categoryTitle: string
  forWho: string
  benefit: string
  metricLabel: string
  metricValue: string
  icon: React.ComponentType<{ className?: string }>
}

const SPECIMENS: ServiceSpecimen[] = [
  // ── A. Website & Business Solutions
  {
    id: "portfolio",
    num: "01",
    title: "Business Portfolio Website",
    shortLabel: "Portfolio Site",
    category: "systems",
    categoryTitle: "Website & Business",
    forWho: "Businesses hard to find or trust online",
    benefit: "A clear, credible first impression",
    metricLabel: "PageSpeed Index",
    metricValue: "99 / 100",
    icon: Globe,
  },
  {
    id: "dashboard",
    num: "02",
    title: "Business Dashboard",
    shortLabel: "Dashboard",
    category: "systems",
    categoryTitle: "Website & Business",
    forWho: "Data scattered across sheets & notes",
    benefit: "Visibility for everyday decisions",
    metricLabel: "Data Pipeline",
    metricValue: "Realtime Sync",
    icon: LayoutDashboard,
  },
  {
    id: "store",
    num: "03",
    title: "Store Management System",
    shortLabel: "Store POS",
    category: "systems",
    categoryTitle: "Website & Business",
    forWho: "Offline shops tracking stock by hand",
    benefit: "Clear picture of inventory & sales",
    metricLabel: "Internal Tooling",
    metricValue: "Inventory & POS",
    icon: Store,
  },

  // ── B. Digital Visibility & Marketing
  {
    id: "seo",
    num: "04",
    title: "Google Business SEO",
    shortLabel: "Google SEO",
    category: "marketing",
    categoryTitle: "Digital Visibility",
    forWho: "Incomplete or outdated Google listing",
    benefit: "A stronger local online presence",
    metricLabel: "Local Pack",
    metricValue: "#1 Verified",
    icon: Search,
  },
  {
    id: "social",
    num: "05",
    title: "Social Media Marketing",
    shortLabel: "Social Media",
    category: "marketing",
    categoryTitle: "Digital Visibility",
    forWho: "Feeds that look mismatched or stop",
    benefit: "Stronger brand recognition over time",
    metricLabel: "Brand Coherence",
    metricValue: "99.4% On-Tone",
    icon: Share2,
  },
  {
    id: "campaigns",
    num: "06",
    title: "Social Media Campaigns",
    shortLabel: "Campaigns",
    category: "marketing",
    categoryTitle: "Digital Visibility",
    forWho: "Launches & festival promotions",
    benefit: "A promotion with a plan behind it",
    metricLabel: "Milestone Flow",
    metricValue: "Goal → Launch",
    icon: Megaphone,
  },

  // ── C. Creative & Content
  {
    id: "graphic",
    num: "07",
    title: "Graphic Designing",
    shortLabel: "Graphic Design",
    category: "creative",
    categoryTitle: "Creative & Content",
    forWho: "Materials looking mismatched",
    benefit: "A polished, cohesive look",
    metricLabel: "Asset System",
    metricValue: "Vector & Print",
    icon: Palette,
  },
  {
    id: "video",
    num: "08",
    title: "Video Editing",
    shortLabel: "Video Editing",
    category: "creative",
    categoryTitle: "Creative & Content",
    forWho: "Footage without polished execution",
    benefit: "Clear, engaging content for channels",
    metricLabel: "Render Spec",
    metricValue: "4K UHD 60FPS",
    icon: Film,
  },
]

const CATEGORIES = [
  { id: "systems" as const, label: "Web & Business", count: "01–03" },
  { id: "marketing" as const, label: "Visibility", count: "04–06" },
  { id: "creative" as const, label: "Creative", count: "07–08" },
]

export const HeroStudioArtifact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string>("portfolio")
  const [activeCategory, setActiveCategory] = useState<"systems" | "marketing" | "creative">("systems")
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false })
  const [isHovered, setIsHovered] = useState(false)
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop")
  const [showGrid, setShowGrid] = useState(true)
  const [isPlayingAudio, setIsPlayingAudio] = useState(true)
  const [campaignStep, setCampaignStep] = useState<number>(2) // 0: Goal, 1: Plan, 2: Create, 3: Launch

  const currentSpecimen = SPECIMENS.find((s) => s.id === activeId) || SPECIMENS[0]
  const currentCategorySpecimens = SPECIMENS.filter((s) => s.category === activeCategory)

  // 3D Perspective Tilt & Specular Cursor Light
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width
    const yRatio = (e.clientY - rect.top) / rect.height

    const tiltX = (yRatio - 0.5) * -7
    const tiltY = (xRatio - 0.5) * 7

    setTilt({ x: tiltX, y: tiltY })
    setSpotlight({
      x: Math.round(xRatio * 100),
      y: Math.round(yRatio * 100),
      active: true,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setSpotlight((prev) => ({ ...prev, active: false }))
    setIsHovered(false)
  }, [])

  // Auto-advance through specimens gently unless user is hovering/interacting
  useEffect(() => {
    if (isHovered) return

    const timer = setInterval(() => {
      setActiveId((prevId) => {
        const currentIndex = SPECIMENS.findIndex((s) => s.id === prevId)
        const nextIndex = (currentIndex + 1) % SPECIMENS.length
        const next = SPECIMENS[nextIndex]
        setActiveCategory(next.category)
        return next.id
      })
    }, 4800)

    return () => clearInterval(timer)
  }, [isHovered])

  // When switching category tab manually, activate the first specimen in that category
  const handleCategorySwitch = (catId: "systems" | "marketing" | "creative") => {
    setActiveCategory(catId)
    const firstInCat = SPECIMENS.find((s) => s.category === catId)
    if (firstInCat) setActiveId(firstInCat.id)
  }

  return (
    <div className="relative w-full max-w-[420px] xs:max-w-[480px] sm:max-w-[560px] mx-auto lg:max-w-none ks-perspective">
      {/* ── Soft Sapphire Ambient Back-bloom ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl opacity-70 blur-3xl transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(8,102,245,0.22) 0%, transparent 70%)",
        }}
      />

      {/* ── Main Obsidian Glass Card ─────────────────────────────────── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          // Only apply 3D tilt on pointer (non-touch) devices
          transform: typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : "none",
          transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0B0D14]/90 p-4 sm:p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_80px_rgba(8,102,245,0.14)] backdrop-blur-xl sm:p-6 ks-preserve-3d"
      >
        {/* Dynamic Specular Spotlight Sheen */}
        {spotlight.active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 320px at ${spotlight.x}% ${spotlight.y}%, rgba(255, 255, 255, 0.08), rgba(8, 102, 245, 0.12) 40%, transparent 70%)`,
            }}
          />
        )}

        {/* ── Header Telemetry & Category Navigation ──────────────────── */}
        <div className="relative z-20 flex flex-col gap-3.5 border-b border-white/[0.08] pb-4">
          <div className="flex items-center justify-between">
            {/* Live studio status beacon */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0866F5] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0866F5]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                KeySpex Studio // Capabilities
              </span>
            </div>

            {/* Micro latency / verified tag */}
            <div className="hidden items-center gap-1.5 font-mono text-[10px] text-white/40 sm:flex">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span>Tailored Scope</span>
            </div>
          </div>

          {/* 3 Pillar Category Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/[0.06] bg-black/40 p-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySwitch(cat.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg py-2 px-1 text-center transition-all duration-300",
                    isActive
                      ? "bg-[#0866F5] text-white shadow-[0_2px_12px_rgba(8,102,245,0.4)]"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <span className="text-[11px] font-semibold tracking-tight sm:text-[12px]">
                    {cat.label}
                  </span>
                  <span className="font-mono text-[9px] opacity-70">
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Secondary Service Pill Selector ─────────────────────────── */}
        <div className="relative z-20 my-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {currentCategorySpecimens.map((item) => {
            const isSelected = activeId === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "group flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
                  isSelected
                    ? "border-[#0866F5]/60 bg-[#0866F5]/15 text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:border-white/[0.14] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-colors",
                    isSelected ? "text-[#5B9BFF]" : "text-white/40 group-hover:text-white"
                  )}
                />
                <span className="font-mono text-[10px] text-[#5B9BFF]">{item.num}</span>
                <span>{item.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* ── Live Interactive Specimen Display ────────────────────────── */}
        <div className="relative z-20 min-h-[200px] sm:min-h-[250px] rounded-xl border border-white/[0.08] bg-black/60 p-3 sm:p-4 transition-all duration-300">

          {/* SPECIMEN 01: Business Portfolio Website */}
          {activeId === "portfolio" && (
            <div className="flex flex-col gap-3.5">
              {/* Browser chrome header with viewport toggle */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[10px] text-white/40">keyspex.in/preview</span>
                </div>
                <div className="flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.03] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewportMode("desktop")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      viewportMode === "desktop" ? "bg-[#0866F5] text-white" : "text-white/40 hover:text-white"
                    )}
                    title="Desktop preview"
                  >
                    <Laptop className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode("mobile")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      viewportMode === "mobile" ? "bg-[#0866F5] text-white" : "text-white/40 hover:text-white"
                    )}
                    title="Mobile preview"
                  >
                    <Smartphone className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Mockup layout */}
              <div className={cn(
                "mx-auto flex flex-col justify-between rounded-lg border border-white/[0.08] bg-[#0E111A] p-3 transition-all duration-300",
                viewportMode === "desktop" ? "w-full" : "w-[68%]"
              )}>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-xs bg-[#0866F5]" />
                    <div className="h-1.5 w-10 rounded-xs bg-white/60" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-1.5 w-6 rounded-xs bg-white/20" />
                    <div className="h-1.5 w-6 rounded-xs bg-white/20" />
                    <div className="h-1.5 w-8 rounded-xs bg-[#0866F5]/80" />
                  </div>
                </div>

                <div className="my-3 grid grid-cols-12 items-center gap-3">
                  <div className="col-span-8 flex flex-col gap-1.5">
                    <div className="h-3 w-full rounded-xs bg-white/90" />
                    <div className="h-3 w-3/4 rounded-xs bg-white/90" />
                    <div className="h-1.5 w-1/2 rounded-xs bg-white/40" />
                    <div className="mt-1 flex gap-2">
                      <div className="h-5 w-16 rounded-md bg-[#0866F5] shadow-xs" />
                      <div className="h-5 w-12 rounded-md border border-white/20" />
                    </div>
                  </div>
                  <div className="col-span-4 h-16 rounded-md border border-[#0866F5]/30 bg-[#0866F5]/10 p-2 flex items-center justify-center">
                    <div className="text-center font-mono text-[9px] text-[#5B9BFF]">
                      <span className="block text-[14px] font-bold text-white">0.3s</span>
                      Fast Load
                    </div>
                  </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-2 text-center font-mono text-[9px]">
                  <div>
                    <span className="text-emerald-400 font-bold">100</span>
                    <span className="block text-white/40">Performance</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">0.00</span>
                    <span className="block text-white/40">Layout Shift</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">100%</span>
                    <span className="block text-white/40">Mobile Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPECIMEN 02: Business Dashboard */}
          {activeId === "dashboard" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/40">METRICS ENGINE</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                    Live Telemetry
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white/50">PostgreSQL · Realtime</span>
              </div>

              {/* KPI Header */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="font-mono text-[9px] text-white/40 uppercase">Monthly Volume</span>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-[18px] font-extrabold text-white">₹6,84,200</span>
                    <span className="text-[10px] font-semibold text-emerald-400">↑ 28.4%</span>
                  </div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="font-mono text-[9px] text-white/40 uppercase">Efficiency Index</span>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-[18px] font-extrabold text-white">99.8%</span>
                    <span className="text-[10px] font-semibold text-[#5B9BFF]">Synced</span>
                  </div>
                </div>
              </div>

              {/* Reactive spline curve SVG */}
              <div className="relative h-20 w-full overflow-hidden rounded-lg border border-white/[0.06] bg-[#0E111A] p-2">
                <svg viewBox="0 0 320 80" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curve-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0866F5" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0866F5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 60 Q 50 45, 90 52 T 160 30 T 230 40 T 320 12 L 320 80 L 0 80 Z"
                    fill="url(#curve-glow)"
                  />
                  <path
                    d="M 0 60 Q 50 45, 90 52 T 160 30 T 230 40 T 320 12"
                    fill="none"
                    stroke="#0866F5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="320" cy="12" r="4" fill="#FFFFFF" stroke="#0866F5" strokeWidth="2" />
                </svg>
                <div className="absolute top-2 right-3 font-mono text-[9px] text-[#5B9BFF]">
                  +34% Growth
                </div>
              </div>
            </div>
          )}

          {/* SPECIMEN 03: Store Management System (Offline Store) */}
          {activeId === "store" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="font-mono text-[10px] uppercase text-white/40">
                  Shop Operating System · POS
                </span>
                <span className="rounded bg-[#0866F5]/20 px-2 py-0.5 font-mono text-[9px] text-[#5B9BFF]">
                  Offline Store Ready
                </span>
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-[#0E111A] p-3">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Inventory Health</span>
                  <span className="font-mono text-emerald-400">1,480 SKUs Monitored</span>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded bg-white/[0.03] p-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-white">Batch #4092 Stock Level</span>
                    </div>
                    <span className="font-mono text-white/60">142 in hand</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-white/[0.03] p-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-white">Counter 01 Daily Ledger</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">₹18,450 logged</span>
                  </div>
                </div>
              </div>

              <p className="font-mono text-[10px] text-white/40 italic">
                Replaces handwritten registers with clear digital inventory & sales tracking.
              </p>
            </div>
          )}

          {/* SPECIMEN 04: Google Business SEO */}
          {activeId === "seo" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
                  <span>GOOGLE LOCAL PACK // VERIFIED</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">● Live Profile</span>
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-[#0E111A] p-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[15px] font-bold text-white">Your Business Name</h4>
                    <p className="text-[11px] text-white/50">Primary Category · Local Store & Service</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="font-bold text-amber-400 text-[12px]">5.0</span>
                      <span className="text-amber-400 text-[12px]">★★★★★</span>
                      <span className="font-mono text-[10px] text-white/40">(50+ Authentic Reviews)</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#0866F5]/20 p-2 text-[#5B9BFF]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-2.5 font-mono text-[10px]">
                  <div className="rounded bg-white/[0.02] p-1.5 text-center">
                    <span className="block text-[14px] font-bold text-white">#1</span>
                    <span className="text-white/40">Map Pack</span>
                  </div>
                  <div className="rounded bg-white/[0.02] p-1.5 text-center">
                    <span className="block text-[14px] font-bold text-emerald-400">+180%</span>
                    <span className="text-white/40">Directions</span>
                  </div>
                  <div className="rounded bg-white/[0.02] p-1.5 text-center">
                    <span className="block text-[14px] font-bold text-[#5B9BFF]">100%</span>
                    <span className="text-white/40">Accurate</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPECIMEN 05: Social Media Marketing */}
          {activeId === "social" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-[10px] text-white/40">
                <span>CONTENT COHERENCE ENGINE</span>
                <span className="text-[#5B9BFF]">Consistent Feed System</span>
              </div>

              {/* 3-Frame Grid Preview */}
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0866F5]/20 to-[#0B0D14] p-2 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-[#5B9BFF]">POST 01</span>
                  <div className="h-1.5 w-full rounded-xs bg-white/40" />
                </div>
                <div className="aspect-square rounded-lg border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-[#0B0D14] p-2 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-white/50">POST 02</span>
                  <div className="h-1.5 w-3/4 rounded-xs bg-white/40" />
                </div>
                <div className="aspect-square rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0866F5]/20 to-[#0B0D14] p-2 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-[#5B9BFF]">POST 03</span>
                  <div className="h-1.5 w-5/6 rounded-xs bg-white/40" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 font-mono text-[10px]">
                <span className="text-white/50">Brand Tone Consistency</span>
                <span className="text-emerald-400 font-bold">99.4% Verified On-Brand</span>
              </div>
            </div>
          )}

          {/* SPECIMEN 06: Social Media Campaigns */}
          {activeId === "campaigns" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-[10px] text-white/40">
                <span>CAMPAIGN LIFECYCLE</span>
                <span className="text-[#5B9BFF]">Purpose-Driven Launch</span>
              </div>

              {/* 4-Stage Milestone Stepper */}
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { step: 0, label: "01 Goal", desc: "Defined" },
                  { step: 1, label: "02 Plan", desc: "Scoped" },
                  { step: 2, label: "03 Create", desc: "Polished" },
                  { step: 3, label: "04 Launch", desc: "Live" },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCampaignStep(s.step)}
                    className={cn(
                      "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                      campaignStep === s.step
                        ? "border-[#0866F5] bg-[#0866F5]/20 text-white"
                        : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:text-white"
                    )}
                  >
                    <span className="font-mono text-[10px] font-bold">{s.label}</span>
                    <span className="text-[9px] text-white/40">{s.desc}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-[#0E111A] p-2.5 font-mono text-[11px] text-white/70">
                {campaignStep === 0 && "Step 1: Clarify target objective, audience, and key performance metric."}
                {campaignStep === 1 && "Step 2: Agree on exact schedule, promotion window, and budget deliverables."}
                {campaignStep === 2 && "Step 3: Craft cohesive creatives, copy, and promotional assets."}
                {campaignStep === 3 && "Step 4: Execute synchronized rollout across primary channels."}
              </div>
            </div>
          )}

          {/* SPECIMEN 07: Graphic Designing */}
          {activeId === "graphic" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="font-mono text-[10px] text-white/40">GEOMETRIC IDENTITY SPECIMEN</span>
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className="flex items-center gap-1 rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] text-[#5B9BFF] hover:bg-white/[0.08]"
                >
                  <Grid className="h-3 w-3" />
                  <span>Grid: {showGrid ? "ON" : "OFF"}</span>
                </button>
              </div>

              {/* Graphic Canvas with Golden Ratio lines */}
              <div className="relative h-28 overflow-hidden rounded-lg border border-white/[0.08] bg-[#090B10] p-3 flex items-center justify-center">
                {showGrid && (
                  <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20" aria-hidden="true">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#0866F5" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="#0866F5" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="50%" cy="50%" r="40" fill="none" stroke="#0866F5" strokeWidth="1" />
                    <circle cx="50%" cy="50%" r="20" fill="none" stroke="#0866F5" strokeWidth="1" />
                  </svg>
                )}
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <span className="text-[20px] font-extrabold tracking-[-0.04em] text-white">KEYSPEX</span>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#5B9BFF]">CRAFT // SYSTEM</span>
                </div>
              </div>

              {/* Swatch Bar */}
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#0866F5] shadow-xs" title="#0866F5 Sapphire" />
                  <span className="h-3 w-3 rounded-full bg-[#5B9BFF]" title="#5B9BFF Electric" />
                  <span className="h-3 w-3 rounded-full bg-[#090B10] border border-white/20" title="#090B10 Obsidian" />
                  <span className="h-3 w-3 rounded-full bg-white" title="#FFFFFF Pure" />
                </div>
                <span className="font-mono text-[9px] text-white/40">Harmonized Palette</span>
              </div>
            </div>
          )}

          {/* SPECIMEN 08: Video Editing */}
          {activeId === "video" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-[10px] text-white/40">
                <span>TIMELINE STUDIO</span>
                <span className="text-emerald-400 font-mono">4K UHD Master · 60fps</span>
              </div>

              {/* Dark Studio Waveform Timeline */}
              <div className="rounded-lg border border-white/[0.08] bg-[#0E111A] p-3 flex flex-col gap-2">
                {/* Video Track */}
                <div className="flex items-center justify-between rounded bg-white/[0.04] p-1.5 font-mono text-[9px] text-white/60">
                  <span>V1: Primary Story Footage</span>
                  <span className="text-[#5B9BFF]">Color Graded</span>
                </div>

                {/* Animated Waveform Track */}
                <div className="flex items-center justify-between rounded bg-[#0866F5]/10 p-2 border border-[#0866F5]/30">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="rounded-full bg-[#0866F5] p-1 text-white hover:bg-[#0556D1]"
                    >
                      {isPlayingAudio ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
                    </button>
                    <span className="font-mono text-[9px] text-white/80">A1: Master Audio Track</span>
                  </div>

                  {/* Equalizer Waveform Bars */}
                  <div className="flex items-end gap-0.5 h-4">
                    {[12, 16, 8, 14, 18, 10, 16, 6, 14, 16, 10, 14].map((h, i) => (
                      <span
                        key={i}
                        className={cn(
                          "w-1 rounded-full bg-[#0866F5] transition-all",
                          isPlayingAudio ? "animate-pulse" : "opacity-40"
                        )}
                        style={{ height: `${h}px`, animationDelay: `${i * 90}ms` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pt-1">
                  <span>TC: 00:08:42:18</span>
                  <span>Audio Level: -14 LUFS</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Active Service Summary Footprint ─────────────────────────── */}
        <div className="relative z-20 mt-4 flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[#0866F5]">
                {currentSpecimen.num}
              </span>
              <h4 className="text-[14px] font-bold text-white">
                {currentSpecimen.title}
              </h4>
            </div>
            <p className="mt-0.5 text-[12px] text-white/60">
              {currentSpecimen.benefit}
            </p>
          </div>

          <a
            href="#services"
            className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-semibold text-white transition-all hover:border-[#0866F5] hover:bg-[#0866F5] sm:justify-start sm:py-1.5"
          >
            <span>Explore Service</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* ── Floating Luxury Trust Micro-Chips Underneath Card ─────────── */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 px-1">
        {[
          "100% Tailored Scope",
          "One Digital Partner",
          "Zero AI Template Slop",
        ].map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[10px] text-white/45 backdrop-blur-md"
          >
            ✦ {pill}
          </span>
        ))}
      </div>
    </div>
  )
}
