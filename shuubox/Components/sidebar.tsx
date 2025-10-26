"use client";

// Import Firebase services
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
// Note: Removed 'next/link' as it causes build errors. Using standard <a> tags.

// --- Firebase Config (Inlined to fix import errors) ---
// UPDATED: Hardcoded env variables to fix 'process is not defined' error
const firebaseConfig = {
  apiKey: "AIzaSyCrghhV1y1MDJJFpO5Wph6IBppf_yrQyro",
  authDomain: "shuubox-cba9b.firebaseapp.com",
  projectId: "shuubox-cba9b",
  appId: "1:47728561275:web:a071c0d0153074a244e6de",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// --------------------------------------------------

export default function Sidebar() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Add redirect back to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navItems = [
    { name: "Home", href: "/dashboard" },
    { name: "Friends", href: "/friends" },
    { name: "Stats", href: "/stats" },
    { name: "Profile", href: "/profile" },
    { name: "Edit", href: "/edit" },
  ];

  return (
    <aside
      // Using the layout and styling from your new code
      className="fixed left-0 top-0 h-full w-48 bg-[#5DE4DA] flex flex-col justify-between rounded-r-3xl shadow-lg"
    >
      {/* Logo */}
      <div className="pt-8 text-center">
        {/* Replaced custom font class with standard Tailwind class */}
        <h1 className="text-xl font-bold text-black">Shuubox</h1>
      </div>

      {/* Navigation */}
      {/* Replaced custom font class with standard Tailwind class */}
      <nav className="flex flex-col items-center space-y-6 mt-8 text-black text-base">
        {navItems.map((item) => (
          // Replaced <Link> with <a> to fix import error
          <a
            key={item.name}
            href={item.href}
            className="hover:font-semibold transition-all"
          >
            {item.name}
          </a>
        ))}
      </nav>

      {/* Log Out */}
      <button
        onClick={handleSignOut}
        // Replaced custom font class with standard Tailwind class
        className="mb-8 text-black hover:font-semibold transition-all"
      >
        Log Out
      </button>
    </aside>
  );
}

