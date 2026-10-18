import React, { useState } from "react"
import {
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { FacetBackdrop } from "@/components/layout/FacetBackdrop"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"
import { api, ApiClientError } from "@/lib/api"
import type { ServiceInterest } from "@/lib/types"

// ─── FUNNEL SELECTION OPTIONS ────────────────────────────────────────────────
const SERVICES_OPTIONS = [
  { id: "website", label: "Modern Website", icon: "🌐" },
  { id: "instagram", label: "Instagram & Branding", icon: "📱" },
  { id: "reels", label: "Kinetic Video & Reels", icon: "🎬" },
  { id: "pos", label: "Custom Tool / POS", icon: "⚡" },
  { id: "seo", label: "SEO & Growth", icon: "📈" },
  { id: "redesign", label: "UI/UX Redesign", icon: "✨" },
]

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "⚡ Urgent (< 2 Weeks)" },
  { id: "standard", label: "🚀 2 – 4 Weeks" },
  { id: "flexible", label: "📅 Flexible / Planning" },
]

const BUDGET_OPTIONS = [
  { id: "starter", label: "₹25K – ₹50K" },
  { id: "growth", label: "₹50K – ₹1.2L" },
  { id: "scale", label: "₹1.2L+" },
  { id: "scope_first", label: "Discuss Scope First" },
]

