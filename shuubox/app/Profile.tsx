import Image from "next/image";
import Headers from "@/Components/Headers";
import Homepage_body from "@/Components/Homepage_body";
import Footer from "@/Components/Footer";
import Sidebar from "@/Components/Sidebar"
import Profilepage from "@/Components/Profilepage";

export default function Home() {
  return (
    <div >
      <main >
        <Sidebar/>
        <Profilepage/>
        
        
      </main>
      
    </div>
  );
}
