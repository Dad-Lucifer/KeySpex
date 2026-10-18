import { cn } from "@/lib/utils"
import logoImg from "@/assets/KeySpex-Logo-png.png"
import { AdminDemoBadge } from "./AdminDemoBadge"

/**
 * AdminLoginBrand — Logo, heading, and demo badge at the top of the login card.
 * Logo rules: admin.md §1 Rule 1, DESIGN.md §2 (no crop, no recolor, no distortion).
 */
export type AdminLoginBrandProps = {
  className?: string
  subtitle?: string
}

export function AdminLoginBrand({
  className,
  subtitle = "KeySpex management & administrative workspace",
}: AdminLoginBrandProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <div className="flex items-center justify-center py-1">
        <img
          src={logoImg}
          alt="KeySpex"
          height={44}
          className="h-11 w-auto max-w-[200px] object-contain select-none"
          draggable={false}
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-[#090B10]">
          Admin Portal
        </h1>
        <p className="text-[14px] text-[#64748B]">
          {subtitle}
        </p>
      </div>

      <div className="pt-0.5">
        <AdminDemoBadge />
      </div>
    </div>
  )
}
