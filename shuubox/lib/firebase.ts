// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shuubox-cba9b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shuubox-cba9b",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE || "shuubox-cba9b.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const functions = getFunctions(app, "us-central1");


