import { useEffect, useState } from "react"
import {
  AdminShell,
  PageHeader,
  KpiGrid,
  RevenueOverviewCard,
  BudgetUtilizationCard,
  RevenueByProjectCard,
  UpcomingObligationsCard,
  RecentActivityCard,
  UpcomingEventsCard,
} from "@/components/admin-components"
import { kpiItemsSeed } from "@/data/admin/dashboardData"
import { getStoredUser, type AuthUserData } from "@/lib/authService"

/**
 * AdminDashboardPage — Master enterprise dashboard page.
 * Recreates the exact layout, density, and component anatomy of the reference screenshot.
 * Conforms to admin.md §11 composition blueprints.
 */
export function AdminDashboardPage() {
  const [currentUser] = useState<AuthUserData | null>(() => getStoredUser())

  useEffect(() => {
    document.title = "Dashboard — KeySpex Admin"
  }, [])

  const displayName = currentUser?.name?.split(" ")[0] || "Admin"

  return (
    <AdminShell>
      {/* 1. Page Header */}
      <PageHeader userName={displayName} />

      {/* 2. Top Metric KPI Row (6 Cards) */}
      <KpiGrid items={kpiItemsSeed} />

      {/* 3. Primary Comparative & Budget Split Row (Col 7 / Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Col 7): Revenue Trajectory + Project Realization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RevenueOverviewCard />
          <RevenueByProjectCard />
        </div>

        {/* Right Column (Col 5): Budget Gauge + Upcoming Obligations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <BudgetUtilizationCard />
          <UpcomingObligationsCard />
        </div>
      </div>

      {/* 4. Secondary Row: Recent Activity & Calendar Events (Items Stretch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <RecentActivityCard className="w-full flex-1" />
        </div>
        <div className="lg:col-span-5 flex">
          <UpcomingEventsCard className="w-full flex-1" />
        </div>
      </div>
    </AdminShell>
  )
}

export default AdminDashboardPage
