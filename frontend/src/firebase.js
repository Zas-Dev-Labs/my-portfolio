import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyB6mAkZbSdDs_MMRc32idWbNvwYxCjNDu8",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "nth-dreamer-3nzsc.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "nth-dreamer-3nzsc",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "nth-dreamer-3nzsc.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1071456546039",
  appId: process.env.FIREBASE_APP_ID || "1:1071456546039:web:d1dbc8b22b4e21663af7f2"
};

const defaultDbId = "ai-studio-myportfolio-d2202d2f-64cd-4fdd-8316-f6cec69c1d3c";
export const liveDatabaseId = process.env.FIREBASE_DATABASE_ID_LIVE || process.env.FIREBASE_DATABASE_ID || defaultDbId;
export const devDatabaseId = process.env.FIREBASE_DATABASE_ID_DEV || liveDatabaseId;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, liveDatabaseId);
export const auth = getAuth(app);
export default app;
