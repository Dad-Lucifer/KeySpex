import React from "react"
import { cn } from "@/lib/utils"

interface FacetBackdropProps {
  tone?: "light" | "dark"
  className?: string
  withPath?: boolean
}

export const FacetBackdrop: React.FC<FacetBackdropProps> = ({
  tone = "light",
  className,
  withPath = false,
}) => {
  const isDark = tone === "dark"

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden z-0",
        "opacity-85 lg:opacity-100",
        className
      )}
    >
      {isDark ? (
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
          focusable="false"
          className="absolute inset-0 h-full w-full"
        >
          {/* Dark tone: strokes only, no fill */}
          <polygon
            points="700,900 1440,50 1440,900"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <polygon
            points="980,900 1440,370 1440,900"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <polygon
            points="1180,900 1440,601 1440,900"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          {/* Creases */}
          <line
            x1="700"
            y1="900"
            x2="1440"
            y2="50"
            stroke="#FFFFFF"
            strokeOpacity="0.10"
            strokeWidth="1.5"
          />
          <line
            x1="980"
            y1="900"
            x2="1440"
            y2="370"
            stroke="#FFFFFF"
            strokeOpacity="0.10"
            strokeWidth="1.5"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMaxYMax slice"
          aria-hidden="true"
          focusable="false"
          className="absolute inset-0 h-full w-full"
        >
          {/* Plane 1: largest, lightest */}
          <polygon
            points="700,900 1440,50 1440,900"
            fill="#E8F1FE"
            fillOpacity="0.60"
          />
          {/* Plane 2 */}
          <polygon
            points="980,900 1440,370 1440,900"
            fill="#D3E4FD"
            fillOpacity="0.50"
          />
          {/* Plane 3: smallest, deepest */}
          <polygon
            points="1180,900 1440,601 1440,900"
            fill="#A9CBFB"
            fillOpacity="0.35"
          />
          {/* Creases (paper highlights) */}
          <line
            x1="700"
            y1="900"
            x2="1440"
            y2="50"
            stroke="#FFFFFF"
            strokeOpacity="0.95"
            strokeWidth="1.5"
          />
          <line
            x1="980"
            y1="900"
            x2="1440"
            y2="370"
            stroke="#FFFFFF"
            strokeOpacity="0.80"
            strokeWidth="1.5"
          />

          {withPath && (
            // Hero dashed path rendered when requested in backdrop or local
            <g className="hidden lg:block">
              <path
                d="M 620 780 C 720 590, 900 690, 1008 428"
                fill="none"
                stroke="#0866F5"
                strokeOpacity="0.30"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />
              <circle
                cx="1008"
                cy="428"
                r="8"
                fill="#FFFFFF"
                stroke="#0866F5"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
