"use client";

import Link from "next/link";
import React from "react";

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#FFFAFA]">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        {/* Brand at left, just like in Figma */}
        <Link href="/" className="select-none">
          <span className="text-2xl font-extrabold tracking-tight text-[#231F20]">
            Shuubox
          </span>
        </Link>

        {/* Tiny profile spot at right so the bar feels balanced */}
        <Link href="/profile" aria-label="Profile">
          <img
            src="/nakieLogo.svg"
            alt="Shuubot mascot"
            className="h-8 w-8"
          />
        </Link>
      </nav>

      {/* Hairline divider for a crisp seam between header and content */}
      <div className="h-px w-full bg-black/10" />
    </header>
  );
}
