import React, { useState } from "react"
import { Eye, EyeOff, Lock, User, Loader2, ArrowRight, CheckCircle2, UserPlus, LogIn, Shield, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  signUpWithFirebase,
  signInWithFirebase,
  type UserRole,
  type AuthUserData,
} from "@/lib/authService"
import { cn } from "@/lib/utils"

export interface LoginFormProps {
  onSuccess?: (user: AuthUserData) => void
  onClose?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onClose }) => {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [role, setRole] = useState<UserRole>("Client")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanUsername = username.trim()
    if (!cleanUsername) {
      setErrorMessage("Please enter a username.")
      return
    }
    if (!password) {
      setErrorMessage("Please enter a password.")
      return
    }

    if (mode === "signup") {
      if (cleanUsername.length < 3) {
        setErrorMessage("Username must be at least 3 characters.")
        return
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.")
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.")
        return
      }
    }

    setLoading(true)

    try {
      if (mode === "signup") {
        const userData = await signUpWithFirebase(cleanUsername, password, role)
        setIsSuccess(true)
        onSuccess?.(userData)
        setTimeout(() => {
          onClose?.()
        }, 1000)
      } else {
        const userData = await signInWithFirebase(cleanUsername, password)
        setIsSuccess(true)
        onSuccess?.(userData)
        setTimeout(() => {
          onClose?.()
        }, 1000)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error"
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password")) {
        setErrorMessage("Invalid username or password. Check credentials or sign up below.")
      } else {
        setErrorMessage(msg || "Authentication failed. Please verify credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h4 className="mt-4 text-[20px] font-bold text-[#090B10]">
          {mode === "signup" ? "Account Created" : "Welcome Back"}
        </h4>
        <p className="mt-1.5 text-[14px] text-[#64748B]">
          Signed in as <span className="font-semibold text-[#090B10]">@{username}</span>
          <span className="ml-1.5 inline-block rounded bg-[#E8F1FE] px-2 py-0.5 text-xs font-semibold text-[#0556D1]">
            {role}
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode switcher tabs */}
      <div className="grid grid-cols-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-1 text-[13px] font-semibold">
        <button
          type="button"
          onClick={() => { setMode("login"); setErrorMessage(null) }}
          className={cn(
            "flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer",
            mode === "login"
              ? "bg-white text-[#090B10] shadow-xs border border-[#E5E7EB]"
              : "text-[#64748B] hover:text-[#090B10]"
          )}
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Log In</span>
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); setErrorMessage(null) }}
          className={cn(
            "flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer",
            mode === "signup"
              ? "bg-white text-[#090B10] shadow-xs border border-[#E5E7EB]"
              : "text-[#64748B] hover:text-[#090B10]"
          )}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Sign Up</span>
        </button>
      </div>

      {/* Role Picker in Sign Up Mode */}
      {mode === "signup" && (
        <div className="space-y-1.5 text-left">
          <label className="block text-[13px] font-semibold text-[#090B10]">
            Account Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Admin", label: "Admin", icon: Shield },
              { id: "Employee", label: "Employee", icon: Users },
              { id: "Client", label: "Client", icon: Building2 },
            ].map((r) => {
              const Icon = r.icon
              const isSelected = role === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as UserRole)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-all cursor-pointer",
                    isSelected
                      ? "border-[#0866F5] bg-[#F3F8FF] text-[#0866F5] ring-1 ring-[#0866F5]"
                      : "border-[#E5E7EB] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{r.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Username input */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="portal-username"
            className="block text-[13px] font-semibold text-[#090B10]"
          >
            {mode === "signup" ? `Choose ${role} Username` : "Username"}
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="portal-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === "signup" ? `username` : "admin, employee, or client"}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="portal-password"
            className="block text-[13px] font-semibold text-[#090B10]"
          >
            {mode === "signup" ? "Create Password (min 6 chars)" : "Password"}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="portal-password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 pl-10 pr-10 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#090B10] transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password (in signup mode) */}
        {mode === "signup" && (
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="portal-confirm-password"
              className="block text-[13px] font-semibold text-[#090B10]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="portal-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full bg-[#090B10] text-[14px] font-bold text-white hover:bg-[#0866F5] active:scale-[0.99] transition-all shadow-cta"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{mode === "signup" ? `Creating ${role} Account...` : "Authenticating..."}</span>
            </>
          ) : (
            <span className="inline-flex items-center justify-center gap-1.5">
              <span>{mode === "signup" ? `Sign Up as ${role}` : "Log In"}</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* Switch button under submit */}
        <div className="flex items-center justify-center pt-1 text-[13px] text-[#64748B]">
          {mode === "login" ? (
            <div className="flex items-center gap-1">
              <span>Don't have an account?</span>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMessage(null) }}
                className="font-semibold text-[#0866F5] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>Already registered?</span>
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMessage(null) }}
                className="font-semibold text-[#0866F5] hover:underline cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export interface LoginModalProps {
  trigger?: React.ReactNode
  variant?: "outline" | "ghost" | "primary"
  className?: string
}

export const LoginModal: React.FC<LoginModalProps> = ({
  trigger,
  variant = "outline",
  className,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-[10px] px-4 py-2 text-[14px] font-semibold transition-all duration-200 cursor-pointer select-none",
              variant === "outline" &&
                "border border-[#E5E7EB] bg-white text-[#090B10] hover:border-[#0866F5] hover:text-[#0866F5] hover:bg-[#0866F5]/5",
              variant === "ghost" &&
                "text-[#090B10]/80 hover:text-[#0866F5] hover:bg-[#0866F5]/5",
              variant === "primary" &&
                "bg-[#090B10] text-white hover:bg-[#0866F5]",
              className
            )}
          >
            Log In
          </button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0866F5]/20 bg-[#0866F5]/5 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0866F5]">
            KeySpex Portal
          </div>
          <DialogTitle>Firebase Authentication</DialogTitle>
          <DialogDescription>
            Sign in or create credentials for Admin, Employee, or Client roles.
          </DialogDescription>
        </DialogHeader>

        <LoginForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
