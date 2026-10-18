import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore"
import { db } from "../firebase"
import {
  KEYSPEX_REAL_FINANCIALS,
  KEYSPEX_REAL_PROJECTS,
  type DbFinancials,
  type DbProject,
} from "./dashboardService"

export type PayeeType = "employee" | "contractor"

export type PayeeItem = {
  id?: string
  code: string
  name: string
  role: string
  department: string
  status: "Active" | "Onboarding" | "On Leave" | "Completed" | "Pending Payment"
  salary: number
  type: PayeeType
  assignedProject: string
  email?: string
  contractTerms?: string
  updatedAt?: string
}

export type SubscriptionItem = {
  id: string
  title: string
  clientName: string
  clientCode: string
  amount: number
  status: "due_soon" | "scheduled" | "pending_auth"
  dueLabel: string
  dueDate?: string
  type: "subscription" | "obligation"
}

export type ProjectLaborAllocation = {
  projectCode: string
  projectName: string
  clientName: string
  contractAmount: number
  allocatedStaffCount: number
  laborAndContractorCost: number
  laborBurdenPct: number
  netMargin: number
  netMarginPct: number
  teamMembers: string[]
  contractors: string[]
}

export type DepartmentSpendItem = {
  department: string
  spend: number
  sharePct: number
  headcount: number
  avgCostPerHead: number
  color: string
}

export type UpcomingDisbursementItem = {
  id: string
  date: string
  month: string
  day: string
  title: string
  beneficiary: string
  amount: number
  status: "due_soon" | "scheduled" | "pending_auth"
  dueLabel: string
  type: "payroll" | "subscription" | "contractor"
}

export type PayrollData = {
  kpis: {
    corePayroll: number
    activeEmployeesCount: number
    onboardingEmployeesCount: number
    totalStaffCount: number
    subscriptionsCost: number
    subscriptionsCount: number
    contractorPayouts: number
    contractorsCount: number
    totalMonthlyBurn: number
    totalRevenue: number
    revenueToPayrollMultiplier: number
    nextSettlementDate: string
    nextSettlementAmount: number
  }
  payees: PayeeItem[]
  subscriptions: SubscriptionItem[]
  projectAllocations: ProjectLaborAllocation[]
  departmentBreakdown: DepartmentSpendItem[]
  upcomingTimeline: UpcomingDisbursementItem[]
  lastSynced: Date
}

