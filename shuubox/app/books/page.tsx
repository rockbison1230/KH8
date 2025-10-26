"use client";

import { useState } from "react";
// Assuming sidebar is at this path, adjust if needed
// import Sidebar from "@/components/sidebar"; 

// --- UPDATED: Placeholder Sidebar ---
// Added a placeholder component to resolve any import errors
function Sidebar() {
  return (
    <div className="w-64 bg-cyan-200 p-6 flex flex-col rounded-r-3xl shadow-lg min-h-screen">
      <h2 className="text-3xl font-bold mb-10">Shuubox</h2>
      <nav className="flex flex-col space-y-4">
        <a href="/dashboard" className="text-xl font-medium hover:underline">Home</a>
        <a href="/friends" className="text-xl font-medium hover:underline">Friends</a>
        <a href="/stats" className="text-xl font-medium hover:underline">Stats</a>
        <a href="/profile" className="text-xl font-medium hover:underline">Profile</a>
        <a href="/edit" className="text-xl font-medium hover:underline">Edit</a>
        <a href="#" className="text-xl font-medium hover:underline text-left">
          Log Out
        </a>
      </nav>
    </div>
  );
}
// ------------------------------------

// --- UPDATED: Moved type to top level ---
type Book = {
  title: string;
  author?: string;
  image?: string;
  openLibraryId?: string;
};

// --- NEW: Defined a type for the book objects in state ---
type BookInState = Book & {
  id: number | string; // The unique ID for React keys
};


// --- CreateNewCard Component ---
function CreateNewCard({ onAddBook }: { onAddBook: (book: Book) => void }) {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          searchTerm
        )}`
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

  // Helper to add book and close modal
  const handleSelectBook = (book: Book) => {
    onAddBook(book);
    setShowSearch(false);
    setSearchTerm(""); // Clear search
  };

  return (
    <div>
      {/* CREATE NEW CARD */}
      <div
        onClick={() => setShowSearchBar(true)}
        className="bg-white w-40 h-50 rounded-2xl h-48 w-40 flex flex-col items-center justify-center p-4 shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
      >
        <span className="text-4xl font-light">+</span>
        <span className="font-semibold">Create New</span>
      </div>

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

      {/* --- Search Modal --- */}
      {showSearch && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search Books</h2>
              <button
                type="button"
                className="text-xl"
                onClick={() => setShowSearch(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="mb-4">
              <div className="flex w-full gap-2">
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
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-600 rounded-md text-white py-2 px-4"
                >
                  Search
                </button>
              </div>
            </form>

            {/* --- RESULTS --- */}
            <div className="space-y-2 overflow-y-auto">
              {searchResults.map((book) => (
                <div
                  key={book.openLibraryId}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectBook(book)}
                >
                  <img
                    src={
                      book.image ||
                      "https://placehold.co/48x64/eee/aaa?text=No+Cover"
                    }
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x64/eee/aaa?text=No+Cover'; }}
                  />
                  <div>
                    <span className="font-semibold">{book.title}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      {book.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- BooksPage Component ---
export default function BooksPage() {
  // --- UPDATED: Use the new BookInState type ---
  const [books, setBooks] = useState<BookInState[]>([
    {
      id: 1,
      title: "Dune: Part Two",
      image: "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_SY679_.jpg",
      author: "Frank Herbert",
      openLibraryId: "OL2631278W",
    },
  ]);

  // --- UPDATED: This function is now type-safe ---
  const addBook = (newBook: Book) => {
    setBooks((prevBooks) => [
      ...prevBooks,
      // Create a new object that matches the BookInState type
      { 
        id: newBook.openLibraryId || Date.now(), // Use OpenLibraryId as the ID, or fallback to Date.now()
        ...newBook 
      },
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
            <h3 className="text-2xl">Your favorite books.</h3>
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </header>

        {/* Grid of book cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book.id} // This now correctly uses the id from BookInState
              className="bg-white w-40 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={
                  book.image ||
                  "https://placehold.co/160x240/eee/aaa?text=No+Cover"
                }
                alt={book.title}
                className="w-40 h-60 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/160x240/eee/aaa?text=No+Cover';
                }}
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold truncate" title={book.title}>{book.title}</h2>
              </div>
            </div>
          ))}
          <CreateNewCard onAddBook={addBook} />
        </div>
      </main>
    </div>
  );
}

