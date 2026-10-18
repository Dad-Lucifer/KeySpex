import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Heart,
  Bookmark,
  Share2,
  Play,
  Pause,
  CheckCircle2,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Disc3,
  MessageCircle,
} from "lucide-react"
import type { ProjectData } from "@/data/projects"
import { InteractiveWebsiteSimulator } from "./InteractiveWebsiteSimulator"
import { playReelAudio } from "@/lib/reelAudio"
import { cn } from "@/lib/utils"

interface PortfolioCardProps {
  project: ProjectData
  className?: string
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, className }) => {
  // ── INSTAGRAM INTERACTIONS ────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const baseLikes = parseInt(project.instagramDetails?.likes.replace(/,/g, "") || "1200", 10)
  const [likeCount, setLikeCount] = useState(baseLikes)
  const [showHeartBurst, setShowHeartBurst] = useState(false)

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null)
  const lastTapRef = useRef<number>(0)

  const triggerHeartBurst = () => {
    if (!isLiked) {
      setIsLiked(true)
      setLikeCount((prev) => prev + 1)
    }
    setShowHeartBurst(true)
    setTimeout(() => setShowHeartBurst(false), 900)
  }

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerHeartBurst()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    const total = project.instagramDetails?.slides?.length || 1

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next slide
        setCurrentSlide((prev) => (prev < total - 1 ? prev + 1 : 0))
      } else {
        // Swiped right -> prev slide
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : total - 1))
      }
      lastTapRef.current = 0
    } else if (Math.abs(diff) < 15) {
      // Intentional stationary tap: check double tap
      const now = Date.now()
      if (now - lastTapRef.current < 300) {
        triggerHeartBurst()
        lastTapRef.current = 0
      } else {
        lastTapRef.current = now
      }
    }
    touchStartXRef.current = null
  }

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const total = project.instagramDetails?.slides?.length || 1
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : total - 1))
  }

  const handleNextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const total = project.instagramDetails?.slides?.length || 1
    setCurrentSlide((prev) => (prev < total - 1 ? prev + 1 : 0))
  }

  // ── REEL AUTO-PLAY & SOUND INTERACTIONS ───────────────────────────────────
  const [isReelPlaying, setIsReelPlaying] = useState(false)
  const [isReelMuted, setIsReelMuted] = useState(false)
  const [reelLikes, setReelLikes] = useState(() => {
    return parseInt(project.reelDetails?.shares.replace(/,/g, "") || "8900", 10) * 12
  })
  const [isReelLiked, setIsReelLiked] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)

  const audioSessionRef = useRef<{ context: AudioContext; stop: () => void } | null>(null)
  const progressIntervalRef = useRef<number | null>(null)

  const stopAudio = useCallback(() => {
    if (audioSessionRef.current) {
      audioSessionRef.current.stop()
      audioSessionRef.current = null
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    setPlaybackProgress(0)
  }, [])

  const startReelPlayback = useCallback(() => {
    setIsReelPlaying(true)
    if (!isReelMuted) {
      stopAudio()
      const theme = project.reelDetails?.theme || "fashion"
      audioSessionRef.current = playReelAudio(theme)
    }

    // Animate progress timeline
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current)
    progressIntervalRef.current = window.setInterval(() => {
      setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 4))
    }, 250)
  }, [isReelMuted, project.reelDetails?.theme, stopAudio])

  const stopReelPlayback = useCallback(() => {
    setIsReelPlaying(false)
    stopAudio()
  }, [stopAudio])

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [stopAudio])

  // Mouse & Touch events
  const handleReelMouseEnter = () => startReelPlayback()
  const handleReelMouseLeave = () => stopReelPlayback()
  const handleReelPointerDown = () => startReelPlayback()
  const handleReelPointerUp = () => stopReelPlayback()

  const handleManualPlayToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isReelPlaying) {
      stopReelPlayback()
    } else {
      startReelPlayback()
    }
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const nextMuted = !isReelMuted
    setIsReelMuted(nextMuted)
    if (nextMuted) {
      stopAudio()
    } else if (isReelPlaying) {
      const theme = project.reelDetails?.theme || "fashion"
      audioSessionRef.current = playReelAudio(theme)
    }
  }

  const handleReelLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsReelLiked(!isReelLiked)
    setReelLikes((prev) => (isReelLiked ? prev - 1 : prev + 1))
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0E121E] transition-all duration-300",
        "lg:hover:-translate-y-1 lg:hover:border-[#0866F5]/60 lg:hover:shadow-[0_20px_50px_-15px_rgba(8,102,245,0.35)]",
        "shrink-0 snap-center w-[84vw] max-w-[340px] sm:w-[380px] sm:max-w-none lg:w-auto lg:max-w-none lg:shrink",
        className
      )}
    >

      {/* ====================================================================
          1. WEBSITE SHOWCASE CARD (REAL PC VIEWPORT + VISIT WEBSITE BUTTON)
          ==================================================================== */}
      {project.type === "website" && project.websiteDetails && (
        <div className="flex flex-col h-full justify-between">
          {/* Interactive PC Canvas Viewport */}
          <div className="relative w-full overflow-hidden bg-[#0A0D16] flex flex-col">
            <InteractiveWebsiteSimulator
              projectId={project.id}
              domain={project.websiteDetails.domain}
              headline={project.websiteDetails.headline}
              sub={project.websiteDetails.sub}
              accentColor={project.websiteDetails.accentColor}
            />

            {/* Clean Website Card Footer */}
            <div className="flex items-center justify-between p-3.5 sm:p-5 border-t border-white/[0.08] bg-[#0E121E]">
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {project.category}
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-emerald-400">
                    • {project.impactMetric.value}
                  </span>
                </div>
                <h3 className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight mt-0.5 truncate">
                  {project.title}
                </h3>
              </div>

              {/* Minimal Clean Visit Action */}
              <a
                href="#contact"
                className="shrink-0 group/btn inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold text-white/80 hover:bg-white hover:text-black hover:border-white transition-all shadow-xs"
                title={`Visit ${project.websiteDetails.domain}`}
              >
                <span>Visit <span className="hidden sm:inline">Website</span></span>
                <ExternalLink className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          2. INSTAGRAM CREATIVE SHOWCASE CARD (REAL PHOTOGRAPHY + EDITORIAL)
          ==================================================================== */}
      {project.type === "instagram" && project.instagramDetails && (
        <div className="flex flex-col h-full justify-between">
          {/* Authentic Instagram Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#141826] px-3.5 sm:px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-[1.5px]">
                <div className="h-full w-full rounded-full bg-[#11141E] flex items-center justify-center font-mono text-[8px] font-bold text-white">
                  KS
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-bold text-white">
                  @{project.instagramDetails.handle}
                </span>
                <CheckCircle2 className="h-3 w-3 text-[#0866F5]" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] text-white/70">
                {currentSlide + 1}/{project.instagramDetails.slides.length}
              </span>
            </div>
          </div>

          {/* Instagram 4:5 Visual Canvas with High-Res Editorial Photography */}
          <div
            onDoubleClick={handleDoubleTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex flex-col justify-between overflow-hidden cursor-pointer group/art touch-pan-y"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Background Editorial Artwork */}
            <img
              src={project.instagramDetails.slides[currentSlide].image}
              alt={project.instagramDetails.slides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/art:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />

            {/* Floating Heart Burst Animation on Double Tap */}
            {showHeartBurst && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
                <Heart className="h-20 w-20 fill-rose-500 text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-bounce" />
              </div>
            )}

            {/* Top Minimalist Editorial Banner */}
            <div className="relative z-10 flex items-center justify-between p-4 text-[10px] uppercase tracking-[0.25em] text-white/70 font-mono">
              <span>{project.client.split(" ")[0]}</span>
              <span>{project.instagramDetails.slides[currentSlide].note || "EDITORIAL 2026"}</span>
            </div>

            {/* Prev / Next Slide Arrows — always visible on mobile, hover on desktop */}
            <div className="absolute inset-y-0 inset-x-2 z-20 flex items-center justify-between pointer-events-none opacity-100 sm:opacity-0 sm:group-hover/art:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="pointer-events-auto h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#0866F5] transition-colors"
                title="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="pointer-events-auto h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#0866F5] transition-colors"
                title="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Center Editorial Typography Specimen */}
            <div className="relative z-10 p-5 mt-auto">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#5B9BFF]">
                {project.instagramDetails.slides[currentSlide].subtitle}
              </span>
              <h4 className="text-[22px] font-black text-white leading-tight tracking-tight mt-0.5">
                {project.instagramDetails.slides[currentSlide].title}
              </h4>

              {/* Color Swatches */}
              <div className="mt-3 flex items-center gap-1.5">
                {project.instagramDetails.palette.map((c, i) => (
                  <span
                    key={i}
                    className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
                <span className="ml-2 font-mono text-[10px] text-white/70">
                  {project.instagramDetails.brandTone}
                </span>
              </div>
            </div>

            {/* Bottom Carousel Indicator Dots — touch-friendly hit areas */}
            <div className="relative z-10 flex items-center justify-center gap-1 pb-2 sm:pb-3">
              {project.instagramDetails.slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(i) }}
                  className="py-2 px-1 flex items-center justify-center"
                  title={`Slide ${i + 1}`}
                >
                  <span
                    className={cn(
                      "h-1 sm:h-1.5 rounded-full transition-all block",
                      currentSlide === i ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Instagram Social Engagement Bar */}
          <div className="flex flex-col gap-2 border-t border-white/10 bg-[#111422] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className="flex h-9 w-9 -m-1.5 items-center justify-center rounded-lg text-white hover:text-rose-400 transition-colors"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-transform active:scale-125",
                      isLiked ? "fill-rose-500 text-rose-500" : ""
                    )}
                  />
                </button>
                <div className="flex h-9 w-9 -m-1.5 items-center justify-center text-white/70 hover:text-white">
                  <Share2 className="h-5 w-5" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveToggle}
                className="flex h-9 w-9 -m-1.5 items-center justify-center rounded-lg text-white hover:text-[#5B9BFF] transition-colors"
              >
                <Bookmark
                  className={cn(
                    "h-5 w-5 transition-transform active:scale-125",
                    isSaved ? "fill-[#0866F5] text-[#0866F5]" : ""
                  )}
                />
              </button>
            </div>

            {/* Like Counter & Impact Metric */}
            <div className="font-mono text-[11px] text-white/70">
              <span className="font-bold text-white">
                {likeCount.toLocaleString()} likes
              </span>{" "}
              • <span className="text-emerald-400 font-bold">{project.impactMetric.value}</span>
            </div>

            {/* Caption */}
            <p className="line-clamp-2 text-[11px] text-white/60 leading-snug">
              <span className="font-semibold text-white">
                @{project.instagramDetails.handle}{" "}
              </span>
              {project.instagramDetails.caption}
            </p>
          </div>
        </div>
      )}

      {/* ====================================================================
          3. REEL SHOWCASE CARD (AUTO-PLAY WITH SOUND ON HOVER / LONG PRESS)
          ==================================================================== */}
      {project.type === "reel" && project.reelDetails && (
        <div
          onMouseEnter={handleReelMouseEnter}
          onMouseLeave={handleReelMouseLeave}
          onPointerDown={handleReelPointerDown}
          onPointerUp={handleReelPointerUp}
          onPointerCancel={handleReelPointerUp}
          className="flex flex-col h-full justify-between select-none touch-pan-y"
        >
          {/* Reel 9:16 Vertical Visual Frame */}
          <div
            className={cn(
              "relative flex flex-col justify-between overflow-hidden p-3.5 sm:p-5 transition-all duration-500",
              isReelPlaying ? "ring-2 ring-[#0866F5] shadow-[0_0_30px_rgba(8,102,245,0.4)]" : ""
            )}
            style={{ aspectRatio: "9/14" }}
          >
            {/* Reel Video Poster Background with Kinetic Zoom */}
            <img
              src={project.reelDetails.posterImage}
              alt={project.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-transform duration-1000",
                isReelPlaying ? "scale-110 brightness-90" : "scale-100 brightness-75"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />

            {/* Top View Counter, Mute Toggle & Live Sound Indicator */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-md border border-white/10">
                ▶ {project.reelDetails.views}
              </span>

              {/* Status Pill */}
              <div className="flex items-center gap-1.5">
                {isReelPlaying ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#0866F5] px-2.5 py-0.5 font-mono text-[9px] font-bold text-white shadow-xs animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    LIVE SOUND
                  </span>
                ) : (
                  <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-[9px] text-white/70 backdrop-blur-md border border-white/10">
                    <span className="sm:hidden">Tap &amp; hold</span>
                    <span className="hidden sm:inline">Hover to play</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className={cn(
                    "rounded-full p-2 text-white backdrop-blur-md transition-colors",
                    isReelMuted ? "bg-rose-500/40 text-rose-300" : "bg-black/70 hover:bg-[#0866F5]"
                  )}
                  title={isReelMuted ? "Unmute" : "Mute"}
                >
                  {isReelMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Right Floating Reel Action Stack (Instagram Style) */}
            <div className="absolute right-2 sm:right-3.5 bottom-20 sm:bottom-24 z-20 flex flex-col items-center gap-3 sm:gap-4 text-white">
              <button
                type="button"
                onClick={handleReelLikeClick}
                className="flex flex-col items-center gap-1 group/like"
              >
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md transition-transform group-hover/like:scale-110",
                  isReelLiked ? "text-rose-500" : "text-white"
                )}>
                  <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isReelLiked ? "fill-rose-500" : "")} />
                </div>
                <span className="font-mono text-[8px] sm:text-[9px]">{(reelLikes / 1000).toFixed(1)}k</span>
              </button>

              <div className="flex flex-col items-center gap-1">
                <div className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="font-mono text-[8px] sm:text-[9px]">{project.reelDetails.shares}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-md">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="font-mono text-[8px] sm:text-[9px]">Share</span>
              </div>

              {/* Spinning Vinyl Record Disc */}
              <div className={cn(
                "p-1.5 sm:p-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 mt-0.5 sm:mt-1",
                isReelPlaying ? "animate-spin" : ""
              )}>
                <Disc3 className="h-4 w-4 sm:h-5 sm:w-5 text-[#5B9BFF]" />
              </div>
            </div>

            {/* Center Play/Pause Ripple Button */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleManualPlayToggle}
                className={cn(
                  "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white transition-all duration-300 shadow-[0_0_30px_rgba(8,102,245,0.7)]",
                  isReelPlaying
                    ? "bg-[#0866F5] scale-105 ring-4 ring-[#0866F5]/40"
                    : "bg-[#0866F5]/80 hover:scale-110"
                )}
              >
                {isReelPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />
                )}
              </button>
              <span className="font-mono text-[9px] sm:text-[10px] text-white/80 tracking-widest bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                {isReelPlaying
                  ? "AUDIO SYNCED"
                  : (
                    <>
                      <span className="sm:hidden">HOLD TO PLAY</span>
                      <span className="hidden sm:inline">HOVER OR HOLD TO PLAY</span>
                    </>
                  )
                }
              </span>
            </div>

            {/* Bottom Track Info & Equalizer */}
            <div className="relative z-10 flex flex-col gap-1.5 sm:gap-2 max-w-[70%] sm:max-w-[78%]">
              <div>
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-[#5B9BFF]">
                  Kinetic Reel • {project.reelDetails.resolution}
                </span>
                <h4 className="text-[15px] sm:text-[17px] font-extrabold text-white leading-tight mt-0.5 truncate">
                  {project.title}
                </h4>
              </div>

              {/* Equalizer Sound Waveform */}
              <div className="flex items-center gap-2 rounded-lg bg-black/80 p-1.5 sm:p-2 backdrop-blur-md border border-white/10">
                <span className="truncate font-mono text-[8px] sm:text-[9px] text-white/80">
                  ♫ {project.reelDetails.audioTitle}
                </span>

                <div className="ml-auto flex items-end gap-0.5 h-3 sm:h-3.5">
                  {[12, 16, 8, 15, 20, 10, 14].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-0.5 rounded-full bg-[#0866F5] transition-all",
                        isReelPlaying ? "animate-pulse" : "opacity-40"
                      )}
                      style={{
                        height: isReelPlaying ? `${h}px` : "3px",
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Continuous Video Playback Timeline Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
              <div
                className="h-full bg-[#0866F5] transition-all duration-300"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>
          </div>

          {/* Reel Footer Strip */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-white/10 bg-[#0E121E]">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#5B9BFF]">
                {project.impactMetric.label}
              </span>
              <h3 className="text-[14px] sm:text-[15px] font-bold text-white">
                {project.impactMetric.value}
              </h3>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-[12px] font-bold text-black transition-all hover:bg-[#0866F5] hover:text-white"
            >
              <span>Create Reel</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
