// lib/ensureUserDoc.ts
import { auth, db } from "@/lib/firebase"; // Import your auth and db
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth"; // Import the User type

// We pass the user in to make it more reliable
export async function ensureUserDoc(user: User) {
  if (!user) return; // Not logged in

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // If the document doesn't exist, create it
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      createdAt: serverTimestamp(),
      email: user.email ?? null,
      displayName: user.displayName ?? "New User",
      photoURL: user.photoURL ?? null,
      // Add other default info for your app here
    });
    console.log("New user document created in Firestore for:", user.uid);
  }
}