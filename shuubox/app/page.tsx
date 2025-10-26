// app/page.tsx
"use client"; // Good for a landing page with interactive links/buttons

export default function Home() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">Shuubox</div>
        <div className="flex space-x-4">
          <Link href="/login">
            <button className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
