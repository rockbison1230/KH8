// components/OnboardingGate.tsx
"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function OnboardingGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      return; // AuthGate will handle the redirect to /login
    }

    // Check the user's document for the flag
    const userRef = doc(db, "users", user.uid);

    // Use onSnapshot to listen for changes in real-time
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.hasCompletedOnboarding) {
          // --- User is onboarded, let them see the page ---
          setIsOnboarded(true);
          setLoading(false);
        } else {
          // --- User is NOT onboarded, redirect them ---
          router.replace("/onboarding");
        }
      } else {
        // This can happen if signup is still in-progress
        setLoading(true);
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [router]);

  // Show a loading screen while we check the database
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  // If user is onboarded, show the dashboard
  if (isOnboarded) {
    return <>{children}</>;
  }

  // Fallback (should be covered by loading or redirect)
  return null;
}