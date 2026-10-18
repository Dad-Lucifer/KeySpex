import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { TrustStrip } from "@/components/landing/TrustStrip"
import { ServicesSection } from "@/components/landing/ServicesSection"
import { PortfolioSection } from "@/components/landing/PortfolioSection"
import { BrandStatement } from "@/components/landing/BrandStatement"
import { ProcessSection } from "@/components/landing/ProcessSection"
import { ContactSection } from "@/components/landing/ContactSection"
import { LogoLoader } from "@/components/ui/LogoLoader"

export const HomePage = () => {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const handleReplay = () => setShowLoader(true)
    window.addEventListener("replay-logo-loader", handleReplay)
    return () => window.removeEventListener("replay-logo-loader", handleReplay)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#090B10]">
      {showLoader && (
        <LogoLoader onComplete={() => setShowLoader(false)} />
      )}
      {/* Skip to Content for Accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0866F5] focus:shadow-md focus:ring-2 focus:ring-[#0866F5]"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <HeroSection />
        <TrustStrip />
        <ServicesSection />
        <PortfolioSection />
        <BrandStatement />
        <ProcessSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
