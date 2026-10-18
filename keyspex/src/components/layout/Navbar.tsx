import React, { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { PageContainer } from "./PageContainer"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { LoginModal } from "@/components/landing/LoginModal"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  sectionId: string
}

const navItems: NavItem[] = [
  { label: "Services", href: "#services", sectionId: "services" },
  { label: "Our Work", href: "#work", sectionId: "work" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
]

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.sectionId)).filter(Boolean) as HTMLElement[]

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href: string) => {
    setSheetOpen(false)
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-20 w-full border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-shadow duration-200",
        scrolled && "shadow-[0_1px_2px_rgba(9,11,16,0.04)]"
      )}
    >
      <PageContainer className="flex h-full items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo variant="navbar" priority />
        </div>

        {/* Right Desktop Nav */}
        <nav aria-label="Primary" className="hidden md:flex md:items-center">
          <ul className="flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative py-2 text-[15px] font-medium transition-colors duration-200",
                      isActive
                        ? "text-[#090B10] font-semibold"
                        : "text-[#090B10]/80 hover:text-[#090B10]"
                    )}
                  >
                    {item.label}
                    {/* Animated or persistent 1.5px royal-blue underline */}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-[1.5px] w-full bg-[#0866F5] transition-transform duration-250 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100 origin-left"
                      )}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="ml-8 flex items-center gap-3">
            <LoginModal />
            <Button
              asChild
              variant="primary"
              size="md"
              className="text-[15px]"
            >
              <a href="#contact">Let’s Talk</a>
            </Button>
          </div>
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#090B10] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Primary navigation menu
              </SheetDescription>

              <div className="flex flex-col h-full pt-4 pb-6">
                <div className="mb-6">
                  <Logo variant="sheet" />
                </div>
                <Separator className="mb-4" />

                <nav aria-label="Mobile Navigation" className="flex-1">
                  <ul className="flex flex-col">
                    {navItems.map((item) => (
                      <li key={item.href} className="border-b border-[#E5E7EB]">
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavClick(item.href)
                          }}
                          className="flex py-5 text-[24px] font-semibold text-[#090B10] transition-colors hover:text-[#0866F5]"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="pt-6 flex flex-col gap-3">
                  <LoginModal
                    trigger={
                      <button
                        type="button"
                        onClick={() => setSheetOpen(false)}
                        className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white text-base font-semibold text-[#090B10] transition-colors hover:border-[#0866F5] hover:text-[#0866F5] cursor-pointer"
                      >
                        Log In to Portal
                      </button>
                    }
                  />
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="w-full text-base h-12"
                  >
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick("#contact")
                      }}
                    >
                      Let’s Talk
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  )
}
