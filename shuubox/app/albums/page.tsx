// app/albums/page.jsx
"use client"
import Sidebar from "@/Components/sidebar";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AlbumsPage() {
  // Example static data
  const albums = [
    {
      id: 1,
      title: "Rumours",
      artist: "Fleetwood Mac",
      image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
    },
    {
      id: 2,
      title: "To Pimp a Butterfly",
      artist: "Kendrick Lamar",
      image: "https://upload.wikimedia.org/wikipedia/en/9/9e/To_Pimp_a_Butterfly_cover.png",
    },
    {
      id: 3,
      title: "Melodrama",
      artist: "Lorde",
      image: "https://upload.wikimedia.org/wikipedia/en/b/b2/Lorde_-_Melodrama.png",
    },
    {
      id: 4,
      title: "Random Access Memories",
      artist: "Daft Punk",
      image: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
    },
  ];

  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10 bg-white">
        {/* Header */}
            <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl text-gray-400">Albums</h2>
            <div className="flex items-center space-x-4">
                <span className="w-10 h-10 bg-gray-300 rounded-full"></span>
                <h3 className="text-2xl">
                Your favorite music albums.
                </h3>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </header>

        {/* Grid of albums */}
        <div className="grid grid-cols-4 gap-6">
            {albums.map((album) => (
            <div
                key={album.id}
                className="bg-white w-40 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
                <img
                src={album.image}
                alt={album.title}
                className="w-40 h-60 object-cover"
                />
                <div className="p-3">
                <h2 className="text-lg font-semibold">{album.title}</h2>
                <p className="text-gray-500 text-sm">{album.artist}</p>
                </div>
            </div>
            ))}
            {/* <CreateNewCard onAddMovie={addMovie}/> */}
        </div>
        </main>
    </div>
  );
}
