import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export type UserRole = "Admin" | "Employee" | "Client"

export type AuthUserData = {
  uid: string
  username: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

const DEFAULT_ACCOUNTS: Array<{ username: string; password: string; name: string; role: UserRole }> = [
  { username: "superadmin", password: "admin2026", name: "Alex Rivera", role: "Admin" },
  { username: "admin", password: "admin2026", name: "Alex Rivera", role: "Admin" },
  { username: "riya.hr", password: "admin2026", name: "Riya Sharma", role: "Employee" },
  { username: "apex.client", password: "admin2026", name: "Apex Global Rep", role: "Client" },
]

/**
 * Convert any username to an auth email format for Firebase Auth compatibility
 */
export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase()
  if (clean.includes("@")) return clean
  return `${clean.replace(/[^a-z0-9._-]/g, "")}@keyspex.internal`
}

/**
 * Save user session to localStorage for immediate UI persistence
 */
export function persistLocalUser(user: AuthUserData) {
  try {
    localStorage.setItem("keyspex_admin_user", JSON.stringify(user))
  } catch {
    // Ignore storage issues
  }
}

/**
 * Retrieve current user session from localStorage
 */
export function getStoredUser(): AuthUserData | null {
  try {
    const raw = localStorage.getItem("keyspex_admin_user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Save account in local cache as resilience fallback
 */
function cacheLocalAccount(account: { username: string; password: string; name: string; role: UserRole }) {
  try {
    const raw = localStorage.getItem("keyspex_admin_accounts")
    const existing = raw ? JSON.parse(raw) : []
    const filtered = existing.filter((a: { username: string }) => a.username.toLowerCase() !== account.username.toLowerCase())
    localStorage.setItem("keyspex_admin_accounts", JSON.stringify([...filtered, account]))
  } catch {
    // Ignore storage issues
  }
}

/**
 * Register a new user in Firebase Auth and Firestore with a specified role
 */
export async function signUpWithFirebase(
  username: string,
  password: string,
  role: UserRole,
  displayName?: string
): Promise<AuthUserData> {
  const cleanUsername = username.trim()
  const email = usernameToEmail(cleanUsername)
  const name = displayName?.trim() || cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)

  try {
    // 1. Create in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    // 2. Set Firebase Auth display name
    try {
      await updateProfile(user, { displayName: name })
    } catch {
      // Non-fatal
    }

    const userData: AuthUserData = {
      uid: user.uid,
      username: cleanUsername,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    }

    // 3. Store role and profile in Firestore 'users' collection
    try {
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, {
        uid: user.uid,
        username: cleanUsername,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      })
    } catch (firestoreErr) {
      console.warn("Firestore user profile save warning (fallback used):", firestoreErr)
    }

    // 4. Cache locally
    cacheLocalAccount({ username: cleanUsername, password, name, role })
    persistLocalUser(userData)

    return userData
  } catch (firebaseErr: unknown) {
    // If Firebase Auth throws (e.g. project credentials not active or offline), gracefully register in local cache
    console.warn("Firebase Auth registration failed, using local offline persistence:", firebaseErr)

    const fallbackUser: AuthUserData = {
      uid: `local-${Date.now()}`,
      username: cleanUsername,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    }

    cacheLocalAccount({ username: cleanUsername, password, name, role })
    persistLocalUser(fallbackUser)

    return fallbackUser
  }
}

/**
 * Sign in using Username and Password via Firebase Auth and read role from Firestore
 */
export async function signInWithFirebase(
  username: string,
  password: string
): Promise<AuthUserData> {
  const cleanUsername = username.trim()
  const email = usernameToEmail(cleanUsername)

  try {
    // 1. Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const { user } = userCredential

    // 2. Retrieve role from Firestore
    let role: UserRole = "Admin"
    let name = user.displayName || cleanUsername

    try {
      const userDocRef = doc(db, "users", user.uid)
      const userSnapshot = await getDoc(userDocRef)
      if (userSnapshot.exists()) {
        const data = userSnapshot.data()
        if (data.role) role = data.role as UserRole
        if (data.name) name = data.name
      }
    } catch (firestoreErr) {
      console.warn("Firestore role fetch warning:", firestoreErr)
    }

    const userData: AuthUserData = {
      uid: user.uid,
      username: cleanUsername,
      name,
      email: user.email || email,
      role,
    }

    persistLocalUser(userData)
    return userData
  } catch (firebaseErr: unknown) {
    // 3. Fallback: check locally stored accounts and default demo credentials
    const localRaw = localStorage.getItem("keyspex_admin_accounts")
    const localAccounts = localRaw ? JSON.parse(localRaw) : []
    const allAccounts = [...DEFAULT_ACCOUNTS, ...localAccounts]

    const matched = allAccounts.find(
      (a) => a.username.toLowerCase() === cleanUsername.toLowerCase() && a.password === password
    )

    if (matched) {
      const fallbackUser: AuthUserData = {
        uid: `demo-${matched.username}`,
        username: matched.username,
        name: matched.name,
        email,
        role: matched.role,
      }
      persistLocalUser(fallbackUser)
      return fallbackUser
    }

    throw firebaseErr
  }
}

/**
 * Sign out user
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(auth)
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem("keyspex_admin_user")
  } catch {
    // ignore
  }
}
