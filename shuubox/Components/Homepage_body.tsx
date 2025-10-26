// Components/Homepage_body.tsx
import React from 'react';
import Link from 'next/link';

// import ShuubotIcon from '@/Icons/shuubot.svg'; 

const Homepage_body = () => {
  return (
    <div className='flex flex-col items-center min-h-screen bg-[#FFFAFA]'> 
      <section className='w-full py-20 px-4 md:py-32 bg-[#FFFAFA] text-center'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-[#000000] leading-tight'>
            All your media in one place
          </h1>
          <p className='text-lg md:text-xl text-gray-700 mt-6 max-w-2xl mx-auto'>
            Shuubox lets you track everything you want to watch, read, and play:
            all in one clean, simple dashboard. No more juggling 5 apps or scrolling
            through the notes app!
          </p>
        </div>
      </section>

      {/* Section 2: "Connect With Friends" */}
      <section className='w-full py-20 px-4 md:py-32 bg-[#5DE4DA]'>
        {/* CHANGE 1: Reduced gap from gap-12 to gap-8 */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center'> 
          {/* Text Content */}
          <div className='text-[#000000] md:pr-8'>
            <h2 className='text-4xl md:text-5xl font-extrabold leading-tight'>
              Connect With Friends
            </h2>
            <p className='text-lg md:text-xl mt-6'>
              Share your lists, see what your friends are into, and celebrate
              every "finished" moment together. Shuubox makes it easy to swap
              recommendations, compare progress, and cheer each other
              on — because finishing a show feels better when someone else
              gets it.
            </p>
          </div>
          {/* Image/Icon */}
          <div className='flex justify-center md:justify-end'>
            {/* CHANGE 2: Made image bigger (w-48 to w-72) */}
            <img 
              src="/diversity_3_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" 
              alt="Connect with friends icon"
              className="w-72 h-auto" // <-- Was w-48
            />
          </div>
        </div>
      </section>

      <section className='w-full py-20 px-4 md:py-32 bg-[#FFFAFA]'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-[#000000] text-center leading-tight'>
            Meet Shuubot
          </h2>
          <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
           <div className='flex justify-center md:justify-start'>
            <div >
              
         
              <img
                src="/ShuubotIcon.svg" // This path works because it's in the 'public' folder
                alt="Shuubot mascot"
                className="w-40 h-40" // Adjusted size to fit the circle
              />

            </div>
          </div>
            <div className='text-[#000000] md:pl-12'>
              <p className='text-lg md:text-xl'>
                Meet Shuubot — your friendly companion on Discord! Track your
                stats, check off items, and show off your completion streaks
                right from your server. 
              </p>
            </div>
          </div>
          <div className='text-center mt-20'>
            <Link 
              href="https://discord.com/oauth2/authorize?client_id=1431510586751062058" 
              className='inline-block bg-[#C3FFAF] text-[#000000] font-semibold py-4 px-12 rounded-full text-lg shadow-md hover:bg-opacity-90 transition-all'
            >
              Get Shuubot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage_body;