// Baseline enriched payees
export const BASELINE_PAYEES: PayeeItem[] = [
  { code: "EMP-1001", name: "Roshan Patel", role: "Principal Architect", department: "Leadership & Architecture", status: "Active", salary: 35000, type: "employee", assignedProject: "PRJ-3001", email: "roshan@keyspex.com" },
  { code: "EMP-1002", name: "Alex Rivera", role: "Technical Director", department: "Leadership & Architecture", status: "Active", salary: 32000, type: "employee", assignedProject: "PRJ-3002", email: "alex@keyspex.com" },
  { code: "EMP-1003", name: "Riya Sharma", role: "HR & People Operations", department: "Operations", status: "Active", salary: 24000, type: "employee", assignedProject: "Company-wide", email: "riya@keyspex.com" },
  { code: "EMP-1004", name: "Marcus Vance", role: "Senior Project Lead", department: "Engineering", status: "Active", salary: 28000, type: "employee", assignedProject: "PRJ-3002", email: "marcus@keyspex.com" },
  { code: "EMP-1005", name: "Priya Nair", role: "Lead Cloud Infrastructure", department: "Cloud & DevOps", status: "Active", salary: 30000, type: "employee", assignedProject: "PRJ-3001", email: "priya@keyspex.com" },
  { code: "EMP-1006", name: "David Chen", role: "Senior Frontend Engineer", department: "Engineering", status: "Active", salary: 26000, type: "employee", assignedProject: "PRJ-3003", email: "david@keyspex.com" },
  { code: "EMP-1007", name: "Ananya Iyer", role: "Fullstack Engineer", department: "Engineering", status: "Active", salary: 22000, type: "employee", assignedProject: "PRJ-3004", email: "ananya@keyspex.com" },
  { code: "EMP-1008", name: "Kavita Rao", role: "DevOps & SRE Specialist", department: "Cloud & DevOps", status: "Active", salary: 23000, type: "employee", assignedProject: "PRJ-3005", email: "kavita@keyspex.com" },
  { code: "EMP-1009", name: "Rohit Verma", role: "Backend Systems Engineer", department: "Engineering", status: "Active", salary: 21000, type: "employee", assignedProject: "PRJ-3006", email: "rohit@keyspex.com" },
  { code: "EMP-1010", name: "Sara Al-Mansoor", role: "Lead Product Designer", department: "Product & Design", status: "Active", salary: 22000, type: "employee", assignedProject: "PRJ-3007", email: "sara@keyspex.com" },
  { code: "EMP-1011", name: "Vikram Joshi", role: "Data Engineer", department: "Engineering", status: "Active", salary: 20000, type: "employee", assignedProject: "PRJ-3009", email: "vikram@keyspex.com" },
  { code: "EMP-1012", name: "Neha Patel", role: "QA Automation Lead", department: "Engineering", status: "Active", salary: 18000, type: "employee", assignedProject: "PRJ-3008", email: "neha@keyspex.com" },
  { code: "EMP-1013", name: "Arjun Mehta", role: "Technical Product Manager", department: "Product & Design", status: "Active", salary: 27000, type: "employee", assignedProject: "PRJ-3010", email: "arjun@keyspex.com" },
  { code: "EMP-1014", name: "Elena Rostova", role: "Cybersecurity Analyst", department: "Cloud & DevOps", status: "Active", salary: 25000, type: "employee", assignedProject: "PRJ-3003", email: "elena@keyspex.com" },
  { code: "EMP-1015", name: "Karan Singhania", role: "Mobile Application Dev", department: "Engineering", status: "Active", salary: 21000, type: "employee", assignedProject: "PRJ-3004", email: "karan@keyspex.com" },
  { code: "EMP-1016", name: "Deepak Soni", role: "Cloud Systems Admin", department: "Cloud & DevOps", status: "Active", salary: 19000, type: "employee", assignedProject: "PRJ-3011", email: "deepak@keyspex.com" },
  { code: "EMP-1017", name: "Sameer Khan", role: "Associate Fullstack Dev", department: "Engineering", status: "Onboarding", salary: 14000, type: "employee", assignedProject: "PRJ-3012", email: "sameer@keyspex.com" },
  { code: "EMP-1018", name: "Ishaan Gupta", role: "Frontend UI Intern", department: "Engineering", status: "Onboarding", salary: 10000, type: "employee", assignedProject: "PRJ-3005", email: "ishaan@keyspex.com" },
  { code: "CTR-5001", name: "Tanya Sen", role: "3D Spatial Mesh Modeler", department: "Engineering", status: "Active", salary: 35000, type: "contractor", assignedProject: "PRJ-3001", email: "tanya.external@keyspex.com", contractTerms: "Milestone Deliverable" },
  { code: "CTR-5002", name: "Devansh Verma", role: "Smart Contract Security Auditor", department: "Cloud & DevOps", status: "Active", salary: 45000, type: "contractor", assignedProject: "PRJ-3003", email: "devansh.audit@keyspex.com", contractTerms: "Fixed Audit Retainer" },
  { code: "CTR-5003", name: "Priya Sharma", role: "Flutter UI Performance Polish", department: "Engineering", status: "Active", salary: 28000, type: "contractor", assignedProject: "PRJ-3004", email: "priya.mobile@keyspex.com", contractTerms: "Sprint Milestone" },
  { code: "CTR-5004", name: "Rahul Kapoor", role: "PostgreSQL Lakehouse Architect", department: "Engineering", status: "Active", salary: 32000, type: "contractor", assignedProject: "PRJ-3009", email: "rahul.data@keyspex.com", contractTerms: "Performance Optimization" },
]

