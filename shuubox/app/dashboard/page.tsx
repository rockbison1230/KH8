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
  icon: string; // icon name
};

function ListCard({ title, href, icon }: ListCardProps) {
  const content = (
    <div className="bg-white rounded-4xl p-10 h-30 justify-between w-full flex items-center gap-4 p-4 border-2 hover:bg-gray-300 transition">
      <img src={`/${icon}.svg`} alt="list icon" className="w-6 h-6" />
      <span className="text-2xl">{title}</span>
    </div>
  );

  // If href is provided, make the whole card clickable
  return href ? <Link href={href}>{content}</Link> : content;
}


function CreateNewCard({ href }: { href: string }) {
  const card = (
    <div className="bg-white rounded-4xl p-10 h-30 justify-between w-full flex items-center gap-4 p-4 border-2 hover:bg-gray-300 transition">
      <span className="text-4xl font-light">+</span>
      <span className="text-2xl">Create New</span>
    </div>
    );
    // If href is provided, make the whole card clickable
    return href ? <Link href={href}>{card}</Link> : card;
}

export default function DashboardPage() {
  const user = useUser();

  return (
    
      <div className="flex min-h-screen">
        <Sidebars />
        <main className="flex-1 p-10 bg-white">
          {/* Header section */}
          <header className="flex justify-between items-center mb-10 p-5">
            <div className="flex items-center space-x-4">
              {/* <span className="w-10 h-10 bg-gray-300 rounded-full"></span> */}
              <img src={"Shuubot.svg"} alt="heart icon" className="w-15 h-15" />
              <h3 className="text-3xl font-semibold p-4">  {user?.displayName || user?.email?.split('@')[0] || "User"}'s Lists</h3>

            </div>
            <div></div>
          </header>

          <div>
            <div className="grid gap-6 ">
              <ListCard title="Movies" href="/movies" icon="heart"/>
              <ListCard title="Books" href="/books" icon="book"/>
              {/* <ListCard title="Music" href="/music" icon="music"/> */}
              <ListCard title="Shows" href="/shows" icon="animation"/>
              {/* <ListCard title="Games" href="/games" icon="game"/>
              <ListCard title="Books" href="/books"/> */}
              <CreateNewCard href="/create-list"/>
            </div>
          </div>
        </main>
      </div>
    
  );
}