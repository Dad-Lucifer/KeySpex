import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AdminLoginCard,
  AdminLoginBrand,
  AdminLoginForm,
  AdminLoginFooter,
  type AdminUserPayload,
} from "@/components/admin-components"

/**
 * AdminLoginPage — Dedicated administrative sign-in portal.
 * Composes independent building blocks from src/components/admin-components/.
 * Follows layout and design constraints from admin.md and DESIGN.md.
 */
export function AdminLoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Admin Sign In — KeySpex Admin"
  }, [])

  const handleLoginSuccess = (user: AdminUserPayload) => {
    // Save session in local storage for demo purposes
    try {
      localStorage.setItem("keyspex_admin_user", JSON.stringify(user))
    } catch {
      // Storage unavailable or disabled
    }

    // Navigate to admin dashboard
    navigate("/admin/dashboard")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle background ambient grid (matches utilitarian admin aesthetic) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"
        aria-hidden="true"
      />

      <main className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-6">
        <AdminLoginCard>
          <AdminLoginBrand />

          <div className="h-[1px] w-full bg-[#E5E7EB]" aria-hidden="true" />

          <AdminLoginForm onSuccess={handleLoginSuccess} />
        </AdminLoginCard>

        <AdminLoginFooter />
      </main>
    </div>
  )
}

export default AdminLoginPage
