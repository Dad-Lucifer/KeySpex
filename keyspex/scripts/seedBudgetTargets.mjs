import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

const budgetTarget2026 = {
  year: 2026,
  annualCap: 2000000,
  fiscalQuarter: "Q4",
  monthlyTargets: {
    jan: 310000,
    feb: 420000,
    mar: 560000,
    apr: 720000,
    may: 840000,
    jun: 980000,
    jul: 1100000,
    aug: 1230000,
    sep: 1360000,
    oct: 1480000,
    nov: 1620000,
    dec: 1800000,
  },
  departmentAllocations: {
    operations: 703350,
    payroll: 417000,
    infrastructure: 442650,
    growthAndMarketing: 250000,
    contingencyReserve: 187000,
  },
  updatedAt: new Date().toISOString(),
};

async function seedBudgetTargets() {
  console.log("Seeding Firestore collection 'budget_targets/2026'...");
  const targetRef = doc(db, "budget_targets", "2026");
  await setDoc(targetRef, budgetTarget2026, { merge: true });
  console.log("SUCCESS! budget_targets/2026 populated.");
  console.log(`- Annual Cap: ₹${budgetTarget2026.annualCap.toLocaleString("en-IN")}`);
  console.log("- 12-month targets populated.");
  process.exit(0);
}

seedBudgetTargets().catch((err) => {
  console.error("Seeding budget targets failed:", err);
  process.exit(1);
});
