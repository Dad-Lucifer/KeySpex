import React, { useRef, useState } from "react"
import { Lock, ExternalLink, ArrowDown } from "lucide-react"

interface InteractiveWebsiteSimulatorProps {
  projectId: string
  domain: string
  headline: string
  sub: string
  accentColor: string
}

export const InteractiveWebsiteSimulator: React.FC<InteractiveWebsiteSimulatorProps> = ({
  projectId,
  domain,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  const handleScroll = () => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 20) {
      if (!hasScrolled) setHasScrolled(true)
    }
  }

  return (
    <div className="flex flex-col w-full h-full select-none text-left bg-[#0A0D16]">
      {/* ── Minimal macOS Browser Bar ──────────────────────────────────── */}
      <div className="flex h-8 sm:h-9 w-full items-center justify-between border-b border-white/[0.08] bg-[#0F1320] px-3 sm:px-4 shrink-0 z-20">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>

        {/* Center Minimal Address Bar */}
        <div className="flex h-5 max-w-[150px] sm:max-w-none items-center gap-1.5 rounded-full bg-black/40 px-2.5 sm:px-3 text-white/50 border border-white/5 font-mono text-[9px] sm:text-[10px]">
          <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white/40 shrink-0" />
          <span className="truncate">{domain}</span>
        </div>

        {/* Clean Visit Link */}
        <a
          href="#contact"
          className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-white/60 hover:text-white transition-colors"
          title={`Visit ${domain}`}
        >
          <span>Visit</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* ── Interactive PC Viewport (Scrollable Full-Page Website) ───────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full h-[310px] sm:h-[360px] overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain text-white text-xs scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent group/pc touch-pan-y"
      >
        {/* Subtle scroll hint that disappears after scrolling */}
        {!hasScrolled && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-30 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] text-white/70 backdrop-blur-md border border-white/10 opacity-70 group-hover/pc:opacity-100 transition-opacity">
            <span>Scroll inside to explore</span>
            <ArrowDown className="h-2.5 w-2.5 animate-bounce" />
          </div>
        )}

        {/* ==================================================================
            1. APEX SPATIAL ARCHITECTURE (MINIMAL EDITORIAL)
            ================================================================== */}
        {projectId === "web-apex" && (
          <div className="flex flex-col w-full bg-[#090A0E]">
            {/* Top Navigation */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#090A0E]/90 px-4 py-2.5 sm:px-6 sm:py-3.5 backdrop-blur-md">
              <span className="font-serif text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white">
                APEX // ARCHITECTURE
              </span>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-[8px] sm:text-[9px] text-white/50">
                <span className="text-white">Works</span>
                <span>Studio</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Hero Banner */}
            <div className="relative h-[220px] sm:h-[280px] w-full flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Apex Architecture"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-transform duration-700 group-hover/pc:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-transparent" />

              <div className="relative z-10 max-w-sm">
                <span className="font-mono text-[8px] sm:text-[9px] text-white/60 tracking-widest uppercase">
                  Tokyo • Mumbai • Kyoto
                </span>
                <h3 className="font-serif text-[20px] sm:text-[26px] font-normal tracking-tight text-white mt-1 leading-none">
                  Monolithic Geometry.
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/70 mt-1 sm:mt-1.5 font-light">
                  Raw concrete, Japanese cedar, and negative space.
                </p>
              </div>
            </div>

            {/* Project Lookbook Section */}
            <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border-t border-white/5">
              <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                <span>Selected Works (2025–2026)</span>
                <span>3 Monographs</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="overflow-hidden rounded-lg aspect-[4/3] bg-white/5">
                    <img
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
                      alt="Villa Kyoto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-serif text-[11px] sm:text-[12px] text-white">Villa Kyoto</span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-white/50">Residential • 480 m²</span>
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <div className="overflow-hidden rounded-lg aspect-[4/3] bg-white/5">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                      alt="Monolith Atrium"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-serif text-[11px] sm:text-[12px] text-white">Monolith Atrium</span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-white/50">Commercial • 1,200 m²</span>
                </div>
              </div>

              {/* Minimal Philosophy Quote */}
              <div className="py-3 sm:py-4 border-t border-white/5 text-center font-serif text-[11px] sm:text-[13px] text-white/60 italic">
                “Space is not empty; it is a canvas of light and quiet proportion.”
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            2. VELOCE LIFESTYLE APPAREL (MINIMAL D2C STORE)
            ================================================================== */}
        {projectId === "web-veloce" && (
          <div className="flex flex-col w-full bg-[#0B0D12]">
            {/* Store Top Nav */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0B0D12]/90 px-4 py-2.5 sm:px-6 sm:py-3.5 backdrop-blur-md">
              <span className="font-mono text-[11px] sm:text-[12px] font-black tracking-tighter text-white">
                VELOCE_LABS
              </span>
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-[8px] sm:text-[9px] text-white/50">
                <span className="text-white">Shop</span>
                <span>Editorial</span>
                <span className="text-white font-bold">Bag (2)</span>
              </div>
            </div>

            {/* Hero Feature */}
            <div className="relative h-[220px] sm:h-[280px] w-full flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                alt="Veloce Streetwear"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.75] transition-transform duration-700 group-hover/pc:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-transparent" />

              <div className="relative z-10 max-w-sm">
                <span className="font-mono text-[8px] sm:text-[9px] text-[#5B9BFF] tracking-widest uppercase">
                  Drop 04 // Spring 2026
                </span>
                <h3 className="font-mono text-[18px] sm:text-[22px] font-black tracking-tight text-white mt-1 leading-none uppercase">
                  Urban Mobility.
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/70 mt-1 font-mono">
                  Engineered heavyweights for transit & motion.
                </p>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border-t border-white/5">
              <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                <span>Core Essentials</span>
                <span>In Stock</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <div className="overflow-hidden rounded-lg aspect-square bg-white/5">
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                      alt="Stealth Hoodie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-baseline mt-1 font-mono text-[9px] sm:text-[10px]">
                    <span className="text-white font-medium">Stealth Hoodie</span>
                    <span className="text-emerald-400 font-bold">₹3,800</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="overflow-hidden rounded-lg aspect-square bg-white/5">
                    <img
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                      alt="Modular Cargo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-baseline mt-1 font-mono text-[9px] sm:text-[10px]">
                    <span className="text-white font-medium">Modular Cargo</span>
                    <span className="text-emerald-400 font-bold">₹4,200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            3. KALYAN STORE OPERATING POS (MINIMAL FINTECH DASHBOARD)
            ================================================================== */}
        {projectId === "web-kalyan" && (
          <div className="flex flex-col w-full bg-[#080B12] min-h-full">
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#080B12]/90 px-4 py-2.5 sm:px-6 sm:py-3.5 backdrop-blur-md">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white">
                KALYAN_POS // TERMINAL 01
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] text-emerald-400">
                ● Live Synced
              </span>
            </div>

            {/* Minimal Metric Panel */}
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
              <div>
                <span className="font-mono text-[8px] sm:text-[9px] text-white/50 uppercase tracking-wider">
                  Today's Store Revenue
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-mono text-[22px] sm:text-[28px] font-bold text-white">
                    ₹84,250
                  </h3>
                  <span className="font-mono text-[9px] sm:text-[10px] text-emerald-400 font-bold">
                    ▲ 18.4%
                  </span>
                </div>
              </div>

              {/* Minimal Vector Graph Line */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4 flex flex-col gap-2">
                <span className="font-mono text-[8px] sm:text-[9px] text-white/40">Hourly Volume</span>
                <div className="flex items-end gap-1 sm:gap-1.5 h-12 sm:h-16 pt-2">
                  {[20, 35, 25, 45, 60, 50, 75, 90, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[#0866F5]/40 hover:bg-[#0866F5] transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Ledger Entries */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                  Recent Register Transactions
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-[9px] sm:text-[10px]">
                  <div className="flex justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-white/80">Basmati Rice (25kg)</span>
                    <span className="text-emerald-400 font-bold">₹1,450 ✓</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-white/80">Organic Sugar (5kg)</span>
                    <span className="text-emerald-400 font-bold">₹220 ✓</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-white/80">Linen Shirt (M)</span>
                    <span className="text-emerald-400 font-bold">₹890 ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            4. PULSE HEALTH & DIAGNOSTICS (MINIMAL CLINICAL PORTAL)
            ================================================================== */}
        {projectId === "web-pulse" && (
          <div className="flex flex-col w-full bg-[#0A0E18]">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0A0E18]/90 px-4 py-2.5 sm:px-6 sm:py-3.5 backdrop-blur-md">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white">
                PULSE HEALTH
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] text-white/50">
                Bangalore • Mumbai
              </span>
            </div>

            {/* Clinical Hero */}
            <div className="relative h-[190px] sm:h-[240px] w-full flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                alt="Pulse Health"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.4] transition-transform duration-700 group-hover/pc:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E18] via-transparent to-transparent" />

              <div className="relative z-10 max-w-sm">
                <span className="font-mono text-[8px] sm:text-[9px] text-[#5B9BFF] tracking-widest uppercase">
                  Clinical Scheduling
                </span>
                <h3 className="text-[17px] sm:text-[20px] font-bold text-white mt-1 leading-tight">
                  Specialized Healthcare. Made Accessible.
                </h3>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3 border-t border-white/5">
              <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                Consultant Specialists
              </span>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3 flex flex-col gap-0.5">
                  <span className="font-bold text-[11px] sm:text-[12px] text-white">Dr. A. Mehta</span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-[#5B9BFF]">Cardiology Lead</span>
                  <span className="font-mono text-[8px] text-white/40 mt-0.5 sm:mt-1">★ 4.9 • 14 Yrs</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 sm:p-3 flex flex-col gap-0.5">
                  <span className="font-bold text-[11px] sm:text-[12px] text-white">Dr. V. Rao</span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-[#5B9BFF]">Dermatology Head</span>
                  <span className="font-mono text-[8px] text-white/40 mt-0.5 sm:mt-1">★ 5.0 • 11 Yrs</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
