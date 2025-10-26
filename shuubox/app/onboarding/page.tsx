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

// --- AppHeader (Placeholder based on your design) ---
function AppHeader() {
  return (
    // UPDATED: Matched background to page
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-gray-50">
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
    // UPDATED: Set background color to bg-gray-50 (to match Figma's #FFFAFA)
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4 pt-16">
      <AppHeader />

      <main className="w-full max-w-md">
        {/* UPDATED: Styling for title */}
        <div className="text-center mb-10">
          {/* UPDATED: text-4xl -> text-3xl */}
          <h1 className="text-3xl font-extrabold text-[#231F20] mb-2">
            Let's begin
          </h1>
          {/* UPDATED: text-lg -> text-base */}
          <p className="text-base text-gray-700">Discover. Track. Connect.</p>
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
            {/* UPDATED: text-lg -> text-base, added placeholder color */}
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Anime Watcher"
              className="w-full text-base border-2 border-black rounded-2xl py-3 px-5 bg-transparent focus:ring-2 focus:ring-teal-300 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Avatar Section (Styled to match) */}
          <div className="flex items-center space-x-4">
            {/* UPDATED: Styled placeholder '?' icon, text-4xl -> text-3xl */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-black">
              <span className="text-3xl font-semibold text-gray-400">?</span>
            </div>
            {/* UPDATED: Styled button, text-base */}
            <button className="px-6 py-2 border-2 border-black rounded-xl text-black font-semibold bg-white text-base">
              Upload Avatar
            </button>
          </div>

          {/* Introduction */}
          <div className="text-left">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="introduction"
            >
              Introduce Yourself!
            </label>
            {/* UPDATED: text-lg -> text-base, added placeholder color */}
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="I like to watch ... (max 200 characters)"
              maxLength={200}
              className="w-full text-base border-2 border-black rounded-2xl py-3 px-5 h-28 resize-none bg-transparent focus:ring-2 focus:ring-teal-300 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {/* UPDATED: "back" button styling, text-lg -> text-base */}
            <button
              onClick={() => (window.location.href = "/login")} // Go "back" to login
              className="flex-1 font-semibold text-base border-2 border-black bg-white text-black rounded-xl py-3 transition-all hover:bg-gray-100"
            >
              back
            </button>
            {/* UPDATED: "done" button styling, text-lg -> text-base, bg-cyan-300 -> bg-teal-300 */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 font-semibold text-base border-2 border-black bg-teal-300 text-black rounded-xl py-3 transition-all hover:bg-teal-400 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "done"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

