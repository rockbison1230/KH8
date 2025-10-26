"use client";

import React, { useState } from "react";

// --- Firebase & Auth (Inlined) ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

// --- Header (Placeholder) ---
function AppHeader() {
  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-20 bg-white shadow-sm">
      <span className="font-bold text-lg">Shuubox</span>
    </header>
  );
}

// --- Icon Options ---
const IconOptions = [
    { name: "Heart", value: "heart", symbol: "❤️" },
    { name: "Sparkle", value: "sparkle", symbol: "✨" },
    { name: "Music", value: "music", symbol: "🎵" },
    { name: "Book", value: "book", symbol: "📚" },
    { name: "Gaming", value: "gaming", symbol: "🎮" },
];

export default function CreateListPage() {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(IconOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateList = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to create a list.");
      return;
    }
    if (!listName.trim()) {
      setError("List name cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Reference to the lists subcollection for the current user
      const listsColRef = collection(db, "users", user.uid, "lists");

      await addDoc(listsColRef, {
        title: listName.trim(),
        description: listDescription.trim(),
        icon: selectedIcon,
        createdAt: serverTimestamp(),
      });

      // Redirect back to the dashboard upon success
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Error creating list: ", err);
      setError(err.message || "Failed to create list. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center pt-24 bg-[#FFFAFA] p-4">
      <AppHeader />

      <main className="w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-[#231F20] mb-8 text-center">
          Create New List
        </h1>

        <div className="bg-white p-6 rounded-3xl shadow-lg space-y-8 border-2 border-black">
          {/* List Name */}
          <div className="text-left">
            <label className="block text-sm font-semibold mb-2" htmlFor="listName">
              List Name
            </label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="e.g., RPGs I Need to Play"
              className="w-full text-lg border-2 border-black rounded-xl py-3 px-4 bg-transparent focus:ring-2 focus:ring-cyan-300 focus:outline-none"
              maxLength={50}
            />
          </div>

          {/* Icon Selector (Simplified) */}
          <div className="text-left">
            <label className="block text-sm font-semibold mb-2">
              Select Icon
            </label>
            <div className="flex flex-wrap gap-3 p-3 border-2 border-gray-200 rounded-xl">
              {IconOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedIcon(option.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                    selectedIcon === option.value
                      ? "border-black bg-cyan-300 shadow-md"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl">{option.symbol}</span>
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="text-left">
            <label className="block text-sm font-semibold mb-2" htmlFor="description">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              placeholder="What kind of media will this list track?"
              maxLength={200}
              className="w-full text-lg border-2 border-black rounded-xl py-3 px-4 h-24 resize-none bg-transparent focus:ring-2 focus:ring-cyan-300 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="font-semibold text-lg border-2 border-black bg-white text-black rounded-xl py-3 px-6 transition-all hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateList}
            disabled={isLoading || !listName.trim()}
            className="font-semibold text-lg border-2 border-black bg-cyan-300 text-black rounded-xl py-3 px-6 transition-all hover:bg-cyan-400 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Done"}
          </button>
        </div>
      </main>
    </div>
  );
}