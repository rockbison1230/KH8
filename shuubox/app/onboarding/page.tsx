"use client";

import React, { useState } from "react";

// --- Firebase & Auth (Inlined) ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

// Config from your project history
const firebaseConfig = {
  apiKey: "AIzaSyCrghhV1y1MDJJFpO5Wph6IBppf_yrQyro",
  authDomain: "shuubox-cba9b.firebaseapp.com",
  projectId: "shuubox-cba9b",
  appId: "1:47728561275:web:a071c0d0153074a244e6de",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
// ---------------------------------

// --- Header (matches your design) ---
function OnboardingHeader() {
  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center">
      <span className="font-bold text-lg">Shuubox</span>
      <span className="font-mono text-sm">~ s ~</span>
    </header>
  );
}

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Using ShuubotIcon as the default, per your request
  const defaultAvatarUrl = "/ShuubotIcon.svg";

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("No user is signed in.");
      return;
    }
    if (!displayName) {
      setError("Please enter a display name.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Update the Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName,
        photoURL: defaultAvatarUrl,
      });

      // 2. Update the Firestore user document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        introduction: introduction,
        photoURL: defaultAvatarUrl,
        hasCompletedOnboarding: true, // This is the all-important flag!
      });

      // 3. Redirect to the dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Onboarding failed: ", err);
      setError(err.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    // UPDATED: Set background color to bg-white as #FFFAFA may not be loading
    <div className="flex flex-col min-h-screen items-center justify-center bg-white p-4">
      <OnboardingHeader />

      <main className="w-full max-w-md">
        {/* UPDATED: Styling for title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#231F20] mb-2">
            Let's begin
          </h1>
          <p className="text-lg text-gray-700">Discover. Track. Connect.</p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Display Name */}
          <div className="text-left">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="displayName"
            >
              Display Name
            </label>
            {/* UPDATED: Styling for input */}
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Anime Watcher"
              className="w-full text-lg border-2 border-black rounded-2xl py-3 px-5 bg-transparent focus:ring-2 focus:ring-cyan-300 focus:outline-none"
            />
          </div>

          {/* Avatar Section (Styled to match) */}
          <div className="flex items-center space-x-4">
            {/* UPDATED: Styled placeholder '?' icon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-black">
              <span className="text-4xl font-semibold text-gray-400">?</span>
            </div>
            {/* UPDATED: Styled button */}
            <button className="px-6 py-2 border-2 border-black rounded-xl text-black font-semibold bg-white">
              Upload Avatar
            </button>
          </div>

          <div className="text-left">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="introduction"
            >
              Introduce Yourself!
            </label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="I like to watch ... (max 200 characters)"
              maxLength={200}
              className="w-full text-lg border-2 border-black rounded-2xl py-3 px-5 h-28 resize-none bg-transparent focus:ring-2 focus:ring-cyan-300 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => (window.location.href = "/login")} // Go "back" to login
              className="flex-1 font-semibold text-lg border-2 border-black bg-white text-black rounded-xl py-3 transition-all hover:bg-gray-100"
            >
              back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 font-semibold text-lg border-2 border-black bg-cyan-300 text-black rounded-xl py-3 transition-all hover:bg-cyan-400 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "done"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

