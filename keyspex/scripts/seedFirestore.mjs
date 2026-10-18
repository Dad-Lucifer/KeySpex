import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCg9vI46g4IUdVTgfxeu7FR7j8MX1dKIw",
  authDomain: "keyspex.firebaseapp.com",
  projectId: "keyspex",
  storageBucket: "keyspex.firebasestorage.app",
  messagingSenderId: "936482233344",
  appId: "1:936482233344:web:f3a98e5fc6c9e5264e8ce5",
  measurementId: "G-WDZEB6T3Z8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const financials = {
  cap: 2000000,
  committed: 1563000,
  remaining: 437000,
  utilizationPercent: 78.2,
  segments: [
    { label: "Operations", amount: 703350, share: "45.0%" },
    { label: "Payroll", amount: 417000, share: "26.7%" },
    { label: "Infra & SaaS", amount: 442650, share: "28.3%" },
  ],
  revenueChart: {
    labels6M: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    current6M: [420000, 710000, 950000, 1180000, 1390000, 1563000],
    previous6M: [350000, 580000, 790000, 920000, 1140000, 1280000],
    labelsYTD: ["Jan", "Mar", "May", "Jul", "Sep", "Oct"],
    currentYTD: [310000, 620000, 950000, 1180000, 1390000, 1563000],
    previousYTD: [260000, 490000, 790000, 920000, 1140000, 1280000],
    labels1Y: ["Nov '25", "Jan '26", "Mar '26", "May '26", "Jul '26", "Oct '26"],
    current1Y: [250000, 520000, 810000, 1090000, 1340000, 1563000],
    previous1Y: [210000, 420000, 680000, 890000, 1100000, 1280000],
    projectionText: "Monthly run-rate projected to breach ₹17.5L in Nov 2026.",
  },
  outstanding: {
    amount: 185000,
    overdueClientsCount: 3,
    overdueCount: 2,
  },
  salaryPayable: {
    amount: 417000,
    dueDate: "Nov 1",
    staffCount: 18,
  },
  recurringRevenue: 1280000,
  revenueDelta: "+18.6%",
  updatedAt: new Date().toISOString(),
};

const projects = [
  { name: "Apex Spatial Architecture Platform", code: "PRJ-3001", amount: 385000, status: "on_track", clientName: "Apex Design & Urban Studio", clientCode: "CLI-2001", order: 1 },
  { name: "Veloce Streetwear E-Commerce Store", code: "PRJ-3002", amount: 245000, status: "on_track", clientName: "Veloce Lifestyle Apparel", clientCode: "CLI-2002", order: 2 },
  { name: "Nexa Core Banking & Payments Portal", code: "PRJ-3003", amount: 195000, status: "near", clientName: "Nexa Financial Systems", clientCode: "CLI-2003", order: 3 },
  { name: "Pulse Health Telehealth Mobile App", code: "PRJ-3004", amount: 140000, status: "alert", clientName: "Pulse Health Sciences", clientCode: "CLI-2004", order: 4 },
  { name: "KeySpex Community Platform v2", code: "PRJ-3005", amount: 115000, status: "on_track", clientName: "KeySpex Digital", clientCode: "CLI-2005", order: 5 },
  { name: "ShopSphere Omnichannel Checkout API", code: "PRJ-3006", amount: 95000, status: "on_track", clientName: "ShopSphere Retail", clientCode: "CLI-2006", order: 6 },
  { name: "SecureCorp Identity & SSO Engine", code: "PRJ-3007", amount: 80000, status: "on_track", clientName: "SecureCorp Global", clientCode: "CLI-2007", order: 7 },
  { name: "Synthex Real-Time AI Support Agent", code: "PRJ-3008", amount: 75000, status: "on_track", clientName: "Synthex Data Labs", clientCode: "CLI-2008", order: 8 },
  { name: "Alpha Capital Customer Data Lakehouse", code: "PRJ-3009", amount: 68000, status: "on_track", clientName: "Alpha Capital Partners", clientCode: "CLI-2009", order: 9 },
  { name: "CargoLink Fleet Telematics Dashboard", code: "PRJ-3010", amount: 62000, status: "near", clientName: "CargoLink Logistics", clientCode: "CLI-2010", order: 10 },
  { name: "B2B Vendor Modernization Portal", code: "PRJ-3011", amount: 55000, status: "on_track", clientName: "Apex Design & Urban Studio", clientCode: "CLI-2001", order: 11 },
  { name: "PayFlux Instant Payout Gateway", code: "PRJ-3012", amount: 48000, status: "alert", clientName: "PayFlux Technologies", clientCode: "CLI-2011", order: 12 },
];

