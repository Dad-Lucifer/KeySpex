import { Link } from "react-router-dom"
import { CalendarPlus, Clock } from "lucide-react"
import { AdminCard } from "./AdminCard"
import { CardHeader } from "./CardHeader"
import { DateTile } from "./DateTile"
import { StatusBadge } from "./StatusBadge"
import { upcomingEventsData } from "@/data/admin/dashboardData"
import type { Tone } from "@/types/admin"

export type UpcomingEventsCardProps = {
  className?: string
}

const CATEGORY_TONES: Record<string, Tone> = {
  project_deadline: "info",
  operations: "neutral",
  financial: "warning",
  client_meeting: "purple",
}

/**
 * UpcomingEventsCard — Events list per admin.md §10.10.
 */
export function UpcomingEventsCard({ className }: UpcomingEventsCardProps) {
  return (
    <AdminCard className={className}>
      <CardHeader
        title="Upcoming Events"
        subtitle="Schedules, reviews, and client syncs"
        actions={
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#090B10] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
            aria-label="Add event"
          >
            <CalendarPlus className="h-4 w-4" strokeWidth={1.75} />
          </button>
        }
      />

      <div className="flex flex-col gap-3 py-1 flex-1">
        {upcomingEventsData.map((evt) => {
          const tone = CATEGORY_TONES[evt.category] || "info"

          return (
            <div
              key={evt.id}
              className="flex items-center gap-3 rounded-[10px] border border-[#DCE4F0] bg-white p-3 transition-colors hover:border-[#CBD5E1]"
            >
              <DateTile month={evt.month} day={evt.day} tone={tone} />

              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#090B10] truncate">
                    {evt.title}
                  </h3>
                  <StatusBadge tone={tone} size="sm">
                    {evt.categoryLabel}
                  </StatusBadge>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#64748B] truncate">
                  <Clock className="h-3.5 w-3.5 text-[#94A3B8]" strokeWidth={1.75} />
                  <span className="whitespace-nowrap font-medium text-[#475569]">{evt.time}</span>
                  <span>•</span>
                  <span className="truncate">{evt.context}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-3.5 text-[13px]">
        <span className="text-[#64748B]">4 meetings queued this cycle</span>
        <Link
          to="/admin/calendar"
          className="font-semibold text-[#0866F5] hover:underline"
        >
          Open Full Calendar
        </Link>
      </div>
    </AdminCard>
  )
}
