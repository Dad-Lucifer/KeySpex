import React, { useState, useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { HeroStudioArtifact } from "./HeroStudioArtifact"

// ─── Cycling headline words ───────────────────────────────────────────────────
// All fit naturally into: "We build digital ___"
const CYCLE_WORDS = [
  "experiences.",
  "products.",
  "solutions.",
  "futures.",
  "presence.",
]

// ─── Particle field ───────────────────────────────────────────────────────────
// Deterministic positions — no Math.random() so there is never a hydration
// mismatch or layout jump between server and client renders.
const PARTICLES = [
  { id: 1,  x: "7%",  y: "11%", size: "2px",   dur: "11s", delay: "0s"   },
  { id: 2,  x: "21%", y: "71%", size: "1.5px", dur: "14s", delay: "2.1s" },
  { id: 3,  x: "37%", y: "27%", size: "2.5px", dur: "9s",  delay: "0.8s" },
  { id: 4,  x: "54%", y: "59%", size: "1.5px", dur: "16s", delay: "3.5s" },
  { id: 5,  x: "66%", y: "17%", size: "3px",   dur: "12s", delay: "1.2s" },
  { id: 6,  x: "77%", y: "81%", size: "2px",   dur: "10s", delay: "4.8s" },
  { id: 7,  x: "87%", y: "43%", size: "1.5px", dur: "18s", delay: "0.4s" },
  { id: 8,  x: "13%", y: "87%", size: "2px",   dur: "13s", delay: "6.2s" },
  { id: 9,  x: "45%", y: "89%", size: "1.5px", dur: "15s", delay: "2.8s" },
  { id: 10, x: "91%", y: "21%", size: "2.5px", dur: "11s", delay: "5.5s" },
  { id: 11, x: "29%", y: "49%", size: "2px",   dur: "17s", delay: "1.6s" },
  { id: 12, x: "71%", y: "65%", size: "1.5px", dur: "9s",  delay: "7.1s" },
] as const

// ─── Marquee items ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Website Development",
  "Custom Digital Solutions",
  "Digital Growth & Optimization",
  "UI / UX Design",
  "Business Automation",
  "Performance Optimisation",
  "Brand Experience",
  "Conversion Strategy",
]

