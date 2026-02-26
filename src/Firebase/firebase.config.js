import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase with safety check
let app;
try {
  if (!firebaseConfig.apiKey) {
    throw new Error("VITE_API_KEY is missing. Check your .env or Vercel environment variables.");
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
}

// Export instances
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;