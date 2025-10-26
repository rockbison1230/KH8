"use client"

import { useState } from "react";
import Sidebar from "@/components/sidebar";

type Book = {
  title: string;
  author?: string;
  image?: string;
  openLibraryId?: string;
};

function CreateNewCard({ onAddBook }: { onAddBook: (book: Book) => void }) {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();

      setSearchResults(
        data.docs.slice(0, 10).map((book: any) => ({
          title: book.title,
          author: book.author_name ? book.author_name[0] : "Unknown Author",
          image: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : undefined,
          openLibraryId: book.key,
        }))
      );
    } catch (error) {
      console.error("Error fetching books: ", error);
    }

    setShowSearch(true);
    setShowSearchBar(false);
  };

  return (
    <div>
        {/* CREATE NEW CARD */}
        <div 
            onClick={() => setShowSearchBar(true)}
            className="bg-white w-40 h-50 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4 shadow hover:shadow-lg transition overflow-hidden">
            <span className="text-4xl font-light">+</span>
            <span className="font-semibold">Create New</span>
        </div>

    {/* <div className="bg-gray-200 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4"> */}
        
      {showSearchBar ? (
        <>
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
            placeholder="Search for a book..."
            className="flex-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="w-full bg-blue-600 rounded-md mt-4 text-white py-2 hover:bg-blue-700 transition"
          >
            Search
          </button>
        </>
      ) : null}

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
                        {searchResults.map((book) => (
                            <div
                                key={book.tmdbId}
                                className="flex items-center gap-2 p-2"
                                onClick={() => handleAddBook(book)}
                                >
                            {book.image && (
                                <img
                                src={book.image}
                                alt={book.title}
                                className="w-12 h-16 object-cover"
                                />
                            )}
                            <span>{book.title}</span>
                            </div>
                        ))}
                    </div>
            </div>
                
        </div>
      )}
    </div>
    // </div>
  );
}


export default function MoviesPage() {
  // Example static data (later you could fetch this from Firebase, a database, etc.)
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Dune: Part Two",
      image: "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_SY679_.jpg",
    },
  ]);

   // Function to add a new movie card
  const addBook = (newBook) => {
    setBooks((prevBooks) => [
      ...prevBooks,
      { id: Date.now(), ...newBook },
    ]);
  };


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">

      {/* Header */}
        <header className="flex justify-between items-center mb-10">
        <h2 className="text-3xl text-gray-400">Books</h2>
        <div className="flex items-center space-x-4">
            <span className="w-10 h-10 bg-gray-300 rounded-full"></span>
            <h3 className="text-2xl">
            Your favorite books.
            </h3>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </header>

      {/* Grid of book cards */}
      <div className="grid grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white w-40 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-40 h-60 object-cover"
            />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{book.title}</h2>
            </div>
          </div>
        ))}
        <CreateNewCard onAddBook={addBook}/>
      </div>
    </main>
    </div>
  );
}
