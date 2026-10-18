import React from "react"
import { PageContainer } from "./PageContainer"
import { Logo } from "./Logo"
import { siteConfig } from "@/config/site"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#090B10] pt-12 sm:pt-20 pb-8 text-white">
      <PageContainer>
        <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-2 md:gap-12 md:pb-16 lg:grid-cols-12">
          {/* Brand Column (cols 1-5 on lg) */}
          <div className="flex flex-col items-start lg:col-span-5">
            {/* 
              TODO(keyspex): replace plate with a supplied white/reverse logo if one is created.
              The white plate is a legibility necessity per DESIGN.md §2.6 since the logo contains black lettering.
            */}
            <div className="inline-flex rounded-[6px] bg-white px-5 py-4">
              <Logo variant="footer" />
            </div>

            <p className="mt-5 sm:mt-6 max-w-[18rem] text-[14px] sm:text-[16px] leading-relaxed text-[#94A3B8]">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Navigate Column (cols 6-7 on lg) */}
          <div className="flex flex-col lg:col-span-2">
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Navigate
            </h3>
            <ul className="flex flex-col space-y-3 text-[15px]">
              <li>
                <a
                  href="#services"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Our Work
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column (cols 8-10 on lg) */}
          <div className="flex flex-col lg:col-span-3">
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Services
            </h3>
            <ul className="flex flex-col space-y-3 text-[15px]">
              <li>
                <a
                  href="#services"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Website Development
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Custom Digital Solutions
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-[#5B9BFF] hover:underline-offset-4"
                >
                  Digital Growth & Optimization
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column (cols 11-12 on lg) */}
          <div className="flex flex-col lg:col-span-2">
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Contact
            </h3>
            <p className="text-[14px] text-[#94A3B8]">
              Contact details coming soon.
            </p>

            {/* Social links rendered only if supplied */}
            {siteConfig.social && siteConfig.social.length > 0 && (
              <ul className="mt-4 flex space-x-3">
                {siteConfig.social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      className="text-[#94A3B8] transition-colors hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.12] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[#94A3B8]">
            © {currentYear} KeySpex. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("replay-logo-loader"))}
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-[#94A3B8] hover:text-[#5B9BFF] transition-colors"
            title="Replay KeySpex Brand Intro"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0866F5] transition-transform group-hover:scale-150" />
            <span>Replay Intro Animation</span>
          </button>
        </div>
      </PageContainer>
    </footer>
  )
}