export const BASELINE_SUBSCRIPTIONS: SubscriptionItem[] = [
  { id: "ob-1", title: "AWS Cloud Infrastructure & Edge CDN", clientName: "Apex Spatial Project", clientCode: "CLI-2001", amount: 68000, status: "due_soon", dueLabel: "Due in 3 days", dueDate: "2026-10-28", type: "subscription" },
  { id: "ob-3", title: "Vercel Enterprise Edge Hosting SLA", clientName: "Veloce Brand Store", clientCode: "CLI-2002", amount: 42000, status: "pending_auth", dueLabel: "Pending Auth", dueDate: "2026-11-05", type: "subscription" },
  { id: "ob-4", title: "Security Pen-Testing Retainer", clientName: "Pulse Health Telehealth", clientCode: "CLI-2004", amount: 85000, status: "scheduled", dueLabel: "Scheduled", dueDate: "2026-11-10", type: "subscription" },
  { id: "ob-5", title: "Figma Enterprise Design System Retainer", clientName: "Design Systems & Tokens", clientCode: "CLI-SUB-01", amount: 18000, status: "scheduled", dueLabel: "Scheduled", dueDate: "2026-11-02", type: "subscription" },
  { id: "ob-6", title: "OpenAI & Anthropic Foundation Model API", clientName: "KeySpex AI Infrastructure", clientCode: "CLI-SUB-02", amount: 32000, status: "scheduled", dueLabel: "Scheduled", dueDate: "2026-11-08", type: "subscription" },
]

const DEPARTMENT_COLORS: Record<string, string> = {
  "Engineering": "#0866F5", // Royal Blue
  "Cloud & DevOps": "#10B981", // Emerald
  "Leadership & Architecture": "#8B5CF6", // Purple
  "Product & Design": "#F59E0B", // Amber
  "Operations": "#64748B", // Slate
}

/**
 * Computes all payroll statistics, project-to-salary allocations, and department breakdowns
 * directly from live raw database entities.
 */
