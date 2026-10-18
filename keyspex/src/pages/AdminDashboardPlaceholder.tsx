import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, ArrowLeft, CheckCircle, Shield, Users, Building2, Flame } from "lucide-react"
import { AdminDemoBadge } from "@/components/admin-components"
import { signOutFirebase, type UserRole } from "@/lib/authService"
import logoImg from "@/assets/KeySpex-Logo-png.png"

/**
 * AdminDashboardPlaceholder — Role-aware dashboard destination.
 * Adapts view and status based on the 3 roles: Admin, Employee, Client.
 */
export function AdminDashboardPlaceholder() {
  const navigate = useNavigate()
  const [user] = useState<{
    uid?: string
    username?: string
    email?: string
    name: string
    role: UserRole
  } | null>(() => {
    try {
      const stored = localStorage.getItem("keyspex_admin_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    document.title = `${user?.role || "Admin"} Portal — KeySpex`
  }, [user?.role])

  const handleSignOut = async () => {
    await signOutFirebase()
    navigate("/admin/login")
  }

  const role = user?.role || "Admin"

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Topbar showing Role and Firebase info */}
      <header className="flex h-16 items-center justify-between border-b border-[#DCE4F0] bg-white px-6">
        <div className="flex items-center gap-4">
          <img
            src={logoImg}
            alt="KeySpex"
            height={36}
            className="h-9 w-auto object-contain"
          />
          <div className="hidden sm:flex items-center gap-2">
            <AdminDemoBadge />
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>Firebase Ready</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <p className="font-semibold text-[#090B10]">{user?.name || "Alex Rivera"}</p>
            <span className="inline-block rounded bg-[#E8F1FE] px-2 py-0.5 font-semibold text-[#0556D1]">
              {role}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2]/30 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-lg rounded-2xl border border-[#DCE4F0] bg-white p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F1FE] text-[#0866F5]">
            {role === "Admin" && <Shield className="h-7 w-7" strokeWidth={1.75} />}
            {role === "Employee" && <Users className="h-7 w-7" strokeWidth={1.75} />}
            {role === "Client" && <Building2 className="h-7 w-7" strokeWidth={1.75} />}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-[#090B10]">
            {role} Portal Authenticated
          </h2>

          <p className="mt-2 text-sm text-[#64748B]">
            Welcome, <span className="font-semibold text-[#090B10]">{user?.name || "Alex Rivera"}</span> (<span className="font-mono text-[#0866F5] font-medium">@{user?.username || "superadmin"}</span>).
          </p>

          {/* Role-specific status card */}
          <div className="mt-6 rounded-xl border border-[#DCE4F0] bg-[#F1F5FB] p-4 text-left text-xs text-[#334155]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCE4F0]">
              <span className="font-semibold text-[#0556D1] flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#15803D]" />
                Firebase Credential Verified
              </span>
              <span className="font-mono text-[10px] text-[#64748B]">
                ROLE: {role.toUpperCase()}
              </span>
            </div>

            {role === "Admin" && (
              <p className="text-[#475569]">
                Full enterprise authority enabled: Financial management, Employee directories, Project oversight, and System settings.
              </p>
            )}
            {role === "Employee" && (
              <p className="text-[#475569]">
                Internal staff access enabled: Assigned tasks, attendance, project deliverables, and personal salary statements.
              </p>
            )}
            {role === "Client" && (
              <p className="text-[#475569]">
                Client portal access enabled: Project review, contract documents, milestone verification, and invoices.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/admin/login"
              className="w-full rounded-lg bg-[#0866F5] py-2.5 text-xs font-semibold text-white hover:bg-[#0556D1] transition-colors"
            >
              Switch Role or Log In with Another Account
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#64748B] hover:text-[#090B10]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to KeySpex Landing Page</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardPlaceholder
