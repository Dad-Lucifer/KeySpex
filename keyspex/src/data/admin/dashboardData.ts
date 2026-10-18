import {
  TrendingUp,
  ClipboardList,
  Landmark,
  Banknote,
  FolderKanban,
  Users,
  LayoutDashboard,
  Wallet,
  ReceiptText,
  Contact,
  Building2,
  CircleCheckBig,
  FileText,
  CalendarDays,
  LineChart,
  History,
} from "lucide-react"
import type {
  NavGroup,
  ProjectRankItem,
  ObligationItem,
  ActivityItem,
  CalendarEventItem,
} from "@/types/admin"

export const navigationConfig: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        route: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "FINANCIAL MANAGEMENT",
    items: [
      {
        label: "Budgets & Revenue",
        route: "/admin/budgets-revenue",
        icon: Wallet,
      },
      {
        label: "Payroll & Salaries",
        route: "/admin/payroll",
        icon: Banknote,
      },
      {
        label: "Payment Timeline",
        route: "/admin/payment-timeline",
        icon: ReceiptText,
      },
    ],
  },
  {
    label: "PEOPLE MANAGEMENT",
    items: [
      {
        label: "Employees",
        route: "/admin/employees",
        icon: Contact,
      },
      {
        label: "Clients",
        route: "/admin/clients",
        icon: Building2,
      },
    ],
  },
  {
    label: "PROJECT MANAGEMENT",
    items: [
      {
        label: "Projects & Assignments",
        route: "/admin/projects",
        icon: FolderKanban,
      },
      {
        label: "Task Management",
        route: "/admin/tasks",
        icon: CircleCheckBig,
      },
    ],
  },
  {
    label: "BUSINESS OPERATIONS",
    items: [
      {
        label: "Contracts & Documents",
        route: "/admin/contracts",
        icon: FileText,
      },
      {
        label: "Event Calendar",
        route: "/admin/calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      {
        label: "Reports & Exports",
        route: "/admin/reports",
        icon: LineChart,
      },
      {
        label: "Activity Log",
        route: "/admin/activity",
        icon: History,
      },
    ],
  },
]

export const kpiItemsSeed = [
  {
    id: "revenue",
    label: "TOTAL REVENUE",
    icon: TrendingUp,
    iconTone: "info" as const,
    value: 1563000,
    isCurrency: true,
    delta: "+18.6%",
    caption: "Recurring ₹12.8L",
  },
  {
    id: "outstanding",
    label: "OUTSTANDING",
    icon: ClipboardList,
    iconTone: "warning" as const,
    value: 185000,
    isCurrency: true,
    badgeText: "2 Overdue",
    caption: "3 Clients",
  },
  {
    id: "budget",
    label: "TOTAL BUDGET",
    icon: Landmark,
    iconTone: "info" as const,
    value: 2000000,
    isCurrency: true,
    badgeText: "78.2% Committed",
    caption: "Annual 26-27",
  },
  {
    id: "salary",
    label: "SALARY PAYABLE",
    icon: Banknote,
    iconTone: "info" as const,
    value: 417000,
    isCurrency: true,
    chipText: "Due Nov 1",
    caption: "18 Staff",
  },
  {
    id: "projects",
    label: "ACTIVE PROJECTS",
    icon: FolderKanban,
    iconTone: "info" as const,
    value: "12",
    isCurrency: false,
    breakdown: [
      { label: "on track", count: 8, tone: "success" as const },
      { label: "near", count: 2, tone: "warning" as const },
      { label: "alert", count: 2, tone: "danger" as const },
    ],
  },
  {
    id: "employees",
    label: "TOTAL EMPLOYEES",
    icon: Users,
    iconTone: "info" as const,
    value: "18",
    isCurrency: false,
    breakdown: [
      { label: "Active", count: 16, tone: "success" as const },
      { label: "Onboarding", count: 2, tone: "neutral" as const },
    ],
  },
]

export const revenueOverviewChartData = {
  labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  currentSeries: [420000, 710000, 950000, 1180000, 1390000, 1563000],
  previousSeries: [350000, 580000, 790000, 920000, 1140000, 1280000],
  projectionText: "Monthly run-rate projected to breach ₹17.5L in Nov 2026.",
}

export const budgetUtilizationData = {
  cap: 2000000,
  committed: 1563000,
  remaining: 437000,
  utilizationPercent: 78.2,
  segments: [
    { label: "Operations", amount: 703350, share: "45.0%" },
    { label: "Payroll", amount: 417000, share: "26.7%" },
    { label: "Infra & SaaS", amount: 442650, share: "28.3%" },
  ],
}

