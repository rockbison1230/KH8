// import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Sidebar component (internal to this file)
export default function Sidebar() {
//   const router = useRouter();
  const handleSignOut = async () => {
    await signOut(auth);
  };

  const navItems = ["Home", "Profile", "Friends", "Stats", "Discord"];
  
  return (
    <aside className="w-64 bg-gray-100 p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-8">Shuubox</h1>
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <a
            key={item}
            href="/dashboard"
            className="flex items-center space-x-3 text-gray-700 hover:text-black"
          >
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            <span>{item}</span>
          </a>
        ))}
      </nav>
      <div className="flex-grow"></div>
      <a
        href="#"
        // onClick={handleSignOut}
        className="flex items-center space-x-3 text-gray-700 hover:text-black"
      >
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
        <span>Log Out</span>
      </a>
    </aside>
  );
}