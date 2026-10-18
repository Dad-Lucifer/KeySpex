import React, { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { BuildPanel } from "./BuildPanel"
import { useBuildSequence } from "@/hooks/useBuildSequence"
import { Laptop, Smartphone, Eye, CheckCircle2, Sliders, Sparkles } from "lucide-react"

/**
 * Top 1% Studio Vignette: An interactive, tactile digital workbench.
 * Supports:
 * 1. Smooth 3D tilt perspective responding to cursor coordinates with specular sheen.
 * 2. Interactive Studio Mode Switcher: [UI / UX] · [Workflow] · [Inspect].
 * 3. Interactive live device viewport toggle ([Desktop] / [Mobile]) inside the preview.
 * 4. Interactive theme accent toggle ([Royal Blue] / [Obsidian Black]).
 * 5. Interactive live task pipeline with real-time percentage and spline recalculation.
 * 6. High-precision 49-degree architectural blueprint inspection overlay.
 */

type StudioMode = "ui" | "workflow" | "inspect"
type ViewportMode = "desktop" | "mobile"
type AccentTheme = "blue" | "black"

const NAV_LINKS = ["Work", "Services", "About"]
const SERVICES = [{ w: "w-10" }, { w: "w-9" }, { w: "w-11" }]

export const HeroVisual: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false })
  const [mode, setMode] = useState<StudioMode>("ui")
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [accent, setAccent] = useState<AccentTheme>("blue")
  const [inspectTag, setInspectTag] = useState<string | null>(null)

  // Auto-running task sequence with fallback
  const { done, pct } = useBuildSequence(true)

  // 3D Tilt calculation on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width
    const yRatio = (e.clientY - rect.top) / rect.height

    const tiltX = (yRatio - 0.5) * -8
    const tiltY = (xRatio - 0.5) * 8

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
    setInspectTag(null)
  }, [])

  return (
    <div className={cn("relative w-full max-w-[620px] justify-self-end ks-perspective", className)}>
      {/* Studio Header Mode Switcher Bar */}
      <div className="mb-3.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white/95 p-1 shadow-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("ui")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200",
              mode === "ui"
                ? "bg-[#0866F5] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#090B10]"
            )}
            aria-pressed={mode === "ui"}
          >
            <Sparkles className="h-3 w-3" />
            <span>UI / UX</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("workflow")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200",
              mode === "workflow"
                ? "bg-[#0866F5] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#090B10]"
            )}
            aria-pressed={mode === "workflow"}
          >
            <Sliders className="h-3 w-3" />
            <span>Workflow</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("inspect")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200",
              mode === "inspect"
                ? "bg-[#090B10] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#090B10]"
            )}
            aria-pressed={mode === "inspect"}
          >
            <Eye className="h-3 w-3" />
            <span>Inspect</span>
          </button>
        </div>

        {/* Dynamic Studio Status Pill */}
        <div className="hidden items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/80 px-3 py-1 text-[11px] font-medium text-[#64748B] backdrop-blur-xs sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0866F5] animate-pulse" />
          <span>Interactive Studio</span>
          {inspectTag && (
            <span className="font-mono text-[10px] text-[#0866F5] transition-opacity">
              • {inspectTag}
            </span>
          )}
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div
        ref={containerRef}
        role="img"
        aria-label="Interactive preview of digital solutions and custom operational tools"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 250ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
        className="relative aspect-[1/0.95] w-full ks-preserve-3d"
      >
        {/* Dynamic Specular Spotlight Sheen */}
        {spotlight.active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 z-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${spotlight.x}% ${spotlight.y}%, rgba(8, 102, 245, 0.14), transparent 75%)`,
            }}
          />
        )}

        {/* Depth key: soft ambient blue wash behind the composition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -bottom-10 -top-8 -z-10 [background:radial-gradient(60%_52%_at_64%_40%,rgba(8,102,245,0.15),transparent_75%)] blur-2xl"
        />

        {/* 49-degree Facet Bed Geometry (Strictly per §8.1 & §8.3) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 620 580"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="ks-bed-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8F1FE" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
            <linearGradient id="ks-rail-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <polygon points="310,580 620,205 620,580" fill="url(#ks-bed-grad)" opacity="0.85" />
          <polygon points="430,580 620,395 620,580" fill="#D3E4FD" opacity="0.55" />
          <polygon points="512,580 620,478 620,580" fill="#A9CBFB" opacity="0.40" />

          {/* 49° Paper Crease Highlights */}
          <line x1="310" y1="580" x2="620" y2="205" stroke="url(#ks-rail-grad)" strokeWidth="1.5" />
          <line x1="430" y1="580" x2="620" y2="395" stroke="url(#ks-rail-grad)" strokeWidth="1.5" />
          <line x1="512" y1="580" x2="620" y2="478" stroke="url(#ks-rail-grad)" strokeWidth="1" />
        </svg>

        {/* Signature Dashed Path with Key-Head Ring Terminus (§8.3) */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <svg viewBox="0 0 560 560" className="h-full w-full" aria-hidden="true">
            <path
              d="M 24 520 C 120 330, 300 430, 408 168"
              fill="none"
              stroke="#0866F5"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
            <circle cx="408" cy="168" r="8" fill="#FFFFFF" stroke="#0866F5" strokeWidth="2" />
          </svg>
        </div>

        {/* Keymark Seal Motif */}
        <div className="pointer-events-none absolute -top-1 right-6 z-30 hidden lg:block">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" className="ks-ring">
            <circle cx="17" cy="17" r="16" fill="#FFFFFF" stroke="#0866F5" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="17" cy="17" r="16" fill="none" stroke="#0866F5" strokeWidth="1.5" strokeOpacity="0.16" strokeDasharray="1 3" className="ks-ring-tick" />
            <circle cx="13" cy="12.5" r="4.5" fill="none" stroke="#0866F5" strokeWidth="2.5" />
            <line x1="16.2" y1="15.7" x2="23.5" y2="23" stroke="#0866F5" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20.4" y1="19.9" x2="23" y2="17.3" stroke="#0866F5" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* ---------- Screen A: Primary Browser Canvas ---------- */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute right-0 top-0 z-10 flex h-[78%] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white transition-all duration-500",
            "shadow-[0_1px_2px_rgba(9,11,16,0.04),0_18px_36px_-14px_rgba(9,11,16,0.16),0_48px_88px_-32px_rgba(8,102,245,0.28)]",
            viewport === "desktop" ? "w-full" : "w-[72%] right-4 sm:w-[68%]",
            mode === "ui" ? "ring-2 ring-[#0866F5]/40" : ""
          )}
        >
          {/* Chrome Bar */}
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D8DEE8]" />
              <span className="h-2 w-2 rounded-full bg-[#D8DEE8]" />
              <span className="h-2 w-2 rounded-full bg-[#D8DEE8]" />
            </div>

            {/* URL Pill with Interactive Viewport Toggle */}
            <div className="flex h-5 max-w-[240px] flex-1 items-center justify-between rounded-full border border-[#E5E7EB] bg-white px-2.5 mx-3">
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" aria-hidden="true">
                  <circle cx="4.4" cy="4.4" r="3" fill="none" stroke="#94A3B8" strokeWidth="1.4" />
                  <line x1="6.6" y1="6.6" x2="9" y2="9" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-[9px] text-[#64748B]">keyspex.com/preview</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={cn(
                    "p-0.5 rounded transition-colors",
                    viewport === "desktop" ? "text-[#0866F5]" : "text-[#94A3B8] hover:text-[#090B10]"
                  )}
                  title="Desktop View"
                >
                  <Laptop className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={cn(
                    "p-0.5 rounded transition-colors",
                    viewport === "mobile" ? "text-[#0866F5]" : "text-[#94A3B8] hover:text-[#090B10]"
                  )}
                  title="Mobile View"
                >
                  <Smartphone className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* Accent Theme Switcher Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAccent(accent === "blue" ? "black" : "blue")}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-[#64748B] hover:bg-[#E5E7EB]/50"
                title="Toggle Accent Style"
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    accent === "blue" ? "bg-[#0866F5]" : "bg-[#090B10]"
                  )}
                />
                <span className="hidden sm:inline uppercase text-[8px] tracking-wider">
                  {accent}
                </span>
              </button>
            </div>
          </div>

          {/* Browser Inner Canvas */}
          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            <div>
              {/* Site Nav Skeleton */}
              <div
                className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 cursor-pointer group"
                onMouseEnter={() => setInspectTag("Header Nav: 12-col Fluid Grid")}
                onMouseLeave={() => setInspectTag(null)}
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-[2px] bg-[#090B10]" />
                  <div className="h-2 w-6 rounded-xs bg-[#090B10]" />
                  <div
                    className={cn(
                      "h-2 w-6 rounded-xs transition-colors duration-300",
                      accent === "blue" ? "bg-[#0866F5]" : "bg-[#090B10]"
                    )}
                  />
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                  {NAV_LINKS.map((link) => (
                    <div key={link} className="h-1.5 w-7 rounded-xs bg-[#D8DEE8]" />
                  ))}
                  <div
                    className={cn(
                      "h-5 w-14 rounded-full transition-colors duration-300",
                      accent === "blue" ? "bg-[#0866F5]" : "bg-[#090B10]"
                    )}
                  />
                </div>
              </div>

              {/* Hero Block Preview */}
              <div className="mt-4 grid grid-cols-12 items-center gap-3">
                <div
                  className="col-span-7 flex flex-col gap-2 cursor-pointer"
                  onMouseEnter={() => setInspectTag("Hero H1: 60px • Semantics 800")}
                  onMouseLeave={() => setInspectTag(null)}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-[94%] rounded-xs bg-[#090B10] sm:h-3.5" />
                    <div className="h-3 w-[76%] rounded-xs bg-[#090B10] sm:h-3.5" />
                    <div className="relative h-3 w-[52%] sm:h-3.5">
                      <div
                        className={cn(
                          "absolute inset-0 rounded-xs transition-colors duration-300",
                          accent === "blue" ? "bg-[#0866F5]" : "bg-[#090B10]"
                        )}
                      />
                      <div className="ks-blink absolute -right-1 top-0 h-full w-px bg-[#0866F5]" />
                    </div>
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="h-1.5 w-[90%] rounded-xs bg-[#D8DEE8]" />
                    <div className="h-1.5 w-[62%] rounded-xs bg-[#D8DEE8]" />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div
                      className={cn(
                        "h-6 w-20 rounded-full transition-colors duration-300 shadow-xs",
                        accent === "blue" ? "bg-[#0866F5]" : "bg-[#090B10]"
                      )}
                    />
                    <div className="h-6 w-14 rounded-full border border-[#090B10]/18" />
                  </div>
                </div>

                {/* Facet Card Graphic (49° Polygon echo) */}
                <div
                  className="col-span-5 h-24 overflow-hidden rounded-[10px] border border-[#E5E7EB]/70 bg-[#F3F8FF] sm:h-28 cursor-pointer"
                  onMouseEnter={() => setInspectTag("Facet Component: 49° Planar Angle")}
                  onMouseLeave={() => setInspectTag(null)}
                >
                  <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
                    <polygon points="0,150 200,30 200,150" fill="#E8F1FE" opacity="0.9" />
                    <polygon points="60,150 200,80 200,150" fill="#D3E4FD" opacity="0.75" />
                    <polygon points="120,150 200,120 200,150" fill="#A9CBFB" opacity="0.55" />
                    <line x1="0" y1="150" x2="200" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
                    <line x1="60" y1="150" x2="200" y2="80" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Service Row Skeleton */}
            <div
              className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E5E7EB] pt-3 cursor-pointer"
              onMouseEnter={() => setInspectTag("Editorial Grid: 3-Col Modular Unit")}
              onMouseLeave={() => setInspectTag(null)}
            >
              {SERVICES.map((svc, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex h-3 w-3 items-center justify-center rounded-[3px] bg-[#E8F1FE]">
                    <div className="h-1.5 w-1.5 rounded-[1px] bg-[#0866F5]/70" />
                  </div>
                  <div className={cn("h-1.5 rounded-xs bg-[#090B10]", svc.w)} />
                  <div className="h-1 w-12 rounded-xs bg-[#D8DEE8]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Screen B: Interactive Business Tool Panel ---------- */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 left-0 z-20 flex h-[56%] w-[48%] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white transition-all duration-500 sm:left-2",
            "shadow-[0_1px_2px_rgba(9,11,16,0.05),0_20px_40px_-14px_rgba(9,11,16,0.22),0_44px_80px_-30px_rgba(8,102,245,0.24)]",
            mode === "workflow" ? "scale-[1.04] ring-2 ring-[#0866F5]" : ""
          )}
        >
          <BuildPanel done={done} pct={pct} />
        </div>

        {/* ---------- Mode: Inspect Architecture Blueprint Overlay ---------- */}
        {mode === "inspect" && (
          <div className="pointer-events-none absolute inset-0 z-30 rounded-[16px] border border-[#0866F5]/60 bg-[#0866F5]/[0.03] backdrop-blur-[1px] p-4">
            {/* 49° Vector Crosshair Overlays */}
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <line x1="0" y1="0" x2="620" y2="580" stroke="#0866F5" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
              <line x1="0" y1="580" x2="620" y2="40" stroke="#0866F5" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            </svg>

            {/* Architectural Tags */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 font-mono text-[9px] text-[#0866F5]">
              <span className="rounded bg-white/90 px-1.5 py-0.5 border border-[#0866F5]/30">
                θ = 49° SIGNATURE DIAGONAL
              </span>
              <span className="rounded bg-white/90 px-1.5 py-0.5 border border-[#0866F5]/30">
                12-COL EDITORIAL ALIGNMENT
              </span>
              <span className="rounded bg-white/90 px-1.5 py-0.5 border border-[#0866F5]/30">
                ZERO FABRICATION STRICT
              </span>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-[#090B10] px-2 py-1 font-mono text-[10px] text-white">
              <CheckCircle2 className="h-3 w-3 text-[#5B9BFF]" />
              <span>PASS: 60 FPS • 0.00 CLS</span>
            </div>
          </div>
        )}

        {/* Shared Scrim at Plane Overlap */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[46%] left-[8%] right-[16%] z-[15] h-16 [background:radial-gradient(60%_100%_at_30%_100%,rgba(8,102,245,0.10),transparent_70%)]"
        />
      </div>
    </div>
  )
}
