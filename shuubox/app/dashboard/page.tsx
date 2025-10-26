"use client";

import React, { ReactNode, useEffect, useState } from "react";
// NOTE: We are NOT importing useSearchParams or useRouter, to avoid build errors.

// --- Firebase & Auth (Inlined) ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrghhV1y1MDJJFpO5Wph6IBppf_yrQyro",
  authDomain: "shuubox-cba9b.firebaseapp.com",
  projectId: "shuubox-cba9b",
  appId: "1:47728561275:web:a071c0d0153074a244e6de",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ----------------------------------------------------
// --- 1. Gates and Helpers ---
// ----------------------------------------------------

function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "/login";
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return <>{children}</>;
}

function OnboardingGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().hasCompletedOnboarding) {
        setIsOnboarded(true);
      } else {
        window.location.href = "/onboarding";
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  if (isOnboarded) return <>{children}</>;
  return null;
}

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);
  return user;
}

function useURLQueryParam(paramName: string): string | null {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(paramName));
    }
  }, [paramName]);
  return value;
}

// ----------------------------------------------------
// --- 3. Sidebar and List Hooks ---
// ----------------------------------------------------

function Sidebar() {
  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };
  const navItems = [
    { name: "Home", href: "/dashboard" }, { name: "Friends", href: "/friends" },
    { name: "Stats", href: "/stats" }, { name: "Profile", href: "/profile" },
    { name: "Edit", href: "/edit" },
  ];
  return (
    <aside className="fixed left-0 top-0 h-full w-48 bg-[#5DE4DA] flex flex-col justify-between rounded-r-3xl shadow-lg z-10">
      <div className="pt-8 text-center"><h1 className="text-xl font-bold text-black">Shuubox</h1></div>
      <nav className="flex flex-col items-center space-y-6 mt-8 text-black text-base">
        {navItems.map((item) => <a key={item.name} href={item.href} className="hover:font-semibold transition-all">{item.name}</a>)}
      </nav>
      <button onClick={handleSignOut} className="mb-8 text-black hover:font-semibold transition-all">Log Out</button>
    </aside>
  );
}

type UserList = { id: string; title: string; icon?: string; };
function useUserLists(userId: string | undefined) {
  const [lists, setLists] = useState<UserList[]>([]);
  useEffect(() => {
    if (!userId) return;
    const listsColRef = collection(db, "users", userId, "lists");
    const unsubscribe = onSnapshot(listsColRef, (snapshot) => {
      setLists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserList)));
    });
    return () => unsubscribe();
  }, [userId]);
  return lists;
}

function useOwnedMediaIds(userId: string | undefined, userLists: UserList[]) {
    const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!userId || userLists.length === 0) {
            setOwnedIds(new Set());
            return;
        }

        const fetchOwnedItems = async () => {
            const owned = new Set<number>();
            
            const fetchPromises = userLists.map(list => {
                const itemsColRef = collection(db, "users", userId, "lists", list.id, "items");
                return getDocs(itemsColRef);
            });
            
            const snapshots = await Promise.all(fetchPromises);
            
            snapshots.forEach(snapshot => {
                snapshot.docs.forEach(doc => {
                    const tmdbId = doc.data().tmdbId;
                    if (typeof tmdbId === 'number') {
                        owned.add(tmdbId);
                    }
                });
            });

            setOwnedIds(owned);
        };

        fetchOwnedItems();
    }, [userId, userLists]); 

    return ownedIds;
}

// ----------------------------------------------------
// --- 4. List Components and Modal ---
// ----------------------------------------------------

const IconHeart = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>);
const IconSparkle = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-6.857 2.143L12 21l-2.143-6.857L3 12l6.857-2.143L12 3z"></path></svg>);
const IconMusic = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-1-3-2 1.3-2 3-2 3 1 3 2zm12-12c0 1.1-1.3 2-3 2s-3-1-3-2 1.3-2 3-2 3 1 3 2z"></path></svg>);
const IconPlus = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v16m8-8H4"></path></svg>);
const IconList = () => (<svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>);

function ListCard({ title, href, icon }: { title: string; href: string; icon: React.ReactNode; }) {
  return (<a href={href} className="flex items-center justify-between w-full h-24 p-6 bg-white border-2 border-black rounded-3xl shadow-md transition-all hover:shadow-lg"><div className="flex items-center space-x-4">{icon}<span className="text-xl font-medium">{title}</span></div></a>);
}
function CreateNewCard({ href }: { href: string }) {
  return (<a href={href} className="flex items-center w-full h-24 p-6 bg-white border-2 border-black rounded-3xl shadow-md transition-all hover:shadow-lg"><div className="flex items-center space-x-4"><IconPlus /><span className="text-xl font-medium">Create New</span></div></a>);
}

