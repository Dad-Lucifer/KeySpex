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

// 18 Core KeySpex Employees with enriched departments & primary project allocations
const enrichedEmployees = [
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
];

// 4 Active Project Contractors (Milestone / One-Time Payouts)
const contractors = [
  { code: "CTR-5001", name: "Tanya Sen", role: "3D Spatial Mesh Modeler", department: "Engineering", status: "Active", salary: 35000, type: "contractor", assignedProject: "PRJ-3001", email: "tanya.external@keyspex.com", contractTerms: "Milestone Deliverable" },
  { code: "CTR-5002", name: "Devansh Verma", role: "Smart Contract Security Auditor", department: "Cloud & DevOps", status: "Active", salary: 45000, type: "contractor", assignedProject: "PRJ-3003", email: "devansh.audit@keyspex.com", contractTerms: "Fixed Audit Retainer" },
  { code: "CTR-5003", name: "Priya Sharma", role: "Flutter UI Performance Polish", department: "Engineering", status: "Active", salary: 28000, type: "contractor", assignedProject: "PRJ-3004", email: "priya.mobile@keyspex.com", contractTerms: "Sprint Milestone" },
  { code: "CTR-5004", name: "Rahul Kapoor", role: "PostgreSQL Lakehouse Architect", department: "Engineering", status: "Active", salary: 32000, type: "contractor", assignedProject: "PRJ-3009", email: "rahul.data@keyspex.com", contractTerms: "One-Time Performance Optimization" },
];

// Additional SaaS Subscriptions in dashboard_obligations
const additionalSubscriptions = [
  {
    id: "ob-5",
    month: "NOV",
    day: "02",
    title: "Figma Enterprise Design System Retainer",
    clientName: "Design Systems & Tokens",
    clientCode: "CLI-SUB-01",
    amount: 18000,
    status: "scheduled",
    dueLabel: "Scheduled",
    dueDate: "2026-11-02",
    type: "subscription",
  },
  {
    id: "ob-6",
    month: "NOV",
    day: "08",
    title: "OpenAI & Anthropic Foundation Model API",
    clientName: "KeySpex AI Infrastructure",
    clientCode: "CLI-SUB-02",
    amount: 32000,
    status: "scheduled",
    dueLabel: "Scheduled",
    dueDate: "2026-11-08",
    type: "subscription",
  },
];

async function seedPayroll() {
  console.log("Seeding enriched payroll, contractor, and subscription datasets...");
  const batch = writeBatch(db);

  // 1. Employees
  for (const emp of enrichedEmployees) {
    batch.set(doc(db, "dashboard_employees", emp.code), {
      ...emp,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }

  // 2. Contractors
  for (const ctr of contractors) {
    batch.set(doc(db, "dashboard_employees", ctr.code), {
      ...ctr,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }

  // 3. Subscriptions
  for (const sub of additionalSubscriptions) {
    batch.set(doc(db, "dashboard_obligations", sub.id), {
      ...sub,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }

  await batch.commit();
  console.log("SUCCESS! Payroll database enriched:");
  console.log("- 18 Core Employees with department and project mappings");
  console.log("- 4 Active Project Contractors with milestone compensation");
  console.log("- 2 Additional SaaS Subscriptions (Figma & AI APIs)");
  process.exit(0);
}

seedPayroll().catch((err) => {
  console.error("Seeding payroll failed:", err);
  process.exit(1);
});
