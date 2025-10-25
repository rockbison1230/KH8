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
    
    const originalState = window.sessionStorage.getItem("oauth_state");
    
    window.sessionStorage.removeItem("oauth_state");

    if (!state || state !== originalState) {
      setMessage("Error: Invalid state. Authentication failed. Please try again.");
      return;
    }

    if (error) {
      setMessage(`Error: ${error}`);
      return;
    }


if (token) {
      signInWithCustomToken(auth, token)
        .then(async (userCredential) => { 
          
          // 2. Add this line to create the user's profile
          await ensureUserDoc(userCredential.user); 
          
          // 3. Now redirect to home
          router.push("/");
        })
        .catch((err) => {
          console.error(err);
          setMessage("Error: Could not sign in with custom token.");
        });
    } else {
      setMessage("Error: No authentication token provided.");
    }
  }, [searchParams, router]); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg font-medium">{message}</p>
        {message.startsWith("Error") && (
          <Link href="/login" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Login
          </Link>
        )}
      </div>
    </div>
  );
}