type MediaItem = {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseYear: string;
};
function AddRecommendationModal({ title, user, userLists, ownedMediaIds, onClose }: { 
  title: string, 
  user: User, 
  userLists: UserList[], 
  ownedMediaIds: Set<number>, 
  onClose: () => void 
}) {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Search for the media when the modal opens
  useEffect(() => {
    const searchMedia = async () => {
      setIsLoading(true);
      setError(""); 
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(title)}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Search failed");
        }
        const data = await res.json();
        setSearchResults(data.results);
        if (data.results.length === 0) {
          setError("No movies found for that title.");
        }
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    searchMedia();
  }, [title]);

  // Step 2: Handle the final "Add" button click
  const handleAddItem = async () => {
    if (!selectedMedia || !selectedListId) {
      setError("Please select a movie and a list.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Check if already owned
    if (ownedMediaIds.has(selectedMedia.tmdbId)) {
        setError("This movie is already in one of your lists!");
        setIsLoading(false);
        return;
    }

    try {
      // Write to Firestore: /users/{userId}/lists/{listId}/items
      const itemsColRef = collection(db, "users", user.uid, "lists", selectedListId, "items");
      await addDoc(itemsColRef, {
        tmdbId: selectedMedia.tmdbId,
        title: selectedMedia.title,
        posterPath: selectedMedia.posterPath,
        releaseYear: selectedMedia.releaseYear,
        addedAt: serverTimestamp(),
        addedBy: "recommendation",
      });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add item to list.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Recommendation</h2>
          <button onClick={onClose} className="text-3xl">&times;</button>
        </div>

        {success ? (
          <div className="text-center p-8">
            <span className="text-6xl">🎉</span>
            <h3 className="text-2xl font-semibold mt-4">Added to your list!</h3>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Your friend recommended <strong className="text-black">"{title}"</strong>.
              Which one did they mean?
            </p>

            {/* --- Search Results --- */}
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {isLoading && <p>Searching...</p>}
              {searchResults.map((movie) => {
                const isOwned = ownedMediaIds.has(movie.tmdbId); 
                return (
                  <div
                    key={movie.tmdbId}
                    onClick={() => !isOwned && setSelectedMedia(movie)}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-all ${
                      isOwned 
                        ? "bg-red-50 text-gray-500 line-through cursor-not-allowed" 
                        : selectedMedia?.tmdbId === movie.tmdbId
                        ? "bg-teal-100 border-2 border-teal-400"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <img src={movie.posterPath} alt={movie.title} className="w-12 h-20 rounded object-cover" />
                    <div>
                      <span className="font-semibold">{movie.title}</span>
                      <span className="text-gray-500 text-sm block">{movie.releaseYear}</span>
                    </div>
                    {isOwned && <span className="ml-auto text-sm font-bold text-red-700">OWNED</span>} 
                  </div>
                );
              })}
            </div>

            {/* --- List Selector --- */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="list-select">
                Add to list:
              </label>
              <select
                id="list-select"
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg"
              >
                <option value="" disabled>Select a list</option>
                {userLists.map((list) => (
                  <option key={list.id} value={list.id}>{list.title}</option>
                ))}
              </select>
            </div>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* --- Action Button --- */}
            <button
              onClick={handleAddItem}
              disabled={isLoading || !selectedMedia || !selectedListId}
              className="w-full bg-teal-400 text-black font-bold py-3 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add to List"}
            </button>
          </>
        )}
      </div>
    </div>
    );
    // If href is provided, make the whole card clickable
    return href ? <Link href={href}>{card}</Link> : card;
}

// ----------------------------------------------------
// --- 7. Main Dashboard Page Component ---
// ----------------------------------------------------

export default function DashboardPage() {
  const user = useUser();
  const userLists = useUserLists(user?.uid);
  const ownedMediaIds = useOwnedMediaIds(user?.uid, userLists);
  
  const recommendedTitle = useURLQueryParam("add");
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  useEffect(() => {
    if (recommendedTitle) {
      setModalTitle(recommendedTitle);
    }
  }, [recommendedTitle]);

  const getIconForList = (iconName: string | undefined) => {
    switch (iconName) {
      case "heart": return <IconHeart />;
      case "sparkle": return <IconSparkle />;
      case "music": return <IconMusic />;
      default: return <IconList />;
    }
  };
  
  const closeModal = () => {
    setModalTitle(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/dashboard");
    }
  };

  return (
    <AuthGate>
      <OnboardingGate>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          
          <main className="flex-1 bg-white pt-10 pb-12 px-16 ml-48">
            <header className="flex justify-between items-center mb-12">
              <div className="flex items-center space-x-4">
                <img src={"ShuubotIcon.svg"} alt="Shuubot" className="w-12 h-12" onError={(e) => (e.currentTarget.src = "https://placehold.co/48x48?text=S")} />
                <h3 className="text-3xl font-bold">{user?.displayName || "User"}'s Lists</h3>
              </div>
              <div className="flex items-center space-x-5">
                <button title="Add Friend"><svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></button>
                <button title="Notifications"><svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3C7.7 6.2 6 8.4 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg></button>
              </div>
            </header>

            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-1 gap-5">
                {userLists.map((list) => (
                  <ListCard key={list.id} title={list.title} href={`/lists/${list.id}`} icon={getIconForList(list.icon)} />
                ))}
                <CreateNewCard href="/create-list" />
              </div>
            </div>
          </main>

          {/* NEW: Render the modal if modalTitle is set and user is available */}
          {modalTitle && user && (
            <AddRecommendationModal 
              title={modalTitle} 
              user={user} 
              userLists={userLists} 
              ownedMediaIds={ownedMediaIds} 
              onClose={closeModal} 
            />
          )}
        </div>
      </OnboardingGate>
    </AuthGate>
  );
}