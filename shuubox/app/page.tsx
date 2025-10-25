// app/page.tsx
"use client"; // Good for a landing page with interactive links/buttons

import Link from 'next/link';

// A simple header component to hold your nav buttons
function Header() {
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

// A simple section component
function FeatureSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="py-16 px-6 bg-white text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="max-w-2xl mx-auto text-lg text-gray-600">
        {children}
      </p>
    </section>
  );
}

// Your main public landing page
export default function PublicHomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <main className="pt-32 pb-16 text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          All your media, in one place
        </h1>
        <p className="text-xl text-gray-700 max-w-xl mx-auto">
          Track what you watch, read, play, and listen to — all from one
          dashboard.
        </p>
      </main>

      {/* Feature Sections */}
      <div className="bg-gray-100">
        <FeatureSection title="Your media's new home">
          Shuubox is your cozy corner for everything you love — movies,
          games, books, music, TV shows... you name it. No more juggling
          between five different apps or scrolling through a giant wall of
          text on your notes app. Just one clean, happy space to keep it all
          together.
        </FeatureSection>
      </div>

      <FeatureSection title="How it works">
        Add whatever you want to watch, read, or play. Check it off when
        you're done. Watch your list turn from chaos to calm. Bonus: it's
        oddly satisfying.
      </FeatureSection>

      <div className="bg-gray-100">
        <FeatureSection title="Connect With Friends">
          Share your lists, see what your friends are into, and celebrate
          every "finished" moment together. Shuubox makes it easy to
          swap recommendations, compare progress, and cheer each
          other on — because finishing a show feels better when someone
          else gets it.
        </FeatureSection>
      </div>
      
      <FeatureSection title="Meet Shuubot">
        Meet Shuubot — your friendly companion on Discord! Track your
        stats, check off items, and show off your completion streaks right
        from your server.
        <br />
        <button className="mt-6 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
          get shuubot
        </button>
      </FeatureSection>

      {/* Footer */}
      <footer className="text-center p-6 bg-white text-gray-600">
        Shuubox - Built with ❤️ at KnightHacks 2025.
      </footer>
    </div>
  );
}