// ─── Component ────────────────────────────────────────────────────────────────
export const HeroSection: React.FC = () => {
  // ── Cycling word state ────────────────────────────────────────────────────
  const [wordIdx, setWordIdx] = useState(0)
  const [exiting, setExiting] = useState(false)
  // Track first mount so we skip the entrance animation for word-0 (the parent
  // ks-hero-word handles that reveal). All subsequent swaps use ks-word-enter.
  const isFirstWord = useRef(true)

  useEffect(() => {
    // Mark first mount done after the initial animation settles
    const initTimer = setTimeout(() => {
      isFirstWord.current = false
    }, 1400)

    const interval = setInterval(() => {
      // Phase 1: start exit (old word rises and fades out)
      setExiting(true)

      // Phase 2: after exit completes, swap the word and trigger entrance
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % CYCLE_WORDS.length)
        setExiting(false)   // triggers key-based remount → ks-word-enter fires
      }, 380)
    }, 2900)

    return () => {
      clearTimeout(initTimer)
      clearInterval(interval)
    }
  }, [])

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-80px)] w-full flex-col justify-center overflow-hidden scroll-mt-20 bg-[#09090B]"
    >
      {/* ── Radial bloom · brand blue · bottom-right anchor ──────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 80% 112%, rgba(8,102,245,0.24) 0%, transparent 68%)",
        }}
      />

      {/* ── Counter-bloom · top-left balance ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 42% at -4% 0%, rgba(8,102,245,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Edge vignette ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.55)_100%)]"
      />

      {/* ── Particle field · 12 micro-dots drifting gently ───────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="ks-particle absolute rounded-full bg-[#0866F5]"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ════════════════════ Main Content (12-col grid) ════════════════════ */}
      <PageContainer className="relative z-10 py-12 sm:py-20 lg:py-24 pb-20 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">

          {/* ── Left column: copy + CTAs (7 cols) ───────────────────────── */}
          <div className="flex flex-col items-start lg:col-span-7">

            {/* Eyebrow label */}
            <div
              className="ks-hero-word mb-6 sm:mb-8"
              style={{ animationDelay: "0ms" }}
            >
              <span className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#5B9BFF]">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8 bg-[#5B9BFF] opacity-50"
                />
                Custom Digital Solutions
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8 bg-[#5B9BFF] opacity-50"
                />
              </span>
            </div>

            {/* H1 — three staggered display lines ─────────────────────────
                Lines 1 & 2 are static. Line 3 is the cycling word.
                Each block-span gets its own ks-hero-word entry at 90ms intervals. */}
            <h1 id="hero-heading" className="mb-0">
              <span
                className="ks-hero-word block font-extrabold leading-[0.95] sm:leading-[0.91] tracking-[-0.044em] text-white"
                style={{
                  fontSize: "clamp(46px, 6.5vw, 104px)",
                  animationDelay: "60ms",
                }}
              >
                We build
              </span>
              <span
                className="ks-hero-word block font-extrabold leading-[0.95] sm:leading-[0.91] tracking-[-0.044em] text-white"
                style={{
                  fontSize: "clamp(46px, 6.5vw, 104px)",
                  animationDelay: "150ms",
                }}
              >
                digital
              </span>

              {/* Cycling last line — word swaps with slide-up/down transitions */}
              <span
                className="ks-hero-word block font-extrabold leading-[0.95] sm:leading-[0.91] tracking-[-0.044em]"
                style={{
                  fontSize: "clamp(46px, 6.5vw, 104px)",
                  animationDelay: "240ms",
                }}
              >
                <span
                  key={wordIdx}
                  className={
                    isFirstWord.current
                      ? "inline-block text-[#0866F5]"
                      : "ks-word-enter inline-block text-[#0866F5]"
                  }
                  style={
                    exiting
                      ? {
                          opacity: 0,
                          transform: "translateY(-18px)",
                          transition:
                            "opacity 380ms cubic-bezier(0.55,0,1,0.45), transform 380ms cubic-bezier(0.55,0,1,0.45)",
                        }
                      : undefined
                  }
                >
                  {CYCLE_WORDS[wordIdx]}
                </span>
              </span>
            </h1>

            {/* Accent rule — SVG line that draws left-to-right then holds */}
            <svg
              aria-hidden="true"
              viewBox="0 0 64 2"
              className="ks-hero-word my-8 block h-[2px] w-16 overflow-visible sm:my-10"
              style={{ animationDelay: "280ms" }}
            >
              <line
                x1="0"
                y1="1"
                x2="64"
                y2="1"
                stroke="#0866F5"
                strokeWidth="2"
                strokeLinecap="round"
                className="ks-hero-rule"
              />
            </svg>

            {/* Sub-headline */}
            <p
              className="ks-hero-word mb-8 sm:mb-10 sm:mb-12 max-w-[34ch] text-[15px] sm:text-[17px] leading-[1.7] text-[#94A3B8] [text-wrap:pretty]"
              style={{ animationDelay: "360ms" }}
            >
              Crafted for businesses that refuse to blend in.
              <br className="hidden sm:block" />
              Purpose-built. Thoughtful. Genuinely different.
            </p>

            {/* CTAs */}
            <div
              className="ks-hero-word flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-6"
              style={{ animationDelay: "480ms" }}
            >
              {/* Primary CTA */}
              <Button
                asChild
                variant="primary"
                size="lg"
                className="group ks-shimmer-btn h-[52px] w-full px-8 text-[15px] sm:w-auto shadow-cta"
              >
                <a href="#contact" className="inline-flex items-center justify-center gap-2">
                  <span>Let's Talk</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </a>
              </Button>

              {/* Secondary ghost CTA */}
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-2 py-2 text-[15px] font-semibold text-white/60 transition-colors duration-200 hover:text-white sm:justify-start"
              >
                <span>Explore Capabilities</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </a>
            </div>
          </div>

          {/* ── Right column: HeroStudioArtifact (5 cols) ────────────────── */}
          <div
            className="ks-hero-word w-full lg:col-span-5"
            style={{ animationDelay: "520ms" }}
          >
            <HeroStudioArtifact />
          </div>
        </div>
      </PageContainer>

      {/* ════════════ Marquee proof strip ════════════
          Two identical inner divs → CSS scrolls to -50% → seamless loop. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/[0.07]"
      >
        <div className="ks-marquee flex whitespace-nowrap py-[13px]">
          <div className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((item) => (
              <span key={item} className="flex shrink-0 items-center">
                <span className="mx-8 text-[10px] font-medium uppercase tracking-[0.22em] text-white/[0.22]">
                  {item}
                </span>
                <span className="text-[6px] text-white/[0.12]">✦</span>
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {MARQUEE_ITEMS.map((item) => (
              <span key={item} className="flex shrink-0 items-center">
                <span className="mx-8 text-[10px] font-medium uppercase tracking-[0.22em] text-white/[0.22]">
                  {item}
                </span>
                <span className="text-[6px] text-white/[0.12]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
