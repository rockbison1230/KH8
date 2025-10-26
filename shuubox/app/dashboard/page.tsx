"use client";

import React, { ReactNode, useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // UPDATED: Removed this import

// --- Firebase & Auth (Inlined) ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, onSnapshot, collection } from "firebase/firestore";

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

// --- 1. AuthGate Component (Placeholder) ---
// This component checks if the user is logged in
function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  // const router = useRouter(); // UPDATED: Removed this hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in, redirect to login
        // UPDATED: Replaced router.replace with window.location.href
        window.location.href = "/login";
      } else {
        // Logged in, show content
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []); // UPDATED: Removed router from dependency array

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return <>{children}</>;
}


// --- 2. OnboardingGate Component (Your logic) ---
// This component checks if the user has been onboarded
function OnboardingGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  // const router = useRouter(); // UPDATED: Removed this hook

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // This shouldn't be hit if wrapped by AuthGate, but as a fallback:
      // UPDATED: Replaced router.replace with window.location.href
      window.location.href = "/login";
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.hasCompletedOnboarding) {
          // --- User IS onboarded, let them see the page ---
          setIsOnboarded(true);
          setLoading(false);
        } else {
          // --- User is NOT onboarded, redirect them ---
          // UPDATED: Replaced router.replace with window.location.href
          window.location.href = "/onboarding";
        }
      } else {
        // User doc doesn't exist, means signup/onboarding isn't complete
        // UPDATED: Replaced router.replace with window.location.href
        window.location.href = "/onboarding";
      }
    });

    return () => unsubscribe();
  }, []); // UPDATED: Removed router from dependency array

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  if (isOnboarded) {
    return <>{children}</>;
  }

  return null; // Render nothing while redirecting
}


// --- 3. Sidebar Component (Inlined) ---
function Sidebar() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
    <aside className="fixed left-0 top-0 h-full w-48 bg-[#5DE4DA] flex flex-col justify-between rounded-r-3xl shadow-lg z-10">
      <div className="pt-8 text-center"><h1 className="text-xl font-bold text-black">Shuubox</h1></div>
      <nav className="flex flex-col items-center space-y-6 mt-8 text-black text-base">
        {navItems.map((item) => (
          <a key={item.name} href={item.href} className="hover:font-semibold transition-all">{item.name}</a>
        ))}
      </nav>
      <button onClick={handleSignOut} className="mb-8 text-black hover:font-semibold transition-all">Log Out</button>
    </aside>
  );
}

// --- 4. useUser Hooks ---
function useUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);
  return user;
}

type UserList = { id: string; title: string; icon?: string; };
function useUserLists(userId: string | undefined) {
  const [lists, setLists] = useState<UserList[]>([]);
  useEffect(() => {
    if (!userId) { setLists([]); return; }
    const listsColRef = collection(db, "users", userId, "lists");
    const unsubscribe = onSnapshot(listsColRef, (snapshot) => {
      const userLists = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || "Untitled List",
        icon: doc.data().icon || "default",
      }));
      setLists(userLists);
    });
    return () => unsubscribe();
  }, [userId]);
  return lists;
}

// --- 5. List Components (Icons & Cards) ---
const IconHeart = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>);
const IconSparkle = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-6.857 2.143L12 21l-2.143-6.857L3 12l6.857-2.143L12 3z"></path></svg>);
const IconMusic = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"></path></svg>);
const IconPlus = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>);
const IconList = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>);

type ListCardProps = { title: string; href: string; icon: React.ReactNode; };
function ListCard({ title, href, icon }: ListCardProps) {
  return (<a href={href} className="flex items-center justify-between w-full h-24 p-6 bg-white border-2 border-black rounded-3xl shadow-md transition-all hover:shadow-lg"><div className="flex items-center space-x-4">{icon}<span className="text-xl font-medium">{title}</span></div></a>);
}
function CreateNewCard({ href }: { href: string }) {
  return (<a href={href} className="flex items-center w-full h-24 p-6 bg-white border-2 border-black rounded-3xl shadow-md transition-all hover:shadow-lg"><div className="flex items-center space-x-4"><IconPlus /><span className="text-xl font-medium">Create New</span></div></a>);
}

// --- 6. Main Dashboard Page Component ---
export default function DashboardPage() {
  const user = useUser();
  const userLists = useUserLists(user?.uid);
  const getIconForList = (iconName: string | undefined) => {
    switch (iconName) {
      case "heart": return <IconHeart />;
      case "sparkle": return <IconSparkle />;
      case "music": return <IconMusic />;
      default: return <IconList />;
    }
  };

  return (
    // UPDATED: Added OnboardingGate
    <AuthGate>
      <OnboardingGate>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          
          <main className="flex-1 bg-white pt-10 pb-12 px-16 ml-48">
            {/* Header section */}
            <header className="flex justify-between items-center mb-12">
              <div className="flex items-center space-x-4">
                <img src={"ShuubotIcon.svg"} alt="Shuubot" className="w-12 h-12" onError={(e) => (e.currentTarget.src = "https://placehold.co/48x48?text=S")} />
                <h3 className="text-3xl font-bold">
                  {user?.displayName || "User"}'s Lists
                </h3>
              </div>
              <div className="flex items-center space-x-5">
                <button title="Add Friend"><svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></button>
                <button title="Notifications"><svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg></button>
              </div>
            </header>

            {/* List Section */}
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-1 gap-5">
                {userLists.map((list) => (
                  <ListCard
                    key={list.id}
                    title={list.title}
                    href={`/lists/${list.id}`}
                    icon={getIconForList(list.icon)}
                  />
                ))}
                <CreateNewCard href="/create-list" />
              </div>
            </div>
          </main>
        </div>
      </OnboardingGate>
    </AuthGate>
  );
}