export function computePayrollData(
  rawEmployees: any[],
  rawObligations: any[],
  rawProjects: DbProject[],
  _financials?: DbFinancials
): PayrollData {
  // 1. Process Payees (Employees & Contractors)
  const payees: PayeeItem[] = rawEmployees.map((e, idx) => {
    const code = e.code || `EMP-${1001 + idx}`
    const isContractor = e.type === "contractor" || code.startsWith("CTR-")

    return {
      id: e.id || code,
      code,
      name: e.name,
      role: e.role,
      department: e.department || (e.role.includes("Design") ? "Product & Design" : e.role.includes("Cloud") || e.role.includes("DevOps") || e.role.includes("Security") ? "Cloud & DevOps" : e.role.includes("Architect") || e.role.includes("Director") ? "Leadership & Architecture" : e.role.includes("HR") ? "Operations" : "Engineering"),
      status: (e.status as any) || "Active",
      salary: Number(e.salary) || 0,
      type: isContractor ? "contractor" : "employee",
      assignedProject: e.assignedProject || "Company-wide",
      email: e.email || `${e.name.toLowerCase().replace(/\s+/g, ".")}@keyspex.com`,
      contractTerms: e.contractTerms || (isContractor ? "Milestone Payout" : undefined),
    }
  })

  // Core Employees vs Contractors
  const employeeItems = payees.filter((p) => p.type === "employee")
  const contractorItems = payees.filter((p) => p.type === "contractor")

  const corePayroll = employeeItems.reduce((sum, e) => sum + e.salary, 0)
  const contractorPayouts = contractorItems.reduce((sum, c) => sum + c.salary, 0)

  const activeEmployeesCount = employeeItems.filter((e) => e.status === "Active").length
  const onboardingEmployeesCount = employeeItems.filter((e) => e.status === "Onboarding").length
  const totalStaffCount = employeeItems.length
  const contractorsCount = contractorItems.length

  // 2. Subscriptions & Tooling
  const subscriptions: SubscriptionItem[] = rawObligations
    .filter((o) => o.id !== "ob-2") // ob-2 is the payroll run itself
    .map((o) => ({
      id: o.id || `ob-${Math.random()}`,
      title: o.title,
      clientName: o.clientName,
      clientCode: o.clientCode,
      amount: Number(o.amount) || 0,
      status: o.status,
      dueLabel: o.dueLabel,
      dueDate: o.dueDate,
      type: "subscription",
    }))

  const subscriptionsCost = subscriptions.reduce((sum, s) => sum + s.amount, 0)
  const totalMonthlyBurn = corePayroll + subscriptionsCost + contractorPayouts

  // Total project revenue
  const totalRevenue = rawProjects.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const revenueToPayrollMultiplier = corePayroll > 0 ? Number((totalRevenue / corePayroll).toFixed(2)) : 3.75

  // 3. Project-Level Labor Burden & Net Margin Matrix
  const projectAllocations: ProjectLaborAllocation[] = rawProjects.map((p) => {
    const pCode = p.code
    const contractAmount = Number(p.amount) || 0

    // Find staff and contractors assigned to this project
    const assignedStaff = payees.filter((payee) => payee.assignedProject === pCode)
    const staffNames = assignedStaff.filter((s) => s.type === "employee").map((s) => s.name)
    const contractorNames = assignedStaff.filter((s) => s.type === "contractor").map((s) => s.name)

    // Calculate labor cost: employee salaries assigned + contractor payouts
    // If no direct employee assigned, use project-proportional operational labor allocation
    let directLabor = assignedStaff.reduce((sum, s) => sum + s.salary, 0)
    if (directLabor === 0) {
      directLabor = Math.round(contractAmount * 0.22)
    }

    const laborBurdenPct = contractAmount > 0 ? Number(((directLabor / contractAmount) * 100).toFixed(1)) : 25
    const netMargin = Math.max(0, contractAmount - directLabor)
    const netMarginPct = contractAmount > 0 ? Number(((netMargin / contractAmount) * 100).toFixed(1)) : 75

    return {
      projectCode: p.code,
      projectName: p.name,
      clientName: p.clientName,
      contractAmount,
      allocatedStaffCount: assignedStaff.length || 1,
      laborAndContractorCost: directLabor,
      laborBurdenPct,
      netMargin,
      netMarginPct,
      teamMembers: staffNames.length > 0 ? staffNames : ["Core Delivery Pod"],
      contractors: contractorNames,
    }
  })

  // 4. Department Breakdown
  const deptMap = new Map<string, { spend: number; count: number }>()
  for (const payee of payees) {
    const dept = payee.department || "Engineering"
    const current = deptMap.get(dept) || { spend: 0, count: 0 }
    deptMap.set(dept, {
      spend: current.spend + payee.salary,
      count: current.count + 1,
    })
  }

  const totalPayeeSpend = payees.reduce((s, p) => s + p.salary, 0) || 1
  const departmentBreakdown: DepartmentSpendItem[] = Array.from(deptMap.entries())
    .map(([dept, val]) => ({
      department: dept,
      spend: val.spend,
      sharePct: Number(((val.spend / totalPayeeSpend) * 100).toFixed(1)),
      headcount: val.count,
      avgCostPerHead: Math.round(val.spend / Math.max(1, val.count)),
      color: DEPARTMENT_COLORS[dept] || "#64748B",
    }))
    .sort((a, b) => b.spend - a.spend)

  // 5. Upcoming Timeline
  const upcomingTimeline: UpcomingDisbursementItem[] = [
    {
      id: "ob-1",
      date: "2026-10-28",
      month: "OCT",
      day: "28",
      title: "AWS Cloud Infrastructure & Edge CDN",
      beneficiary: "Amazon Web Services",
      amount: 68000,
      status: "due_soon",
      dueLabel: "Due in 3 days",
      type: "subscription",
    },
    {
      id: "ob-2",
      date: "2026-10-31",
      month: "OCT",
      day: "31",
      title: "Core KeySpex Engineering & Staff Payroll Run",
      beneficiary: `KeySpex Core Roster (${totalStaffCount} Staff)`,
      amount: corePayroll,
      status: "scheduled",
      dueLabel: "Scheduled Oct 31",
      type: "payroll",
    },
    {
      id: "ob-5",
      date: "2026-11-02",
      month: "NOV",
      day: "02",
      title: "Figma Enterprise Design System Retainer",
      beneficiary: "Figma Inc.",
      amount: 18000,
      status: "scheduled",
      dueLabel: "Scheduled",
      type: "subscription",
    },
    {
      id: "ob-3",
      date: "2026-11-05",
      month: "NOV",
      day: "05",
      title: "Vercel Enterprise Edge Hosting SLA",
      beneficiary: "Vercel Enterprise",
      amount: 42000,
      status: "pending_auth",
      dueLabel: "Pending Auth",
      type: "subscription",
    },
    {
      id: "ob-6",
      date: "2026-11-08",
      month: "NOV",
      day: "08",
      title: "OpenAI & Anthropic Foundation Model API",
      beneficiary: "OpenAI API Platform",
      amount: 32000,
      status: "scheduled",
      dueLabel: "Scheduled",
      type: "subscription",
    },
    {
      id: "ob-4",
      date: "2026-11-10",
      month: "NOV",
      day: "10",
      title: "Security Pen-Testing Retainer",
      beneficiary: "Pulse Health Security Pod",
      amount: 85000,
      status: "scheduled",
      dueLabel: "Scheduled",
      type: "subscription",
    },
  ]

  return {
    kpis: {
      corePayroll,
      activeEmployeesCount,
      onboardingEmployeesCount,
      totalStaffCount,
      subscriptionsCost,
      subscriptionsCount: subscriptions.length,
      contractorPayouts,
      contractorsCount,
      totalMonthlyBurn,
      totalRevenue,
      revenueToPayrollMultiplier,
      nextSettlementDate: "Oct 31, 2026",
      nextSettlementAmount: corePayroll,
    },
    payees,
    subscriptions,
    projectAllocations,
    departmentBreakdown,
    upcomingTimeline,
    lastSynced: new Date(),
  }
}

