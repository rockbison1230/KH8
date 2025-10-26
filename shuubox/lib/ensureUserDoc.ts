// lib/ensureUserDoc.ts
import { auth, db } from "@/lib/firebase"; 
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth"; 

export async function ensureUserDoc(user: User) {
  if (!user) return; 

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      createdAt: serverTimestamp(),
      email: user.email ?? null,
      displayName: user.displayName ?? "New User",
      photoURL: user.photoURL ?? null,
      hasCompletedOnboarding: false,
    });
    console.log("New user document created in Firestore for:", user.uid);
  }
}