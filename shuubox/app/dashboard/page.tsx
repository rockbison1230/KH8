"use client";

import AuthGate from "@/Components/AuthGate";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Sidebars from "@/Components/Sidebara";

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



// List card component
import Link from "next/link";

type ListCardProps = {
  title: string;
  href?: string; // optional link
};

function ListCard({ title, href }: ListCardProps) {
  const content = (
    <div className="bg-gray-200 rounded-2xl h-84 w-70 flex items-end justify-center p-4 hover:bg-gray-300 transition border-4">
      <span className="font-semibold">{title}</span>
    </div>
  );

  // If href is provided, make the whole card clickable
  return href ? <Link href={href}>{content}</Link> : content;
}


// function CreateNewCard() {
//   return (
//     <div className="bg-gray-200 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4">
//       <span className="text-4xl font-light">+</span>
//       <span className="font-semibold">Create New</span>
//     </div>
//   );
// }

export default function DashboardPage() {
  const user = useUser();

  return (
    
      <div className="flex min-h-screen">
        <Sidebars />
        <main className="flex-1 p-10 bg-white">
          {/* Header section */}
          <header className="flex justify-between items-center mb-10">
            
            <div className="flex items-center space-x-4">
              <span className="w-20 h-20 bg-gray-300 rounded-full border-4"></span>
              <h3 className="text-2xl">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || "User"}
              </h3>
            </div>
            <div></div>
          </header>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Your Lists</h3>
            <div className="grid grid-cols-4 gap-6">
              <ListCard title="Movies" href="/movies" />
              <ListCard title="Albums" href="/albums"/>
              <ListCard title="Shows" href="/shows"/>
              <ListCard title="Games" href="/games"/>
              <ListCard title="Books" href="/books"/>
              {/* <CreateNewCard /> */}
            </div>
          </div>
        </main>
      </div>
    
  );
}