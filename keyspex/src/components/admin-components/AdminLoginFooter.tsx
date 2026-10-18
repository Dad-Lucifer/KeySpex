import { Link } from "react-router-dom"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export type AdminLoginFooterProps = {
  className?: string
}

/**
 * AdminLoginFooter — Bottom status and navigation footer for the admin login screen.
 * Derived from StatusBar (admin.md §10.1.9).
 */
export function AdminLoginFooter({ className }: AdminLoginFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-center text-[13px] text-[#64748B]",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1 text-[12px] shadow-xs">
        <span className="h-2 w-2 rounded-full bg-[#15803D]" aria-hidden="true" />
        <span className="font-medium text-[#334155]">
          KeySpex Admin • Demo environment
        </span>
        <span className="text-[#94A3B8]">|</span>
        <span className="font-mono text-[11px] text-[#64748B]">SANDBOX V1</span>
      </div>

      <div className="flex items-center gap-4 text-[13px]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-medium text-[#0866F5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] rounded-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Return to public website</span>
        </Link>
        <span className="text-[#DCE4F0]">•</span>
        <span className="inline-flex items-center gap-1 text-[#64748B]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" strokeWidth={1.75} />
          <span>256-bit Simulated SSL</span>
        </span>
      </div>
    </div>
  )
}
