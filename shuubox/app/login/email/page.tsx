"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/Components/AppHeader";
import { Eye, EyeOff } from 'lucide-react'; // For the password toggle
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import { ensureUserDoc } from "@/lib/ensureUserDoc";

export default function LoginEmailPage() {
  const router = useRouter();
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(userCredential.user);
      router.push("/dashboard"); // Redirect to dashboard on success

    } catch(error:any) {
      setError("Incorrect email or password.");
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFAFA]">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        
        <h1 className="text-5xl font-extrabold text-[#231F20] mb-12">
          Log In
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full max-w-sm">
          <input
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-lg text-black bg-[#FFEBFF] border-2 border-black rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-lg text-black bg-[#FFEBFF] border-2 border-black rounded-full py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={authing}
            className="flex items-center justify-center w-full font-semibold text-lg text-black bg-[#5DE4DA] border-2 border-black rounded-full py-4 px-10 transition-all hover:shadow-md hover:scale-105 disabled:opacity-50"
          >
            {authing ? "Logging in..." : "Log In"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

       
        <p className="text-lg text-black mt-12">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-[#3CB7AE] hover:underline">
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}