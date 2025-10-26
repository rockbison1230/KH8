// app/create-list/page.tsx
"use client";

import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
// import { useUser } from "@/components/AuthGate"; // Assuming useUser is exported from AuthGate or a similar file

export default function CreateListPage() {
  const router = useRouter();
//   const user = useUser(); // Get the current user
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("default"); // Default icon

  const icons = [
    { name: "Heart", value: "heart" },
    { name: "Music", value: "music" },
    { name: "Animation", value: "animation" },
    { name: "Game", value: "game" },
    { name: "Book", value: "book" },
    { name: "Star", value: "star" },
    { name: "Film", value: "film" },
    { name: "Globe", value: "globe" },
  ];

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a list.");
      router.push("/login");
      return;
    }

    if (!listName.trim()) {
      alert("List name cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "lists"), {
        userId: user.uid,
        name: listName,
        description: listDescription,
        icon: selectedIcon,
        createdAt: new Date(),
      });
      alert("List created successfully!");
      router.push("/dashboard"); // Redirect to dashboard after creation
    } catch (error) {
      console.error("Error creating list: ", error);
      alert("Failed to create list.");
    }
  };

  return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10 bg-white">
          {/* Header section */}
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
              {/* <span className="w-10 h-10 bg-gray-300 rounded-full"></span> */}
              <img src={"Shuubot.svg"} alt="heart icon" className="w-15 h-15" />
              <h3 className="text-3xl font-semibold p-4">  New List</h3>

            </div>
            
          </header>
        </main>
      </div>
  );
}

