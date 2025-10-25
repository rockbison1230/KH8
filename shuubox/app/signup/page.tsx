'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { ensureUserDoc } from "@/lib/ensureUserDoc";

export default function SignUp() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const router = useRouter();

  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailClick = () => setShowEmailForm(true);
  const handleClose = () => {
    setShowEmailForm(false);
    setError(""); 
  };

  const getDiscordLink = httpsCallable(functions, "getDiscordAuthURL");

  const handleDiscordSignup = async () => {
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
      setError(err.message || "Failed to start Discord signup.");
      setAuthing(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, { displayName: name });
      
      await ensureUserDoc(userCredential.user);
      
      router.push("/dashboard");

    } catch (err: any) {
      console.error(err);
      setError("Failed to create account. (Is the password 6+ characters?)");
    } finally {
      setAuthing(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-3 left-3 flex items-center space-x-2">
        <Image
          src="/shuubox.svg"
          alt="My Logo"
          width={250} 
          height={100} 
          className=""
        />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-black">Sign up!</h1>
        <button 
          onClick={handleEmailClick}
          className="w-full bg-blue-600 text-white py-2 rounded-md mb-4 hover:bg-blue-700 transition-colors"
          disabled={authing}
        >
          Continue with Email
        </button> 

        <button
          onClick={handleDiscordSignup} 
          className="w-full bg-[#5865F2] text-white py-2 rounded-md hover:bg-[#4752C4] transition-colors"
          disabled={authing}
        >
          {authing ? "Working..." : "Continue with Discord"}
        </button>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>

        {showEmailForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                onClick={handleClose}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center text-black">
                Sign up with email
              </h2>
              <form
                onSubmit={handleEmailSignup}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (6+ characters)"
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={authing}
                >
                  {authing ? "Creating..." : "Create Account"}
                </button>
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}