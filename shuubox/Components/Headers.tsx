// Components/Headers.tsx
import React from 'react';
import Link from 'next/link';

// import ShuuboxLogo from '@/Icons/shuubox.svg';

export default function Headers() {
  return (
    <header className="w-full bg-[#FFFAFA]">
      {/* This <nav> is now full-width. The p-6 provides the margin from the screen edge. */}
      <nav className="flex justify-between items-center p-6">
        {/* Logo */}
        <Link href="/">
          <div className="text-4xl font-extrabold text-[#231F20]">
            Shuubox
          </div>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="flex items-center justify-center font-semibold text-lg text-black bg-[#FFEBFF] border-2 border-black rounded-full py-3 px-10 transition-all hover:shadow-md hover:scale-105"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="flex items-center justify-center font-semibold text-lg text-black bg-[#5DE4DA] border-2 border-black rounded-full py-3 px-10 transition-all hover:shadow-md hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}