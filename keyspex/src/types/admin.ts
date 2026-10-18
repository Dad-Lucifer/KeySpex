import type { LucideIcon } from "lucide-react"
import type React from "react"

export type Tone = "info" | "success" | "warning" | "danger" | "neutral" | "purple"
export type HealthStatus = "on_track" | "near" | "alert"

export type KpiCardData = {
  id: string
  label: string
  icon: LucideIcon
  iconTone: Tone
  value: number | string
  isCurrency?: boolean
  meta?: React.ReactNode
  href?: string
}

export type ProjectRankItem = {
  rank: number
  name: string
  code: string
  amount: number
  sharePct: number
}

export type ObligationItem = {
  id: string
  month: string
  day: string
  title: string
  clientName: string
  clientCode: string
  amount: number
  status: "due_soon" | "scheduled" | "pending_auth"
  dueLabel: string
}

export type ActivityItem = {
  id: string
  actor: {
    name: string
    role: string
    kind: "person" | "bot"
  }
  actionText: string
  targetCode: string
  targetHref?: string
  context: string
  timeAgo: string
  status: "completed" | "verified" | "reconciled" | "updated" | "failed"
}

export type CalendarEventItem = {
  id: string
  month: string
  day: string
  title: string
  category: "project_deadline" | "operations" | "financial" | "client_meeting"
  categoryLabel: string
  time: string
  context: string
  code?: string
}

export type NavItem = {
  label: string
  route: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}
