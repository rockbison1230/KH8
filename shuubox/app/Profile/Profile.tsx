import Image from "next/image";
import Headers from "@/Components/Headers";
import Homepage_body from "@/Components/Homepage_body";
import Footer from "@/Components/Footer";
import Profilepage from "@/Components/Profilepage";
import Sidebars from "@/components/sidebara";

export default function Home() {
  return (
    <div >
      <main >
        <Sidebars/>
        <Profilepage/>
        
        
      </main>
      
    </div>
  );
}