/**
 * Returns immediate baseline payroll data for synchronous first paint.
 */
export function getPayrollBaseline(): PayrollData {
  return computePayrollData(
    BASELINE_PAYEES,
    BASELINE_SUBSCRIPTIONS,
    KEYSPEX_REAL_PROJECTS,
    KEYSPEX_REAL_FINANCIALS
  )
}

/**
 * Real-time reactive subscription across Firestore collections.
 */
export function subscribeToPayroll(
  onData: (data: PayrollData) => void,
  onError?: (err: Error) => void
): () => void {
  let isMounted = true

  let employeesData: any[] = BASELINE_PAYEES
  let obligationsData: any[] = BASELINE_SUBSCRIPTIONS
  let projectsData: DbProject[] = KEYSPEX_REAL_PROJECTS
  let financialsData: DbFinancials = KEYSPEX_REAL_FINANCIALS

  const notify = () => {
    if (!isMounted) return
    const calculated = computePayrollData(
      employeesData,
      obligationsData,
      projectsData,
      financialsData
    )
    onData(calculated)
  }

  notify()

  // 1. Employees & Contractors listener
  const unsubEmployees = onSnapshot(
    collection(db, "dashboard_employees"),
    (snap) => {
      if (!snap.empty) {
        employeesData = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        notify()
      }
    },
    (err) => onError?.(err)
  )

  // 2. Obligations & Subscriptions listener
  const unsubObligations = onSnapshot(
    collection(db, "dashboard_obligations"),
    (snap) => {
      if (!snap.empty) {
        obligationsData = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        notify()
      }
    },
    (err) => onError?.(err)
  )

  // 3. Projects listener
  const unsubProjects = onSnapshot(
    collection(db, "dashboard_projects"),
    (snap) => {
      if (!snap.empty) {
        projectsData = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        notify()
      }
    },
    (err) => onError?.(err)
  )

  return () => {
    isMounted = false
    unsubEmployees()
    unsubObligations()
    unsubProjects()
  }
}

// ── Real Mutations that Write Directly to Live Firestore Database ───────────────

/**
 * Adds an employee or contractor to `dashboard_employees` and logs an audit record.
 */
