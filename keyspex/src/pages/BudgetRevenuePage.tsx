import { useEffect, useState } from "react"
import { Landmark, Download, AlertCircle, RefreshCw, Sparkles } from "lucide-react"
import { AdminShell } from "@/components/admin-components"
import {
  BRTopKpiRow,
  RevenueVsBudgetChart,
  SpendBreakdownPanel,
  ProjectRealizationTable,
  CashFlowSummaryCard,
  StrategicForecastPanel,
  EditBudgetCapModal,
} from "@/components/admin-components"
import { useBudgetRevenueData } from "@/hooks/useBudgetRevenueData"

/**
 * BudgetRevenuePage — Master Budget & Revenue tracking system.
 * Live-connected to Google Firestore with real-time recalculations,
 * SVG trajectory modeling, project realization metrics, and CAGR forecasts.
 */
export function BudgetRevenuePage() {
  const { data, error, isLive, updateBudgetCap, reseedBaseline } =
    useBudgetRevenueData()
  const [isEditCapOpen, setIsEditCapOpen] = useState(false)

  useEffect(() => {
    document.title = "Budgets & Revenue — KeySpex Admin"
  }, [])

  const handleExportData = () => {
    const report = {
      title: "KeySpex Startup Financial Report",
      generatedAt: new Date().toISOString(),
      fiscalYear: "2026-27",
      kpis: data.kpis,
      spendBreakdown: data.spendBreakdown,
      projectRealizationSummary: data.projectRealizationSummary,
      forecast: data.forecast,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keyspex-financial-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell
      isLive={isLive}
      lastSynced={data?.lastSynced}
      onReseedBaseline={reseedBaseline}
    >
      {/* Offline / Sync Banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3.5 text-[13px] text-[#B91C1C] shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={reseedBaseline}
            className="inline-flex items-center gap-1 font-semibold text-[#DC2626] hover:underline cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reseed Targets</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#090B10] tracking-tight">
              Budget & Revenue Tracking
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F1FE] px-2.5 py-0.5 text-[11px] font-bold text-[#0866F5]">
              <Sparkles className="h-3 w-3" />
              <span>Real-Time Engine</span>
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-[#64748B]">
            Startup financial model, contract realization velocity, and CAGR-based forward projections.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEditCapOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE4F0] bg-white px-3 text-[12px] font-semibold text-[#090B10] hover:bg-[#F8FAFC] shadow-xs transition-colors cursor-pointer"
          >
            <Landmark className="h-4 w-4 text-[#0866F5]" />
            <span>Modify Cap</span>
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0866F5] px-3.5 text-[12px] font-semibold text-white hover:bg-[#0556D1] shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Section 1: 6 Top Strategic KPI Cards */}
      <BRTopKpiRow
        data={data}
        onEditCap={() => setIsEditCapOpen(true)}
      />

      {/* Section 2: Revenue vs Budget Chart (Col 7) + Spend Breakdown (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RevenueVsBudgetChart periodsData={data.periodsData} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <SpendBreakdownPanel
            data={data.spendBreakdown}
            onEditCap={() => setIsEditCapOpen(true)}
          />
        </div>
      </div>

      {/* Section 3: Full Width Sortable Project Realization Table (All 12 Projects) */}
      <ProjectRealizationTable
        projects={data.projectRealization}
        summary={data.projectRealizationSummary}
      />

      {/* Section 4: Cash Flow Summary (Col 5) + Strategic Forecast Panel (Col 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CashFlowSummaryCard data={data.cashFlow} />
        </div>
        <div className="lg:col-span-7 flex flex-col gap-6">
          <StrategicForecastPanel data={data.forecast} />
        </div>
      </div>

      {/* Edit Budget Cap Modal */}
      <EditBudgetCapModal
        isOpen={isEditCapOpen}
        onClose={() => setIsEditCapOpen(false)}
        currentCap={data.kpis.annualBudgetCap}
        onSave={updateBudgetCap}
      />
    </AdminShell>
  )
}

export default BudgetRevenuePage
