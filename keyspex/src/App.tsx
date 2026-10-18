import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { HomePage } from "@/pages/HomePage"

const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"))
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"))
const BudgetRevenuePage = lazy(() => import("@/pages/BudgetRevenuePage"))
const PayrollPage = lazy(() => import("@/pages/PayrollPage"))

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page (completely preserved and untouched) */}
        <Route path="/" element={<HomePage />} />

        {/* Dedicated Admin Login UI/UX */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />

        {/* Budget & Revenue Tracking System */}
        <Route
          path="/admin/budgets-revenue"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
              <BudgetRevenuePage />
            </Suspense>
          }
        />

        {/* Total Project & Salaries Tracking System */}
        <Route
          path="/admin/payroll"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
              <PayrollPage />
            </Suspense>
          }
        />

        {/* Admin routes hierarchy */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
