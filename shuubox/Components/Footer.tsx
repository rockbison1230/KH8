import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">

      <div className="flex justify-between items-center p-6">
        
        <Link href="/">
          <div className="text-3xl font-extrabold">
            Shuubox
          </div>
        </Link>

        <div className="text-lg">
          Built with ♡ at KnightHacks 2025
        </div>

      </div>
    </footer>
  );
}