export const ContactSection: React.FC = () => {
  const revealRef = useReveal()

  // Funnel pill selections
  const [selectedServices, setSelectedServices] = useState<string[]>(["website"])
  const [selectedTimeline, setSelectedTimeline] = useState<string>("standard")
  const [selectedBudget, setSelectedBudget] = useState<string>("growth")

  // Client text inputs (Minimal: Name + Contact + 1-line note)
  const [name, setName] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [quickNote, setQuickNote] = useState("")
  const [websiteHoneypot, setWebsiteHoneypot] = useState("")

  // Form submission status: "idle" | "submitting" | "success" | "error"
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Multi-select toggle for services
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((s) => s !== id)
          : prev
        : [...prev, id]
    )
  }

  // Handle API Submission via Backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    // Bot detection via honeypot
    if (websiteHoneypot.trim()) {
      setStatus("success")
      return
    }

    // Map selected IDs to human labels for email notification
    const servicesLabel = selectedServices
      .map((s) => SERVICES_OPTIONS.find((opt) => opt.id === s)?.label)
      .filter(Boolean)
      .join(", ")

    const timelineLabel =
      TIMELINE_OPTIONS.find((t) => t.id === selectedTimeline)?.label || selectedTimeline

    const budgetLabel =
      BUDGET_OPTIONS.find((b) => b.id === selectedBudget)?.label || selectedBudget

    // Map service selections to backend ServiceInterest enum
    let serviceInterest: ServiceInterest = "other"
    if (selectedServices.includes("website") || selectedServices.includes("redesign")) {
      serviceInterest = "website-development"
    } else if (selectedServices.includes("pos")) {
      serviceInterest = "custom-digital-solutions"
    } else if (
      selectedServices.includes("seo") ||
      selectedServices.includes("instagram") ||
      selectedServices.includes("reels")
    ) {
      serviceInterest = "digital-growth-optimization"
    }

    const compiledMessage = [
      `Services requested: ${servicesLabel}`,
      `Target timeline: ${timelineLabel}`,
      `Budget expectation: ${budgetLabel}`,
      quickNote.trim() ? `Note: ${quickNote.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    try {
      await api.submitContact({
        name: name.trim(),
        email: contactInfo.trim(),
        serviceInterest,
        message: compiledMessage,
        consent: true,
        source: "landing-contact-section",
        website: websiteHoneypot.trim(),
      })
      setStatus("success")
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.fieldErrors?.email) {
          setErrorMessage(err.fieldErrors.email[0] ?? err.message)
        } else if (err.fieldErrors?.name) {
          setErrorMessage(err.fieldErrors.name[0] ?? err.message)
        } else if (err.fieldErrors?.message) {
          setErrorMessage(err.fieldErrors.message[0] ?? err.message)
        } else {
          setErrorMessage(err.message)
        }
      } else {
        setErrorMessage("Network error. Please check your connection or reach out directly.")
      }
      setStatus("error")
    }
  }

  const handleResetForm = () => {
    setStatus("idle")
    setName("")
    setContactInfo("")
    setQuickNote("")
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-40 [background:linear-gradient(180deg,#FFFFFF_0%,#F3F8FF_50%,#FFFFFF_100%)] scroll-mt-20"
    >
      <FacetBackdrop tone="light" />

      <PageContainer className="relative z-10">
        <div ref={revealRef} className="reveal mx-auto flex max-w-[48rem] flex-col items-center">

          {/* ── Section Heading ────────────────────────────────────────── */}
          <div className="text-center flex flex-col items-center max-w-[36rem]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0866F5]/20 bg-[#0866F5]/5 px-3 py-1 font-mono text-[11px] font-bold text-[#0866F5] uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Start a Conversation</span>
            </div>

            <h2
              id="contact-heading"
              className="text-[clamp(32px,1rem+3.2vw,56px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#090B10]"
            >
              Tell us what you're building.
            </h2>

            <p className="mt-3.5 text-[16px] sm:text-[18px] text-[#64748B] leading-relaxed">
              Select your requirements below. No long forms or complex questionnaires — get an agreed scope and price within 24 hours.
            </p>
          </div>

          {/* ── High-Conversion Funnel Form Card ───────────────────────── */}
          <div className="mt-8 sm:mt-10 w-full rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(8,102,245,0.08)]">

            {status === "success" ? (
              /* Success View */
              <div className="flex flex-col items-center text-center py-10 animate-in fade-in-50 zoom-in-95 duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <h3 className="mt-6 text-[24px] font-bold text-[#090B10]">
                  Conversation Started!
                </h3>
                <p className="mt-2 text-[15px] text-[#64748B] max-w-md">
                  Thank you, <span className="font-semibold text-[#090B10]">{name || "there"}</span>. We have received your project details and will review your scope within 2 to 4 hours.
                </p>

                <div className="mt-6 flex items-center gap-4 text-[13px] font-mono text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#0866F5]" />
                    <span>Avg response: &lt; 2 hrs</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Confidentiality guaranteed</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="mt-8 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 font-mono text-[12px] font-bold text-[#090B10] hover:bg-[#F8FAFC] transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              /* Interactive Form Funnel */
              <form
                action="https://formspree.io/f/xzedwzpv"
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >

                {/* Honeypot field for bot protection */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden pointer-events-none">
                  <label htmlFor="website-hp">
                    Leave this field blank
                    <input
                      id="website-hp"
                      type="text"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      value={websiteHoneypot}
                      onChange={(e) => setWebsiteHoneypot(e.target.value)}
                    />
                  </label>
                </div>

                {/* ── STEP 1: SERVICES (MULTI-SELECT) ────────────────────── */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between text-[13px] font-bold uppercase tracking-wider text-[#090B10]">
                    <span>1. What do you need help with?</span>
                    <span className="font-mono text-[11px] font-normal text-[#64748B]">
                      Select all that apply
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICES_OPTIONS.map((opt) => {
                      const isSelected = selectedServices.includes(opt.id)
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleService(opt.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left transition-all active:scale-98 cursor-pointer select-none",
                            isSelected
                              ? "border-[#0866F5] bg-[#0866F5] text-white shadow-xs font-semibold"
                              : "border-[#E5E7EB] bg-[#F8FAFC] text-[#334155] hover:border-[#0866F5]/40 hover:bg-white"
                          )}
                        >
                          <span className="text-[15px]">{opt.icon}</span>
                          <span className="text-[13px] leading-tight flex-1">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-white shrink-0 ml-1" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── STEP 2: TIMELINE & BUDGET (SIDE-BY-SIDE) ───────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Timeline Pills */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold uppercase tracking-wider text-[#090B10]">
                      2. Target Timeline
                    </label>
                    <div className="flex flex-col gap-2">
                      {TIMELINE_OPTIONS.map((t) => {
                        const isSelected = selectedTimeline === t.id
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTimeline(t.id)}
                            className={cn(
                              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] transition-all cursor-pointer select-none",
                              isSelected
                                ? "border-[#0866F5] bg-[#0866F5]/10 text-[#0866F5] font-bold"
                                : "border-[#E5E7EB] bg-[#F8FAFC] text-[#334155] hover:bg-white hover:border-[#0866F5]/30 font-medium"
                            )}
                          >
                            <span>{t.label}</span>
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-[#0866F5]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Budget Pills */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[13px] font-bold uppercase tracking-wider text-[#090B10]">
                      3. Budget Expectation
                    </label>
                    <div className="flex flex-col gap-2">
                      {BUDGET_OPTIONS.map((b) => {
                        const isSelected = selectedBudget === b.id
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBudget(b.id)}
                            className={cn(
                              "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[13px] transition-all cursor-pointer select-none",
                              isSelected
                                ? "border-[#0866F5] bg-[#0866F5]/10 text-[#0866F5] font-bold"
                                : "border-[#E5E7EB] bg-[#F8FAFC] text-[#334155] hover:bg-white hover:border-[#0866F5]/30 font-medium"
                            )}
                          >
                            <span>{b.label}</span>
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-[#0866F5]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* ── STEP 3: CLIENT CONTACT INFO (MINIMAL & FAST) ──────── */}
                <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-6">
                  <label className="text-[13px] font-bold uppercase tracking-wider text-[#090B10]">
                    4. How should we reach you?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name / Company"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Work Email (e.g. name@company.com)"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Optional Quick Message (1 Line) */}
                  <div className="mt-1">
                    <input
                      type="text"
                      name="message"
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      placeholder="Optional quick note or reference link (e.g. need a look like apex-spatial.studio)"
                      className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-[13px] text-[#090B10] placeholder:text-[#94A3B8] focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Error Banner if submission fails */}
                {status === "error" && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">
                    {errorMessage || "Submission failed. Please check your connection or contact us directly."}
                  </div>
                )}

                {/* ── SUBMIT BUTTON & TRUST SIGNALS ─────────────────────── */}
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={cn(
                      "group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#090B10] px-6 text-[15px] font-bold text-white transition-all hover:bg-[#0866F5] active:scale-[0.99] shadow-cta cursor-pointer",
                      status === "submitting" ? "opacity-80 cursor-wait" : ""
                    )}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Conversation</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Reassurance Signals */}
                  {/* Reassurance Signals — stack on mobile, inline on sm+ */}
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 font-mono text-[11px] text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>100% Confidential</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#0866F5]" />
                      <span>Response in &lt; 4 Hours</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-[#090B10]" />
                      <span>Agreed scope before payment</span>
                    </span>
                  </div>
                </div>

              </form>
            )}

          </div>

          {/* Bottom Direct Contact Alternative */}
          <div className="mt-8 text-center font-mono text-[12px] text-[#64748B]">
            Prefer direct email or WhatsApp? Reach us at{" "}
            <a
              href="mailto:hello@keyspex.in"
              className="font-bold text-[#0866F5] hover:underline"
            >
              hello@keyspex.in
            </a>
          </div>

        </div>
      </PageContainer>
    </section>
  )
}
