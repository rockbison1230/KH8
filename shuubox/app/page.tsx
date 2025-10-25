// app/page.tsx
"use client";

import AuthGate from "@/components/AuthGate";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// A simple hook to get the current user (you can move this to its own file later)
function useUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  return user;
}

// Sidebar component (internal to this file)
function Sidebar() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut(auth);
  };

  const navItems = ["Home", "Profile", "Friends", "Stats", "Discord"];
  
  return (
    <aside className="w-64 bg-gray-100 p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-8">Shuubox</h1>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="flex items-center space-x-3 text-gray-700 hover:text-black"
          >
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            <span>{item}</span>
          </a>
        ))}
      </nav>
      <div className="flex-grow"></div>
      <a
        href="#"
        onClick={handleSignOut}
        className="flex items-center space-x-3 text-gray-700 hover:text-black"
      >
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
        <span>Log Out</span>
      </a>
    </aside>
  );
}

function ListCard({ title }: { title: string }) {
  return (
    <div className="bg-gray-200 rounded-2xl h-48 w-40 flex items-end justify-center p-4">
      <span className="font-semibold">{title}</span>
    </div>
  );
}
function CreateNewCard() {
  return (
    <div className="bg-gray-200 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4">
      <span className="text-4xl font-light">+</span>
      <span className="font-semibold">Create New</span>
    </div>
  );
}

export default function DashboardPage() {
  const user = useUser();

  return (
    <AuthGate>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10 bg-white">
          {/* Header section */}
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl text-gray-400">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="w-10 h-10 bg-gray-300 rounded-full"></span>
              <h3 className="text-2xl">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || "User"}
              </h3>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </header>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Your Lists</h3>
            <div className="grid grid-cols-4 gap-6">
              <ListCard title="Movies" />
              <ListCard title="Albums" />
              <ListCard title="" />
              <ListCard title="" />
              <ListCard title="" />
              <ListCard title="" />
              <ListCard title="" />
              <CreateNewCard />
            </div>
          </div>
        </main>
      </div>
    </AuthGate>
  );
}