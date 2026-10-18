import { useEffect, useState } from "react"
import {
  TrendingUp,
  ClipboardList,
  Landmark,
  Banknote,
  FolderKanban,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
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
  CreateNewModal,
} from "@/components/admin-components"
import { kpiItemsSeed } from "@/data/admin/dashboardData"
import { getStoredUser, type AuthUserData } from "@/lib/authService"
import { useDashboardData } from "@/hooks/useDashboardData"

/**
 * AdminDashboardPage — Master enterprise dashboard page.
 * Connected to live Google Firebase Firestore database in real-time.
 * Dynamically computes KPIs, rankings, obligations, and audit logs.
 */
export function AdminDashboardPage() {
  const [currentUser] = useState<AuthUserData | null>(() => getStoredUser())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data,
    loading,
    error,
    isLive,
    addProject,
    addObligation,
    addEvent,
    addActivity,
    resetToBaseline,
  } = useDashboardData()

  useEffect(() => {
    document.title = "Dashboard — KeySpex Admin (Live)"
  }, [])

  const displayName = currentUser?.name?.split(" ")[0] || "Admin"

  // Dynamically mapped KPI items with real database aggregates
  const kpiItems = data
    ? [
        {
          id: "revenue",
          label: "TOTAL REVENUE",
          icon: TrendingUp,
          iconTone: "info" as const,
          value: data.kpis.revenue.value,
          isCurrency: true,
          delta: data.kpis.revenue.delta,
          caption: data.kpis.revenue.caption,
        },
        {
          id: "outstanding",
          label: "OUTSTANDING",
          icon: ClipboardList,
          iconTone: "warning" as const,
          value: data.kpis.outstanding.value,
          isCurrency: true,
          badgeText: data.kpis.outstanding.badgeText,
          caption: data.kpis.outstanding.caption,
        },
        {
          id: "budget",
          label: "TOTAL BUDGET",
          icon: Landmark,
          iconTone: "info" as const,
          value: data.kpis.budget.value,
          isCurrency: true,
          badgeText: data.kpis.budget.badgeText,
          caption: data.kpis.budget.caption,
        },
        {
          id: "salary",
          label: "SALARY PAYABLE",
          icon: Banknote,
          iconTone: "info" as const,
          value: data.kpis.salary.value,
          isCurrency: true,
          chipText: data.kpis.salary.chipText,
          caption: data.kpis.salary.caption,
        },
        {
          id: "projects",
          label: "ACTIVE PROJECTS",
          icon: FolderKanban,
          iconTone: "info" as const,
          value: data.kpis.projects.value,
          isCurrency: false,
          breakdown: data.kpis.projects.breakdown,
        },
        {
          id: "employees",
          label: "TOTAL EMPLOYEES",
          icon: Users,
          iconTone: "info" as const,
          value: data.kpis.employees.value,
          isCurrency: false,
          breakdown: data.kpis.employees.breakdown,
        },
      ]
    : kpiItemsSeed

  return (
    <AdminShell
      isLive={isLive}
      lastSynced={data?.lastSynced}
      onReseedBaseline={resetToBaseline}
    >
      {/* Real-time sync error banner if offline */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3.5 text-[13px] text-[#B91C1C] shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={resetToBaseline}
            className="inline-flex items-center gap-1 font-semibold text-[#DC2626] hover:underline cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reseed Baseline</span>
          </button>
        </div>
      )}

      {/* 1. Page Header with Live Status & Create Action */}
      <PageHeader
        userName={displayName}
        isLive={isLive}
        onCreateNew={() => setIsModalOpen(true)}
      />

      {/* 2. Top Metric KPI Row (6 Cards dynamically wired to database) */}
      <KpiGrid items={kpiItems} />

      {/* 3. Primary Comparative & Budget Split Row (Col 7 / Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Col 7): Revenue Trajectory + Project Realization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RevenueOverviewCard
            data={data?.revenueOverview}
            periodData={data?.revenuePeriodData}
            loading={loading}
          />
          <RevenueByProjectCard
            items={data?.rankedProjects}
            loading={loading}
          />
        </div>

        {/* Right Column (Col 5): Budget Gauge + Upcoming Obligations */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <BudgetUtilizationCard
            data={data?.budgetUtilization}
            loading={loading}
          />
          <UpcomingObligationsCard
            items={data?.obligations}
            loading={loading}
          />
        </div>
      </div>

      {/* 4. Secondary Row: Recent Activity & Calendar Events (Items Stretch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <RecentActivityCard
            items={data?.activities}
            loading={loading}
            className="w-full flex-1"
          />
        </div>
        <div className="lg:col-span-5 flex">
          <UpcomingEventsCard
            items={data?.upcomingEvents}
            loading={loading}
            onAddEvent={() => setIsModalOpen(true)}
            className="w-full flex-1"
          />
        </div>
      </div>

      {/* 5. Live Mutation Modal for Instant Real-Time Database Additions */}
      <CreateNewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={addProject}
        onAddObligation={addObligation}
        onAddEvent={addEvent}
        onAddActivity={addActivity}
      />
    </AdminShell>
  )
}

export default AdminDashboardPage
