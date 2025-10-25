// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, functions } from "@/lib/firebase"; // Import functions
import { httpsCallable } from "firebase/functions"; // Import httpsCallable
import { ensureUserDoc } from "@/lib/ensureUserDoc";

export default function LoginPage() {
   const router = useRouter();
   const [authing, setAuthing] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
        // 1. Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 2. Create their database profile (this is the new line)
        await ensureUserDoc(userCredential.user);

        // 3. Send them to the homepage
        router.push("/");

    } catch(error:any) {
        setError("Incorrect email or password.");
    } finally {
        setAuthing(false);
    }
   };
   

   // --- Discord Login Handler ---
   const getDiscordLink = httpsCallable(functions, "getDiscordAuthURL");

   const handleDiscordLogin = async () => {
    setAuthing(true);
    setError("");
    
    try {
      const randomString = Math.random().toString(36).substring(2, 15);
      window.sessionStorage.setItem("oauth_state", randomString);
      const result: any = await getDiscordLink({ state: randomString });
      const discordAuthUrl = result.data.url;
      window.location.href = discordAuthUrl;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start Discord login.");
      setAuthing(false);
    }
   };

   // --- JSX for the Page ---
   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form 
            onSubmit={handleLogin} 
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4"
        >
            <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
            
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button 
                type="submit" 
                disabled={authing} 
                className="w-full bg-blue-600 text-white py-2 rounded-md font-bold cursor-pointer hover:bg-blue-700 disabled:bg-gray-400"
            >
                {authing ? "Logging in..." : "Login"}
            </button>

            <button 
                type="button"
                onClick={handleDiscordLogin}
                disabled={authing}
                className="w-full bg-[#5865F2] text-white py-2 rounded-md font-bold cursor-pointer hover:bg-[#4a54c4] disabled:bg-gray-400"
            >
                Login with Discord
            </button>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            
            <Link href="/signup" className="text-center mt-2 text-blue-600 hover:underline">
                Don't have an account? Sign Up
            </Link>
        </form>
    </div>
   );
}