export const rankedProjectsData: ProjectRankItem[] = [
  {
    rank: 1,
    name: "Apex Spatial Architecture Platform",
    code: "PRJ-3001",
    amount: 385000,
    sharePct: 24.6,
  },
  {
    rank: 2,
    name: "Veloce Streetwear E-Commerce Store",
    code: "PRJ-3002",
    amount: 245000,
    sharePct: 15.7,
  },
  {
    rank: 3,
    name: "Nexa Core Banking & Payments Portal",
    code: "PRJ-3003",
    amount: 195000,
    sharePct: 12.5,
  },
  {
    rank: 4,
    name: "Pulse Health Telehealth Mobile App",
    code: "PRJ-3004",
    amount: 140000,
    sharePct: 9.0,
  },
]

export const obligationsData: ObligationItem[] = [
  {
    id: "ob-1",
    month: "OCT",
    day: "28",
    title: "AWS Cloud Infrastructure & Edge CDN",
    clientName: "Apex Spatial Project",
    clientCode: "CLI-2001",
    amount: 68000,
    status: "due_soon",
    dueLabel: "Due in 3 days",
  },
  {
    id: "ob-2",
    month: "OCT",
    day: "31",
    title: "KeySpex Core Team Payroll Run",
    clientName: "Core Team (18 Staff)",
    clientCode: "Auto-ACH",
    amount: 275000,
    status: "scheduled",
    dueLabel: "Scheduled",
  },
  {
    id: "ob-3",
    month: "NOV",
    day: "05",
    title: "Vercel Enterprise Edge Hosting SLA",
    clientName: "Veloce Brand Store",
    clientCode: "CLI-2002",
    amount: 42000,
    status: "pending_auth",
    dueLabel: "Pending Auth",
  },
  {
    id: "ob-4",
    month: "NOV",
    day: "10",
    title: "Security Pen-Testing Retainer",
    clientName: "Pulse Health Telehealth",
    clientCode: "CLI-2004",
    amount: 85000,
    status: "scheduled",
    dueLabel: "Scheduled",
  },
]

export const activityRowsData: ActivityItem[] = [
  {
    id: "act-1",
    actor: {
      name: "Roshan Patel",
      role: "Principal Architect",
      kind: "person",
    },
    actionText: "Approved Architectural Blueprint for",
    targetCode: "PRJ-3001",
    context: "Apex Spatial Architecture (CLI-2001)",
    timeAgo: "8m ago",
    status: "completed",
  },
  {
    id: "act-2",
    actor: {
      name: "Riya Sharma",
      role: "HR Operations",
      kind: "person",
    },
    actionText: "Reconciled Payroll Disbursement for",
    targetCode: "EMP-1002",
    context: "Technical Lead • October Run",
    timeAgo: "45m ago",
    status: "verified",
  },
  {
    id: "act-3",
    actor: {
      name: "Finance Bot",
      role: "Automated Job",
      kind: "bot",
    },
    actionText: "Recorded Inward Wire Transfer",
    targetCode: "PAY-6002",
    context: "₹1,95,000 from Nexa Financial Systems",
    timeAgo: "2h ago",
    status: "reconciled",
  },
  {
    id: "act-4",
    actor: {
      name: "Marcus Vance",
      role: "Senior Project Lead",
      kind: "person",
    },
    actionText: "Completed Milestone 3 Deliverable on",
    targetCode: "PRJ-3002",
    context: "Veloce Lifestyle Apparel E-Commerce",
    timeAgo: "4h ago",
    status: "updated",
  },
]

export const upcomingEventsData: CalendarEventItem[] = [
  {
    id: "evt-1",
    month: "OCT",
    day: "29",
    title: "Sprint 15 Architecture Review: Apex Spatial",
    category: "project_deadline",
    categoryLabel: "Project Deadline",
    time: "10:30 AM",
    context: "PRJ-3001 (Google Meet)",
  },
  {
    id: "evt-2",
    month: "OCT",
    day: "31",
    title: "Monthly Payroll & Compliance Settlement",
    category: "operations",
    categoryLabel: "Operations",
    time: "04:00 PM",
    context: "Finance & People Ops Room",
  },
  {
    id: "evt-3",
    month: "NOV",
    day: "02",
    title: "Q4 Executive Runway & Budget Review",
    category: "financial",
    categoryLabel: "Financial",
    time: "02:00 PM",
    context: "Leadership Council Room",
  },
  {
    id: "evt-4",
    month: "NOV",
    day: "04",
    title: "Client Sync: Veloce Brand Directors",
    category: "client_meeting",
    categoryLabel: "Client Meeting",
    time: "11:00 AM",
    context: "CLI-2002 (Strategy Sync)",
  },
]
