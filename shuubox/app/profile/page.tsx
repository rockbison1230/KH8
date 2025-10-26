"use client"
import Profilepage from "@/Components/PageBodies/Profilepage";
import Sidebars from "@/Components/Sidebara"

export default function Home() {
  return (
    <div >
      <main className="flex min-h-screen" >
        <Sidebars/>
        <Profilepage/>
        
        
      </main>
      
    </div>
  );
}
