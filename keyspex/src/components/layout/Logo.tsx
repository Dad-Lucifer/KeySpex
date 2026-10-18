import React from "react"
import { cn } from "@/lib/utils"
import keyspexLogo from "@/assets/KeySpex-Logo-png.png"

interface LogoProps {
  variant?: "navbar" | "footer" | "sheet"
  className?: string
  priority?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  variant = "navbar",
  className,
  priority = false,
}) => {
  // Real dimensions of src/assets/KeySpex-Logo-png.png: 2068 x 760
  const heightClass =
    variant === "footer"
      ? "h-14 sm:h-16"
      : variant === "sheet"
      ? "h-10"
      : "h-10 sm:h-11 md:h-[50px]"

  const img = (
    <img
      src={keyspexLogo}
      width={2068}
      height={760}
      alt="KeySpex — Custom Digital Solutions for Real Businesses"
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "w-auto object-contain",
        heightClass,
        className
      )}
    />
  )

  return (
    <a
      href="#top"
      aria-label="KeySpex home"
      className="inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
    >
      {img}
    </a>
  )
}
