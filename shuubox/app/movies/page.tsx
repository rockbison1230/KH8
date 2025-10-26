// app/movies/page.jsx
"use client"
import Sidebar from "@/Components/sidebar";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


type Movie = {
  title: string;
  image?: string;
  tmdbId: number;
};

function CreateNewCard( { onAddMovie }: { onAddMovie: (movie: Movie) => void }) {
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(true);

    const handleSearch = async () => {
    if (!searchTerm) return; 

    try { const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
        searchTerm
      )}`
    );
    const data = await res.json();

    setSearchResults(
      data.results.map((movie: any) => ({
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
    setShowSearchBar(false);
  };

    const handleAddMovie = async (movie: Movie) => {
        try {
            const docRef = await addDoc(collection(db, "movies"), {
            title: movie.title,
            image: movie.image || null,
            tmdbId: movie.tmdbId,
            createdAt: new Date(),
            });

            onAddMovie({ ...movie}); // update UI immediately
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
            className="bg-gray-200 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4">
            <span className="text-4xl font-light">+</span>
            <span className="font-semibold">Create New</span>
        </div>

        {/* SEARCH FOR MOVIE */}
        {showSearch && (
            <div className="flex fixed top-0 left-0 right-0 bottom-0 bg-black/40 inset=0 background-blur-sm flex items-center justify-center">
                <div
                    className="bg-white p-6 rounded-xl w-200 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold mb-4">Search Movies</h2>
                        <button
                            type='button'
                            className="mt-4"
                            onClick={() => setShowSearch(false)}
                        >
                        x
                        </button>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="">
                        <div className="flex flex-col w-full gap-2">
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
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onChange={(e) => setShowSearchBar(false)}
                                onClick={handleSearch}
                                className="w-full bg-blue-600 rounded-md text-white py-2"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* RESULTS */}
                    <div className="space-y-2 max-h-64 ">
                        {searchResults.map((movie) => (
                            <div
                                key={movie.tmdbId}
                                className="flex items-center gap-2 p-2"
                                onClick={() => handleAddMovie(movie)}
                                >
                            {movie.image && (
                                <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-12 h-16 object-cover"
                                />
                            )}
                            <span>{movie.title}</span>
                            </div>
                        ))}
                    </div>
            </div>
                
        </div>
        )}
    </div>
  );
}

export default function MoviesPage() {
  // Example static data (later you could fetch this from Firebase, a database, etc.)
  const [movies, setMovies] = useState([
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

   // Function to add a new movie card
  const addMovie = (newMovie) => {
    setMovies((prevMovies) => [
      ...prevMovies,
      { id: Date.now(), ...newMovie },
    ]);
  };


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">

      {/* Header */}
        <header className="flex justify-between items-center mb-10">
        <h2 className="text-3xl text-gray-400">Movies</h2>
        <div className="flex items-center space-x-4">
            <span className="w-10 h-10 bg-gray-300 rounded-full"></span>
            <h3 className="text-2xl">
            Your favorite films.
            </h3>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </header>

      {/* Grid of movie cards */}
      <div className="grid grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white w-40 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-40 h-60 object-cover"
            />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
            </div>
          </div>
        ))}
        <CreateNewCard onAddMovie={addMovie}/>
      </div>
    </main>
    </div>
  );
}
