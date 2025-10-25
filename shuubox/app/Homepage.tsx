import Image from "next/image";
import Headers from "@/Components/Headers";
import Homepage_body from "@/Components/Homepage_body";
import Footer from "@/Components/Footer";


export default function Home() {
  return (
    <div items-center justify-between >
      <main >
        <Headers/>
        <Homepage_body/>
      <Footer/>
        
        
      </main>
      
    </div>
  );
}
