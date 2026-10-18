import React, { useState } from "react"
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, UserPlus, LogIn, Flame } from "lucide-react"
import { AdminLoginField } from "./AdminLoginField"
import { AdminLoginSubmitBtn } from "./AdminLoginSubmitBtn"
import { AdminAuthModeToggle, type AuthMode } from "./AdminAuthModeToggle"
import { AdminRoleSelector } from "./AdminRoleSelector"
import {
  signUpWithFirebase,
  signInWithFirebase,
  type UserRole,
  type AuthUserData,
} from "@/lib/authService"
import { cn } from "@/lib/utils"

export type AdminUserPayload = AuthUserData

export type AdminLoginFormProps = {
  initialMode?: AuthMode
  onSuccess?: (user: AuthUserData) => void
  className?: string
}

const DEMO_PRESETS: Array<{ username: string; label: string; role: UserRole }> = [
  { username: "superadmin", label: "Admin", role: "Admin" },
  { username: "riya.hr", label: "Employee", role: "Employee" },
  { username: "apex.client", label: "Client", role: "Client" },
]

/**
 * AdminLoginForm — Form organism handling Firebase authentication & role storage for
 * the 3 roles: Admin, Employee, and Client.
 */
export function AdminLoginForm({
  initialMode = "signin",
  onSuccess,
  className,
}: AdminLoginFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [role, setRole] = useState<UserRole>("Admin")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<{
    title: string
    subtitle: string
    user: AuthUserData
  } | null>(null)

  // Quick fill preset helper for the 3 roles
  const handleQuickFillPreset = (preset: { username: string; role: UserRole }) => {
    setMode("signin")
    setUsername(preset.username)
    setPassword("admin2026")
    setRole(preset.role)
    setError(null)
  }

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const cleanUsername = username.trim()
    if (!cleanUsername) {
      setError("Please enter a username.")
      return
    }
    if (!password) {
      setError("Please enter a password.")
      return
    }

    if (mode === "signup") {
      if (cleanUsername.length < 3) {
        setError("Username must be at least 3 characters long.")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long for Firebase security.")
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please re-enter.")
        return
      }
    }

    setLoading(true)

    try {
      if (mode === "signup") {
        // Register user and store credentials/role in Firebase Auth & Firestore
        const userData = await signUpWithFirebase(cleanUsername, password, role)

        setSuccessInfo({
          title: "Firebase Credentials Stored",
          subtitle: `Created ${role} account for @${cleanUsername}`,
          user: userData,
        })

        setTimeout(() => {
          onSuccess?.(userData)
        }, 800)
      } else {
        // Sign In via Firebase Auth and fetch role from Firestore
        const userData = await signInWithFirebase(cleanUsername, password)

        setSuccessInfo({
          title: "Firebase Authentication Verified",
          subtitle: `Signed in as @${userData.username} • Role: ${userData.role}`,
          user: userData,
        })

        setTimeout(() => {
          onSuccess?.(userData)
        }, 700)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error"
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password")) {
        setError("Invalid username or password. Check credentials or use Sign Up to create an account.")
      } else if (msg.includes("auth/email-already-in-use")) {
        setError(`Username "${cleanUsername}" is already registered. Please sign in instead.`)
      } else {
        setError(msg || "Authentication failed. Please verify credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (successInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D] ring-8 ring-[#DCFCE7]/60">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
        </div>
        <h3 className="mt-4 text-[20px] font-bold text-[#090B10]">
          {successInfo.title}
        </h3>
        <p className="mt-1.5 text-[14px] text-[#64748B]">
          {successInfo.subtitle}
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-full border border-[#D3E4FD] bg-[#E8F1FE] px-3.5 py-1 text-[12px] font-mono text-[#0556D1]">
          <span className="font-semibold">{successInfo.user.role} Portal</span>
          <span>•</span>
          <span>@{successInfo.user.username}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Mode Switcher Tabs */}
      <AdminAuthModeToggle mode={mode} onChange={handleModeChange} />

      {/* Firebase & Demo Presets Bar */}
      {mode === "signin" ? (
        <div className="flex flex-col gap-2 rounded-[10px] border border-[#D3E4FD] bg-[#F3F8FF] p-2.5 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-[#090B10]">
              <Flame className="h-3.5 w-3.5 text-[#F97316]" />
              <span>Firebase Roles:</span>
            </span>
            <span className="font-mono text-[11px] text-[#64748B]">pass: admin2026</span>
          </div>

          <div className="flex items-center gap-1.5">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.username}
                type="button"
                onClick={() => handleQuickFillPreset(preset)}
                className="flex-1 rounded-[6px] border border-[#CBD5E1] bg-white py-1 text-[11px] font-semibold text-[#334155] shadow-xs transition-colors hover:border-[#0866F5] hover:text-[#0866F5] cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Role Selector in Sign Up Mode */
        <AdminRoleSelector
          role={role}
          onChange={setRole}
          disabled={loading}
        />
      )}

      <form
        onSubmit={handleSubmit}
        aria-label={mode === "signin" ? "Admin sign in" : "Admin sign up"}
        className="flex flex-col gap-4"
      >
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-[10px] border border-[#FECACA] bg-[#FEE2E2]/60 p-3 text-[13px] text-[#B91C1C]"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Username Field */}
        <AdminLoginField
          id="admin-username"
          label={mode === "signup" ? `Choose ${role} Username` : "Username"}
          type="text"
          required
          value={username}
          onChange={setUsername}
          placeholder={mode === "signup" ? `e.g. ${role.toLowerCase()}_user` : "e.g. superadmin"}
          autoComplete="username"
          disabled={loading}
          leftIcon={User}
        />

        {/* Password Field */}
        <AdminLoginField
          id="admin-password"
          label={mode === "signup" ? "Create Password (min 6 chars)" : "Password"}
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={setPassword}
          placeholder="••••••••••••"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          disabled={loading}
          leftIcon={Lock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:text-[#090B10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          }
        />

        {/* Confirm Password Field (Sign Up Mode) */}
        {mode === "signup" && (
          <AdminLoginField
            id="admin-confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••••••"
            autoComplete="new-password"
            disabled={loading}
            leftIcon={Lock}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] transition-colors hover:text-[#090B10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            }
          />
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <AdminLoginSubmitBtn loading={loading}>
            {mode === "signin"
              ? "Sign In to KeySpex"
              : `Sign Up as ${role}`}
          </AdminLoginSubmitBtn>
        </div>

        {/* Mode Switch Toggle Button */}
        <div className="flex items-center justify-center pt-1 text-[13px]">
          {mode === "signin" ? (
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <span>Need a new role account?</span>
              <button
                type="button"
                onClick={() => handleModeChange("signup")}
                className="inline-flex items-center gap-1 font-semibold text-[#0866F5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] rounded-sm cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up (Admin / Employee / Client)</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <span>Already registered in Firebase?</span>
              <button
                type="button"
                onClick={() => handleModeChange("signin")}
                className="inline-flex items-center gap-1 font-semibold text-[#0866F5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866F5] rounded-sm cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
