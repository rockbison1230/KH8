"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserDoc } from "@/lib/ensureUserDoc";
import Link from "next/link";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Authenticating, please wait...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Read & clear from localStorage (works across tabs)
    const originalState = localStorage.getItem("oauth_state");
    const ts = Number(localStorage.getItem("oauth_state_ts") || "0");
    localStorage.removeItem("oauth_state");
    localStorage.removeItem("oauth_state_ts");

    if (error) {
      setMessage(`Error: ${decodeURIComponent(error)}`);
      return;
    }

    // Optional expiry (10 minutes)
    const tooOld = !ts || Date.now() - ts > 10 * 60 * 1000;

    if (!state || !originalState || state !== originalState || tooOld) {
      setMessage("Error: Invalid or expired state. Please start the login again.");
      return;
    }

    if (!token) {
      setMessage("Error: No authentication token provided.");
      return;
    }

    (async () => {
      try {
        const cred = await signInWithCustomToken(auth, token);
        try {
          await ensureUserDoc(cred.user);
        } catch (e) {
          console.warn("[ensureUserDoc] optional step failed:", e);
        }
        router.replace("/dashboard");
      } catch (e: any) {
        console.error(e);
        setMessage("Error: Could not sign in with custom token.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const isError = message.startsWith("Error:");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg font-medium">{message}</p>
        {isError && (
          <Link href="/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Login
          </Link>
        )}
      </div>
    </div>
  );
}
