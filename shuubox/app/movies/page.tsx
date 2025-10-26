"use client";

import Sidebar from "@/Components/sidebar";
import AppHeader from "@/Components/AppHeader"; // Added consistent header
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Movie = {
  title: string;
  image?: string;
  tmdbId: number;
};

type StateMovie = {
  id: number;
  title: string;
  image: string; // required for rendering
};

function CreateNewCard({
  onAddMovie,
}: {
  onAddMovie: (movie: Movie) => void;
}) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // Removed unused state: showSearchBar

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const res = await fetch(
        // NOTE: TMDB API KEY must be correctly set in your Vercel env variables
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
    try {
      // NOTE: You would typically link this to a specific list ID, 
      // but for now, it goes to a general 'movies' collection.
      await addDoc(collection(db, "movies"), {
        title: movie.title,
        image: movie.image || null,
        tmdbId: movie.tmdbId,
        createdAt: new Date(),
      });

      onAddMovie(movie); // update UI immediately
      setShowSearch(false);
      setSearchResults([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding movie: ", error);
    }
  };

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

      {/* SEARCH MODAL */}
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
  const [movies, setMovies] = useState<StateMovie[]>([
    {
      id: 1,
      title: "Inception",
      image: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg",
    },
    {
      id: 2,
      title: "Interstellar",
      image: "https://m.media-amazon.com/images/I/71nK0iPgZtL._AC_SY679_.jpg",
    },
    {
      id: 3,
      title: "The Dark Knight",
      image: "https://m.media-amazon.com/images/I/51k0qa6qHPL._AC_SY679_.jpg",
    },
    {
      id: 4,
      title: "Dune: Part Two",
      image: "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_SY679_.jpg",
    },
  ]);

  // Convert Movie -> StateMovie to satisfy the list type
  const addMovie = (m: Movie) => {
    setMovies((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: m.title,
        image: m.image ?? "/placeholder.png", // Use a placeholder if image is missing
      },
    ]);
  };

  return (
    <div className="flex min-h-screen bg-[#FFFAFA]">
      <Sidebar />
      <main className="flex-1 p-10">
        <AppHeader /> {/* Moved AppHeader to be outside the main flex area for full width */}
        
        <div className="mt-20"> {/* Add margin to push content below the fixed header */}
          {/* Header */}
          <header className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800">Movies List</h2>
            <div className="flex items-center space-x-4">
              {/* This needs to be a clickable link to /create-list */}
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
            <CreateNewCard onAddMovie={addMovie} />
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
          </div>
        </div>
      </main>
    </div>
  );
}
