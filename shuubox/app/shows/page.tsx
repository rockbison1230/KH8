// app/movies/page.jsx
import Sidebar from "@/components/sidebar";

export default function ShowsPage() {
  // Example static data (later you could fetch this from Firebase, a database, etc.)
  const shows = [
    {
      id: 1,
      title: "Breaking Bad",
      subtitle: "2008–2013",
      image: "https://m.media-amazon.com/images/I/81U+S4ci+VL._AC_SY679_.jpg",
    },
    {
      id: 2,
      title: "Stranger Things",
      subtitle: "2016–present",
      image: "https://m.media-amazon.com/images/I/71g+u8GCRdL._AC_SY679_.jpg",
    },
    {
      id: 3,
      title: "Game of Thrones",
      subtitle: "2011–2019",
      image: "https://m.media-amazon.com/images/I/81cUj2r7JbL._AC_SY679_.jpg",
    },
    {
      id: 4,
      title: "The Last of Us",
      subtitle: "2023–present",
      image: "https://m.media-amazon.com/images/I/71dmhX5ZJdL._AC_SY679_.jpg",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">

      {/* Header */}
        <header className="flex justify-between items-center mb-10">
        <h2 className="text-3xl text-gray-400">Shows</h2>
        <div className="flex items-center space-x-4">
            <span className="w-10 h-10 bg-gray-300 rounded-full"></span>
            <h3 className="text-2xl">
            Your favorite TV shows.
            </h3>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </header>

      {/* Grid of show cards */}
      <div className="grid grid-cols-4 gap-6">
        {shows.map((show) => (
          <div
            key={show.id}
            className="bg-white w-40 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={show.image}
              alt={show.title}
              className="w-40 h-60 object-cover"
            />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{show.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </main>
    </div>
  );
}
