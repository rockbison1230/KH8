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

    // Always clear stored state once read (prevents reuse)
    const originalState = sessionStorage.getItem("oauth_state");
    sessionStorage.removeItem("oauth_state");

    // 1) If Discord sent an error, show it immediately
    if (error) {
      setMessage(`Error: ${decodeURIComponent(error)}`);
      return;
    }

    // 2) Validate state presence and match
    if (!state || !originalState || state !== originalState) {
      setMessage("Error: Invalid state. Please start the login again.");
      return;
    }

    // 3) Require token
    if (!token) {
      setMessage("Error: No authentication token provided.");
      return;
    }

    // 4) Sign in with Firebase custom token
    (async () => {
      try {
        const cred = await signInWithCustomToken(auth, token);
        // Create/merge a user doc if you need it
        try {
          await ensureUserDoc(cred.user);
        } catch (e) {
          // Non-fatal for sign-in; log but continue
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
