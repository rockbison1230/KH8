// app/movies/page.jsx
import Sidebar from "@/components/sidebar";

export default function MoviesPage() {
  // Example static data (later you could fetch this from Firebase, a database, etc.)
  const movies = [
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
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">

      {/* Header */}
      {/* <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl text-gray-400">Movies</h1>
            <div className="text-gray-600 text-lg">
            Your favorite films.
            </div>
      </header> */}

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
      </div>
    </main>
    </div>
  );
}
