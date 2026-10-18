import React from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaceholderVisual } from "./PlaceholderVisual"
import { cn } from "@/lib/utils"

export interface ProjectPreviewProps {
  title: string
  category: string
  description: string
  href: string
  variant: "website" | "tool" | "optimization"
  featured?: boolean
  className?: string
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  title,
  category,
  description,
  href,
  variant,
  featured = false,
  className,
}) => {
  const titleId = `project-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`

  return (
    <article
      aria-labelledby={titleId}
      className={cn("group flex flex-col justify-between", className)}
    >
      {/* Visual Canvas with Role & ARIA label */}
      <div
        role="img"
        aria-label={`Demonstration preview of ${title}`}
        className="w-full"
      >
        <PlaceholderVisual
          variant={variant}
          aspectClass={featured ? "aspect-[4/3]" : "aspect-[16/10]"}
          hasFold={featured}
        />
      </div>

      {/* Metadata under visual */}
      <div className="mt-6 flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0866F5]">
          {category}
        </span>

        <h3
          id={titleId}
          className="mt-2 text-[24px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#090B10]"
        >
          {title}
        </h3>

        <p className="mt-2 text-[16px] leading-[1.7] text-[#334155] max-w-[28rem]">
          {description}
        </p>

        <div className="mt-5">
          <Button
            asChild
            variant="link"
            className="text-[15px] font-semibold text-[#090B10]"
          >
            <a
              href={href}
              aria-label={`View project details for ${title}`}
              className="inline-flex items-center gap-1.5"
            >
              <span>View project details</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}