export async function addPayee(
  payee: Omit<PayeeItem, "id">
): Promise<void> {
  const code = payee.code || `${payee.type === "contractor" ? "CTR" : "EMP"}-${Date.now().toString().slice(-4)}`
  const docRef = doc(db, "dashboard_employees", code)

  await setDoc(docRef, {
    ...payee,
    code,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // Write audit trail into dashboard_activities
  await addDoc(collection(db, "dashboard_activities"), {
    actor: { name: "Roshan Patel", role: "Principal Architect", kind: "person" },
    actionText: `Added ${payee.type === "contractor" ? "Contractor Payout" : "Staff Member"}`,
    targetCode: code,
    context: `${payee.name} (₹${payee.salary.toLocaleString("en-IN")}) • ${payee.role}`,
    timestamp: new Date().toISOString(),
    status: "completed",
  })
}

/**
 * Updates compensation, status, role, or project assignment for an employee or contractor.
 */
export async function updatePayeeCompensation(
  code: string,
  updates: Partial<PayeeItem>
): Promise<void> {
  const docRef = doc(db, "dashboard_employees", code)
  await setDoc(
    docRef,
    {
      ...updates,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  await addDoc(collection(db, "dashboard_activities"), {
    actor: { name: "Roshan Patel", role: "Principal Architect", kind: "person" },
    actionText: "Updated Compensation & Records for",
    targetCode: code,
    context: updates.salary ? `New rate: ₹${updates.salary.toLocaleString("en-IN")} • ${updates.role || "Updated"}` : `Updated status to ${updates.status}`,
    timestamp: new Date().toISOString(),
    status: "verified",
  })
}

/**
 * Deletes a payee record from `dashboard_employees`.
 */
export async function deletePayee(code: string, name: string): Promise<void> {
  const docRef = doc(db, "dashboard_employees", code)
  await deleteDoc(docRef)

  await addDoc(collection(db, "dashboard_activities"), {
    actor: { name: "Roshan Patel", role: "Principal Architect", kind: "person" },
    actionText: "Archived Payee Record",
    targetCode: code,
    context: `Removed ${name} from active payroll roster`,
    timestamp: new Date().toISOString(),
    status: "reconciled",
  })
}

/**
 * Adds a new SaaS subscription or vendor obligation to `dashboard_obligations`.
 */
export async function addSubscription(
  sub: Omit<SubscriptionItem, "id">
): Promise<void> {
  const id = `ob-${Date.now()}`
  const docRef = doc(db, "dashboard_obligations", id)

  await setDoc(docRef, {
    ...sub,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  await addDoc(collection(db, "dashboard_activities"), {
    actor: { name: "Finance Bot", role: "Automated Job", kind: "bot" },
    actionText: "Registered SaaS Subscription",
    targetCode: sub.clientCode || "SUB",
    context: `${sub.title} • ₹${sub.amount.toLocaleString("en-IN")}/cycle`,
    timestamp: new Date().toISOString(),
    status: "verified",
  })
}

/**
 * Updates subscription or obligation status.
 */
export async function updateSubscriptionStatus(
  id: string,
  newStatus: "due_soon" | "scheduled" | "pending_auth",
  dueLabel: string
): Promise<void> {
  const docRef = doc(db, "dashboard_obligations", id)
  await setDoc(
    docRef,
    {
      status: newStatus,
      dueLabel,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )
}

/**
 * Simulates a batch monthly payroll run settlement.
 */
export async function processPayrollRunSimulation(totalAmount: number, staffCount: number): Promise<void> {
  // Update the payroll obligation doc
  const obRef = doc(db, "dashboard_obligations", "ob-2")
  await setDoc(
    obRef,
    {
      amount: totalAmount,
      status: "scheduled",
      dueLabel: "Reconciled ACH",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  // Log audit activity
  await addDoc(collection(db, "dashboard_activities"), {
    actor: { name: "Roshan Patel", role: "Principal Architect", kind: "person" },
    actionText: "Executed Automated Monthly Payroll Run",
    targetCode: "ACH-OCT",
    context: `Disbursed ₹${totalAmount.toLocaleString("en-IN")} across ${staffCount} staff & contractors`,
    timestamp: new Date().toISOString(),
    status: "completed",
  })
}
