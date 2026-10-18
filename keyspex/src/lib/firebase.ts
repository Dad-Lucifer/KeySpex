import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBCg9vI46g4IUdVTgfxeu7FR7j8MX1dKIw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "keyspex.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "keyspex",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "keyspex.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "936482233344",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:936482233344:web:f3a98e5fc6c9e5264e8ce5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WDZEB6T3Z8",
}

// Singleton initialization
export const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
