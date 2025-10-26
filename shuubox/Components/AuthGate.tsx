// components/AuthGate.tsx
"use client";
import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Make sure you import your 'auth'

export default function AuthGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user, redirect to login
        router.replace("/login");
      } else {
        // User is logged in, stop loading
        setLoading(false);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [router]);

  // Show a loading screen while checking
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  // If loaded and user is present, show the page
  return <>{children}</>;
}