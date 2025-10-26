// Components/AppHeader.tsx
import React from 'react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="w-full bg-[#FFFAFA]">
      <nav className="flex justify-between items-center p-6">
        
        <Link href="/">
          <div className="text-4xl font-extrabold text-[#231F20]">
            Shuubox
          </div>
        </Link>

        <Link href="/profile"> 
          <img
            src="/nakieLogo.svg" 
            alt="Shuubot mascot"
            className="w-12 h-12"
          />
        </Link>

      </nav>
    </header>
  );
}