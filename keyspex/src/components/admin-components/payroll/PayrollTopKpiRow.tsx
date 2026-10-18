import {
  Banknote,
  Cloud,
  Users,
  Flame,
  TrendingUp,
  CalendarDays,
} from "lucide-react"
import { KpiCard } from "../KpiCard"
import type { PayrollData } from "@/lib/admin/payrollService"

export type PayrollTopKpiRowProps = {
  data: PayrollData
  onAddPayee?: () => void
}

/**
 * PayrollTopKpiRow — 6 strategic financial & labor KPIs for startup operations.
 */
export function PayrollTopKpiRow({ data, onAddPayee }: PayrollTopKpiRowProps) {
  const { kpis } = data

  const items = [
    {
      id: "core-payroll",
      label: "MONTHLY CORE PAYROLL",
      icon: Banknote,
      iconTone: "info" as const,
      value: kpis.corePayroll,
      isCurrency: true,
      delta: "+12.4% vs Q3",
      caption: `${kpis.totalStaffCount} Employees (${kpis.activeEmployeesCount} Active)`,
    },
    {
      id: "saas-subscriptions",
      label: "SAAS & TOOL LICENSES",
      icon: Cloud,
      iconTone: "purple" as const,
      value: kpis.subscriptionsCost,
      isCurrency: true,
      badgeText: `${kpis.subscriptionsCount} Subscriptions`,
      caption: "Cloud, CDN & Dev Tools",
    },
    {
      id: "contractor-payouts",
      label: "CONTRACTOR & TEMP PAYOUTS",
      icon: Users,
      iconTone: "warning" as const,
      value: kpis.contractorPayouts,
      isCurrency: true,
      chipText: `${kpis.contractorsCount} Milestone Pods`,
      caption: "One-Time & Sprint Rates",
    },
    {
      id: "total-monthly-burn",
      label: "TOTAL MONTHLY LABOR BURN",
      icon: Flame,
      iconTone: "danger" as const,
      value: kpis.totalMonthlyBurn,
      isCurrency: true,
      caption: "Core + Subs + Contractors",
      badgeText: "Fixed Run-Rate",
    },
    {
      id: "revenue-payroll-ratio",
      label: "REVENUE / PAYROLL MULTIPLIER",
      icon: TrendingUp,
      iconTone: "success" as const,
      value: `${kpis.revenueToPayrollMultiplier}x`,
      isCurrency: false,
      delta: "Benchmark > 3.0x",
      caption: `₹${(kpis.totalRevenue / 100000).toFixed(2)}L Realized Inflows`,
    },
    {
      id: "next-payroll-run",
      label: "NEXT SETTLEMENT DATE",
      icon: CalendarDays,
      iconTone: "info" as const,
      value: "Oct 31",
      isCurrency: false,
      chipText: "Auto-ACH Run",
      caption: `₹${(kpis.nextSettlementAmount / 100000).toFixed(2)}L in 3 Days`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <KpiCard {...item} />
          {item.id === "contractor-payouts" && onAddPayee && (
            <button
              type="button"
              onClick={onAddPayee}
              className="absolute top-3.5 right-12 text-[11px] font-semibold text-[#0866F5] hover:text-[#0556D1] hover:underline cursor-pointer opacity-90 transition-opacity"
            >
              + Add
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
