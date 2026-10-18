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
    value: 845000,
    isCurrency: true,
    delta: "+14.2%",
    caption: "Recurring ₹7,10,000",
  },
  {
    id: "outstanding",
    label: "OUTSTANDING",
    icon: ClipboardList,
    iconTone: "warning" as const,
    value: 125000,
    isCurrency: true,
    badgeText: "3 Overdue",
    caption: "4 Clients",
  },
  {
    id: "budget",
    label: "TOTAL BUDGET",
    icon: Landmark,
    iconTone: "info" as const,
    value: 1200000,
    isCurrency: true,
    badgeText: "70.4% Committed",
    caption: "Annual 26-27",
  },
  {
    id: "salary",
    label: "SALARY PAYABLE",
    icon: Banknote,
    iconTone: "info" as const,
    value: 240000,
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
      { label: "Onboarding", count: 1, tone: "neutral" as const },
    ],
  },
]

export const revenueOverviewChartData = {
  labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  currentSeries: [200000, 450000, 530000, 700000, 810000, 845000],
  previousSeries: [280000, 410000, 480000, 460000, 660000, 730000],
  projectionText: "Monthly run-rate projected to breach ₹9.2L in Nov 2026.",
}

export const budgetUtilizationData = {
  cap: 1200000,
  committed: 845000,
  remaining: 355000,
  utilizationPercent: 70.4,
  segments: [
    { label: "Operations", amount: 420000, share: "49.7%" },
    { label: "Payroll", amount: 280000, share: "33.1%" },
    { label: "Infra & SaaS", amount: 145000, share: "17.2%" },
  ],
}

export const rankedProjectsData: ProjectRankItem[] = [
  {
    rank: 1,
    name: "Enterprise Cloud Migration",
    code: "PRJ-3001",
    amount: 340000,
    sharePct: 40.2,
  },
  {
    rank: 2,
    name: "Fintech Core Banking UI",
    code: "PRJ-3002",
    amount: 210000,
    sharePct: 24.8,
  },
  {
    rank: 3,
    name: "HealthTech Telehealth App",
    code: "PRJ-3003",
    amount: 165000,
    sharePct: 19.5,
  },
  {
    rank: 4,
    name: "Retail POS Modernization",
    code: "PRJ-3004",
    amount: 130000,
    sharePct: 15.4,
  },
]

export const obligationsData: ObligationItem[] = [
  {
    id: "ob-1",
    month: "OCT",
    day: "28",
    title: "AWS Cloud Infra Renewal",
    clientName: "Apex Global",
    clientCode: "CLI-2001",
    amount: 65000,
    status: "due_soon",
    dueLabel: "Due in 3 days",
  },
  {
    id: "ob-2",
    month: "OCT",
    day: "31",
    title: "October Payroll Run",
    clientName: "Core Team (18 Staff)",
    clientCode: "Auto-ACH",
    amount: 240000,
    status: "scheduled",
    dueLabel: "Scheduled",
  },
  {
    id: "ob-3",
    month: "NOV",
    day: "05",
    title: "Milestone 2 Disbursement",
    clientName: "Nexa Systems",
    clientCode: "CLI-2002",
    amount: 110000,
    status: "pending_auth",
    dueLabel: "Pending Auth",
  },
  {
    id: "ob-4",
    month: "NOV",
    day: "10",
    title: "SaaS Tooling & Licenses",
    clientName: "Vertex Labs",
    clientCode: "CLI-2003",
    amount: 35000,
    status: "scheduled",
    dueLabel: "Scheduled",
  },
]

export const activityRowsData: ActivityItem[] = [
  {
    id: "act-1",
    actor: {
      name: "Alex Rivera",
      role: "Super Admin",
      kind: "person",
    },
    actionText: "Created Contract",
    targetCode: "CON-5001",
    context: "Apex Global (CLI-2001)",
    timeAgo: "10m ago",
    status: "completed",
  },
  {
    id: "act-2",
    actor: {
      name: "Riya Sharma",
      role: "HR Operations",
      kind: "person",
    },
    actionText: "Approved Salary Slip for",
    targetCode: "EMP-1004",
    context: "DevOps Lead • Nov Run",
    timeAgo: "1h ago",
    status: "verified",
  },
  {
    id: "act-3",
    actor: {
      name: "Finance Bot",
      role: "Automated Job",
      kind: "bot",
    },
    actionText: "Recorded Inward Payment",
    targetCode: "PAY-6001",
    context: "₹85,000 from Nexa Systems",
    timeAgo: "3h ago",
    status: "reconciled",
  },
  {
    id: "act-4",
    actor: {
      name: "Marcus Vance",
      role: "Project Lead",
      kind: "person",
    },
    actionText: "Reassigned Task",
    targetCode: "TSK-4012",
    context: "Fintech Banking UI (PRJ-3002)",
    timeAgo: "5h ago",
    status: "updated",
  },
]

export const upcomingEventsData: CalendarEventItem[] = [
  {
    id: "evt-1",
    month: "OCT",
    day: "29",
    title: "Sprint 14 Milestone Review",
    category: "project_deadline",
    categoryLabel: "Project Deadline",
    time: "10:30 AM",
    context: "PRJ-3001 (Cloud Migration)",
  },
  {
    id: "evt-2",
    month: "OCT",
    day: "31",
    title: "Monthly Payroll Reconciliation",
    category: "operations",
    categoryLabel: "Operations",
    time: "04:00 PM",
    context: "Finance & HR Core Team",
  },
  {
    id: "evt-3",
    month: "NOV",
    day: "02",
    title: "Executive Q4 Budget Review",
    category: "financial",
    categoryLabel: "Financial",
    time: "02:00 PM",
    context: "Leadership Council Room",
  },
  {
    id: "evt-4",
    month: "NOV",
    day: "04",
    title: "Client Sync: Apex Global",
    category: "client_meeting",
    categoryLabel: "Client Meeting",
    time: "11:00 AM",
    context: "CLI-2001 (Google Meet)",
  },
]