const employees = [
  { name: "Roshan Patel", role: "Principal Architect", status: "Active", salary: 35000 },
  { name: "Alex Rivera", role: "Technical Director", status: "Active", salary: 32000 },
  { name: "Riya Sharma", role: "HR & People Operations", status: "Active", salary: 24000 },
  { name: "Marcus Vance", role: "Senior Project Lead", status: "Active", salary: 28000 },
  { name: "Priya Nair", role: "Lead Cloud Infrastructure", status: "Active", salary: 30000 },
  { name: "David Chen", role: "Senior Frontend Engineer", status: "Active", salary: 26000 },
  { name: "Ananya Iyer", role: "Fullstack Engineer", status: "Active", salary: 22000 },
  { name: "Kavita Rao", role: "DevOps & SRE Specialist", status: "Active", salary: 23000 },
  { name: "Rohit Verma", role: "Backend Systems Engineer", status: "Active", salary: 21000 },
  { name: "Sara Al-Mansoor", role: "Lead Product Designer", status: "Active", salary: 22000 },
  { name: "Vikram Joshi", role: "Data Engineer", status: "Active", salary: 20000 },
  { name: "Neha Patel", role: "QA Automation Lead", status: "Active", salary: 18000 },
  { name: "Arjun Mehta", role: "Technical Product Manager", status: "Active", salary: 27000 },
  { name: "Elena Rostova", role: "Cybersecurity Analyst", status: "Active", salary: 25000 },
  { name: "Karan Singhania", role: "Mobile Application Dev", status: "Active", salary: 21000 },
  { name: "Deepak Soni", role: "Cloud Systems Admin", status: "Active", salary: 19000 },
  { name: "Sameer Khan", role: "Associate Fullstack Dev", status: "Onboarding", salary: 14000 },
  { name: "Ishaan Gupta", role: "Frontend UI Intern", status: "Onboarding", salary: 10000 },
];

const obligations = [
  { id: "ob-1", month: "OCT", day: "28", title: "AWS Cloud Infrastructure & Edge CDN", clientName: "Apex Spatial Project", clientCode: "CLI-2001", amount: 68000, status: "due_soon", dueLabel: "Due in 3 days", dueDate: "2026-10-28" },
  { id: "ob-2", month: "OCT", day: "31", title: "KeySpex Core Team Payroll Run", clientName: "Core Team (18 Staff)", clientCode: "Auto-ACH", amount: 275000, status: "scheduled", dueLabel: "Scheduled", dueDate: "2026-10-31" },
  { id: "ob-3", month: "NOV", day: "05", title: "Vercel Enterprise Edge Hosting SLA", clientName: "Veloce Brand Store", clientCode: "CLI-2002", amount: 42000, status: "pending_auth", dueLabel: "Pending Auth", dueDate: "2026-11-05" },
  { id: "ob-4", month: "NOV", day: "10", title: "Security Pen-Testing Retainer", clientName: "Pulse Health Telehealth", clientCode: "CLI-2004", amount: 85000, status: "scheduled", dueLabel: "Scheduled", dueDate: "2026-11-10" },
];

const activities = [
  { actor: { name: "Roshan Patel", role: "Principal Architect", kind: "person" }, actionText: "Approved Architectural Blueprint for", targetCode: "PRJ-3001", context: "Apex Spatial Architecture (CLI-2001)", timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), status: "completed" },
  { actor: { name: "Riya Sharma", role: "HR Operations", kind: "person" }, actionText: "Reconciled Payroll Disbursement for", targetCode: "EMP-1002", context: "Technical Lead • October Run", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), status: "verified" },
  { actor: { name: "Finance Bot", role: "Automated Job", kind: "bot" }, actionText: "Recorded Inward Wire Transfer", targetCode: "PAY-6002", context: "₹1,95,000 from Nexa Financial Systems", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "reconciled" },
  { actor: { name: "Marcus Vance", role: "Senior Project Lead", kind: "person" }, actionText: "Completed Milestone 3 Deliverable on", targetCode: "PRJ-3002", context: "Veloce Lifestyle Apparel E-Commerce", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), status: "updated" },
];

const events = [
  { id: "evt-1", month: "OCT", day: "29", title: "Sprint 15 Architecture Review: Apex Spatial", category: "project_deadline", categoryLabel: "Project Deadline", time: "10:30 AM", context: "PRJ-3001 (Google Meet)", date: "2026-10-29" },
  { id: "evt-2", month: "OCT", day: "31", title: "Monthly Payroll & Compliance Settlement", category: "operations", categoryLabel: "Operations", time: "04:00 PM", context: "Finance & People Ops Room", date: "2026-10-31" },
  { id: "evt-3", month: "NOV", day: "02", title: "Q4 Executive Runway & Budget Review", category: "financial", categoryLabel: "Financial", time: "02:00 PM", context: "Leadership Council Room", date: "2026-11-02" },
  { id: "evt-4", month: "NOV", day: "04", title: "Client Sync: Veloce Brand Directors", category: "client_meeting", categoryLabel: "Client Meeting", time: "11:00 AM", context: "CLI-2002 (Strategy Sync)", date: "2026-11-04" },
];

async function seed() {
  console.log("Seeding Firestore live collections with KeySpex Real Enterprise Data...");
  const batch = writeBatch(db);

  // Financials
  batch.set(doc(db, "dashboard_financials", "current"), financials);

  // Projects
  for (const p of projects) {
    batch.set(doc(db, "dashboard_projects", p.code), { ...p, createdAt: new Date().toISOString() });
  }

  // Employees
  for (let i = 0; i < employees.length; i++) {
    const code = `EMP-${1001 + i}`;
    batch.set(doc(db, "dashboard_employees", code), { ...employees[i], code });
  }

  // Obligations
  for (const ob of obligations) {
    batch.set(doc(db, "dashboard_obligations", ob.id), ob);
  }

  // Activities
  for (let i = 0; i < activities.length; i++) {
    const id = `act-${i + 1}`;
    batch.set(doc(db, "dashboard_activities", id), { ...activities[i], id });
  }

  // Events
  for (const evt of events) {
    batch.set(doc(db, "dashboard_events", evt.id), evt);
  }

  await batch.commit();
  console.log("SUCCESS! Database populated with real KeySpex production data:");
  console.log("- Total Revenue: ₹15,63,000 across 12 live contracts");
  console.log("- 18 KeySpex core staff & engineers");
  console.log("- Real upcoming obligations & events");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
