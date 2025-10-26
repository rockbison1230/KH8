"use client";

import React, { useState } from "react";
import AppHeader from "@/Components/AppHeader"; 

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrghhV1y1MDJJFpO5Wph6IBppf_yrQyro",
  authDomain: "shuubox-cba9b.firebaseapp.com",
  projectId: "shuubox-cba9b",
  appId: "1:47728561275:web:a071c0d0153074a244e6de",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
// ---------------------------------


export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        hasCompletedOnboarding: true,
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
    // FIX 2 & 4: Set background color to match AppHeader (bg-[#FFFAFA]).
    // FIX 1 & 3: Removed 'justify-center' to prevent pushing content off-screen.
    <div className="flex flex-col min-h-screen items-center bg-[#FFFAFA]">
      <AppHeader />

      {/* FIX 1 & 3: Added sufficient top padding (pt-24) to ensure the content clears the fixed header. 
          The 'flex-grow' ensures the main content area expands correctly. */}
      <main className="w-full max-w-md p-4 pt-24 pb-8 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black mb-2">
            Welcome to Shuubox! 🎉
          </h1>
          <p className="text-base text-black">
            Let's finish setting up your profile in one quick step.
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Display Name */}
          <div className="text-left">
            <label
              className="block text-sm font-semibold mb-2 text-black"
              htmlFor="displayName"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Anime Watcher"
              className="w-full text-base border-2 border-black rounded-2xl py-3 px-5 bg-transparent focus:ring-2 focus:ring-teal-300 focus:outline-none placeholder:text-gray-500 text-black"
            />
          </div>

          {/* Avatar Section (Styled to match) */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-black">
              <span className="text-3xl font-semibold text-black">?</span>
            </div>
            <button className="px-6 py-2 border-2 border-black rounded-xl text-black font-semibold bg-white text-base">
              Upload Avatar
            </button>
          </div>

          {/* Introduction */}
          <div className="text-left">
            <label
              className="block text-sm font-semibold mb-2 text-black"
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
              className="w-full text-base border-2 border-black rounded-2xl py-3 px-5 h-28 resize-none bg-transparent focus:ring-2 focus:ring-teal-300 focus:outline-none placeholder:text-gray-500 text-black"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => (window.location.href = "/login")} // Go "back" to login
              className="flex-1 font-semibold text-base border-2 border-black bg-white text-black rounded-xl py-3 transition-all hover:bg-gray-100"
            >
              back
            </button>
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
