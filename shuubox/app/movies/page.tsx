"use client";

import Sidebar from "@/Components/sidebar";
import AppHeader from "@/Components/AppHeader";
import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore"; // Added query and where
import { db, auth } from "@/lib/firebase"; // Import auth for userId
import { User } from "firebase/auth"; // Import User type

// Helper function to read URL query parameters
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

// Helper to get current user ID
function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);
  return userId;
}

type Movie = {
  title: string;
  image?: string;
  tmdbId: number;
};

type StateMovie = {
  id: string; // Changed to string for Firestore document ID
  title: string;
  image: string;
  tmdbId: number; // Added tmdbId for consistency
};

// Hook to fetch items from the current list
function useListItems(userId: string | null, listId: string | null): StateMovie[] {
  const [items, setItems] = useState<StateMovie[]>([]);

  useEffect(() => {
    if (!userId || !listId) {
      setItems([]);
      return;
    }

    // Path: users/{userId}/lists/{listId}/items
    const itemsColRef = collection(db, "users", userId, "lists", listId, "items");
    
    // Listen for real-time changes to the items in the specific list
    const unsubscribe = onSnapshot(itemsColRef, (snapshot) => {
      const fetchedItems: StateMovie[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id, // Firestore Document ID
          title: data.title,
          image: data.image || "/placeholder.png",
          tmdbId: data.tmdbId,
        };
      });
      setItems(fetchedItems);
    });

    return () => unsubscribe();
  }, [userId, listId]);

  return items;
}


function CreateNewCard({
  onAddMovie,
  listId,
  userId, // <-- User ID added
}: {
  onAddMovie: (movie: Movie) => void;
  listId: string | null;
  userId: string | null; // <-- User ID required for path
}) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();

      setSearchResults(
        (data?.results ?? []).map((movie: any) => ({
          title: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : undefined,
          tmdbId: movie.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
    setShowSearch(true);
  };

  const handleAddMovie = async (movie: Movie) => {
    if (!listId || !userId) {
        // Use a standard non-alert method to show an error
        console.error("Cannot add movie: List ID or User ID is missing.");
        setShowSearch(false);
        return;
    }

    try {
      // 🚨 FIX: Nest the movie under the specific user list
      const itemsColRef = collection(db, "users", userId, "lists", listId, "items");
      
      const docRef = await addDoc(itemsColRef, {
        title: movie.title,
        image: movie.image || null,
        tmdbId: movie.tmdbId,
        createdAt: new Date(),
      });

      // Update UI immediately (add the doc ID to the temp object)
      onAddMovie({ 
          ...movie,
          // Pass the new Firestore document ID back to the parent list state
          id: docRef.id 
      } as unknown as StateMovie); 
      
      setShowSearch(false);
      setSearchResults([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding movie: ", error);
    }
  };

  if (!listId) {
      // Don't show the card if we don't know which list to add to.
      return <div className="text-gray-500 p-4">Select a list from your dashboard.</div>;
  }

  return (
    <div>
      {/* CREATE NEW CARD */}
      <div
        onClick={() => setShowSearch(true)}
        className="bg-gray-200 rounded-2xl h-60 w-40 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-300 transition"
      >
        <span className="text-4xl font-light">+</span>
        <span className="font-semibold text-center mt-2">Add New Movie</span>
      </div>

      {/* SEARCH MODAL (rest of modal logic remains the same) */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full sm:w-[420px] max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Search Movies</h2>
              <button
                type="button"
                className="text-2xl leading-none"
                onClick={() => setShowSearch(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full flex-col gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Search for a movie..."
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </form>

            {/* RESULTS */}
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto border-t pt-4">
              {searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <button
                    key={movie.tmdbId}
                    className="flex w-full items-center gap-4 rounded-md p-2 text-left hover:bg-gray-100 transition"
                    onClick={() => handleAddMovie(movie)}
                  >
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="h-14 w-10 flex-shrink-0 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-14 w-10 flex-shrink-0 rounded-sm bg-gray-200 text-gray-500 flex items-center justify-center">
                        ?
                      </div>
                    )}
                    <span className="font-medium truncate">{movie.title}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  {searchTerm ? "No results found." : "Start typing to search for a movie."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  // 🚨 FIX: Read the listId from the URL query parameters
  const listId = useURLQueryParam("listId");
  const userId = useUserId(); // Get the current authenticated user's ID
  
  // 🚨 FIX: Fetch the actual movies from the specific list ID
  const fetchedMovies = useListItems(userId, listId);
  
  // State for immediate UI updates (used after adding a new item)
  const [movies, setMovies] = useState<StateMovie[]>([]);

  // Sync the local state with the real-time database data
  useEffect(() => {
      setMovies(fetchedMovies);
  }, [fetchedMovies]);

  // Function called by the search card to update UI immediately
  const addMovie = (m: StateMovie) => {
    // Since the useListItems hook is active, it will soon update fetchedMovies.
    // We update the state optimistically here to make the UI instant.
    setMovies((prev) => [
      ...prev,
      m,
    ]);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFAFA]">
      <Sidebar />
      <main className="flex-1 p-10">
        <AppHeader />
        
        <div className="mt-20">
          {/* Main List Controls and Title */}
          <header className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800">
              {listId ? `List: ${listId.substring(0, 8)}...` : "Select a List"}
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                className="font-semibold text-[#3CB7AE] hover:underline"
                onClick={() => window.location.href = "/create-list"}
              >
                + Create New List
              </button>
            </div>
          </header>

          {/* Grid of movie cards */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            
            {/* 🚨 FIX: Pass the listId and userId down to the CreateNewCard component */}
            <CreateNewCard onAddMovie={addMovie} listId={listId} userId={userId} />
            
            {/* 🚨 FIX: Map over the state that is synced with the database */}
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="w-40 overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
              >
                <img
                  src={movie.image || "/placeholder.png"}
                  alt={movie.title}
                  className="h-60 w-40 object-cover"
                />
                <div className="p-3">
                  <h2 className="line-clamp-2 text-lg font-semibold">
                    {movie.title}
                  </h2>
                </div>
              </div>
            ))}
            
            {movies.length === 0 && listId && (
                <div className="col-span-full p-6 text-center text-gray-500">
                    Your list is empty. Start by clicking "Add New Movie"!
                </div>
            )}
            
            {/* Show message if no list is selected */}
            {!listId && (
                <div className="col-span-full p-6 text-center text-gray-700 font-semibold">
                    Please select a list from your Dashboard to view items.
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
