"use client"

import React, { useState } from 'react'
import Image from "/Images/PFPplaceholder.jpg";
import Sidebar from '@/Components/sidebar';




const Profilepage = () => {
  const [friendStatus, setFriendStatus] = useState('add');
    const data = {
        Uid:1,
        username:'Bob',
        bio:'Reader of books',
        lists:[
            {Lid: 101, listname:'Anime', itemimg:''  },
            {Lid: 102, listname:'Movies', itemimg:''  },
            {Lid: 103, listname:'Comics', itemimg:''  },
            {Lid: 104, listname:'Books', itemimg:''  }
        ],
        Achievements:[
            {id: 120, badgename:'1st addition', badgeimg:''}
            
        ]
    }


    const handleFriendAction = () => {
        if (friendStatus === 'add') {
            // This is where you would typically:
            // 1. Make an API call to send a friend request.
            // 2. On success, update the local state.
            console.log(`Sending friend request to ${data.username}...`);
            setFriendStatus('pending');
        } else if (friendStatus === 'pending') {
            // Action to cancel the request
            console.log(`Cancelling friend request to ${data.username}...`);
            setFriendStatus('add');
        } else if (friendStatus === 'friends') {
            // Action to unfriend/block
            console.log(`Unfriending ${data.username}...`);
            // setFriendStatus('add'); // Maybe revert to 'add' or show a confirmation modal
        }
    };

    // --- Helper for Button Content & Styling ---
    // 4. Determine the button text and styles based on the current state.
    // let buttonText = 'Add friend';
    // let buttonClasses = 'border-5 rounded-4xl size-15 hover:bg-gray-200 hover:text hover:border-black-5 w-20'; // default Add friend style

    // if (friendStatus === 'pending') {
    //     buttonText = 'Request Pending';
    //     buttonClasses = 'border-black-5 bg-black text-white rounded-2xl size-15 rounded-4xl w-20'; // Pending style
    // } else if (friendStatus === 'friends') {
    //     buttonText = 'Friends';
    //     buttonClasses = 'border-black-5 bg-black text-white rounded-2xl size-15 rounded-4xl w-20'; // Friends style
    // }


    function ListCard({ title }: { title: string }) {
      
  return (
      <div className="bg-white border-2 border-black rounded-4xl h-40 w-40 flex items-center justify-center m-4 transition-transform duration-200 hover:scale-105 hover:bg-gray-100 cursor-pointer">
        <span className="font-semibold text-lg">{title}</span>
    </div>
  );
}

   function ListBadge({ title }: { title: string }) {
  return (
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-white border-2 rounded-full h-24 w-24 flex items-center justify-center hover:scale-105 hover:bg-gray-100" >
            <img src={"star.svg"} alt="Shuubot" className="w-12 h-12" />
        </div>
        <span className="font-semibold text-center text-sm">{title}</span>

      </div>
  );
}

    

  return (
    <div className="flex w-200 mx-auto py-8 px-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-8">
        {/* Header */}
        <div className="flex items-center gap-x-5 mb-6">
            <div className="flex items-center gap-x-5 mb-6">
                <img src={"ShuubotIcon.svg"} alt="Shuubot" className="w-12 h-12" />
                <p className="text-4xl font-semibold">{data.username}</p>
                <img className="w-10 h-10" src={"friend.svg"} alt="Copy" />
            </div>

          <button
            type="button"
            
            onClick={handleFriendAction}
            // className={buttonClasses}
          >
            {/* {buttonText} */}
          </button>

        </div>

        {/* Bio */}
        <div className="mb-8 w-[50%]">
          <p className="text-lg text-gray-800">{data.bio}</p>
        </div>

        {/* Lists Section */}
        <div className="bg-white rounded-3xl border-4 p-6 mb-8">
          <h1 className="text-3xl font-semibold mb-6">Lists</h1>
          <div className="flex flex-wrap justify-center">
            <ListCard title="Books" />
            <ListCard title="Anime" />
            <ListCard title="Movies" />
            <ListCard title="Games" />
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-[#C3FFAF] rounded-3xl border-4 p-6 ">
          <h1 className="text-3xl font-semibold mb-6">Achievements</h1>
          <div className="flex justify-center gap-8 flex-wrap">
            <ListBadge title="" />
          </div>
        </div>
      </div>
    </div>
  );
}


export default Profilepage