
import React, { useState } from 'react'
import Image from "/Images/PFPplaceholder.jpg";




const Profilepage = () => {
  const [friendStatus, setFriendStatus] = useState('add');
    const data = {
        Uid:1,
        username:'Bob',
        bio:'Test',
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
    let buttonText = 'Add friend';
    let buttonClasses = 'border-5 rounded-4xl size-15 hover:bg-gray-200 hover:text hover:border-black-5 w-20'; // default Add friend style

    if (friendStatus === 'pending') {
        buttonText = 'Request Pending';
        buttonClasses = 'border-black-5 bg-black text-white rounded-2xl size-15 rounded-4xl w-20'; // Pending style
    } else if (friendStatus === 'friends') {
        buttonText = 'Friends';
        buttonClasses = 'border-black-5 bg-black text-white rounded-2xl size-15 rounded-4xl w-20'; // Friends style
    }


    function ListCard({ title }: { title: string }) {
      
  return (
    <div className="bg-gray-200 rounded-2xl h-78 w-65 flex items-end justify-center p-4 m-5">
      <span className="font-semibold">{title}</span>
    </div>
  );
}

   function ListBadge({ title }: { title: string }) {
  return (
    <div className='inline-block align-middle'>
    <div className="bg-gray-200 rounded-full h-40 w-40 flex items-end justify-center p-5">
    </div>
    <span className="  font-semibold text-center p-8">{title}</span>
    </div>
  );
}

    

  return (
    <div className='w-[80%] mx-auto, py-8 px-4'>
        <div className='flex  items-center gap-x-5 m-6'>
        <img className= 'w-35 h-35 rounded-full border-4 ' src="/Images/PFPplaceholder.png" alt={data.username} />
        <p className='text-[60px] font-semibold'>{data.username}</p>

<button 
    type='button' 
    onClick={handleFriendAction} // Attached the handler
    className={`... ${buttonClasses}`} // Applied dynamic classes
>{buttonText} {/* Displayed dynamic text */}</button>
        <img className='size-10' src="/Images/Copyicon.png" alt="" />
        </div>
        <div className='m-6 mb-3 w-[33%]'>
        <p className='text-[25px]'>{data.bio}</p>
        </div>


        <div className='bg-[#FFEBFF] rounded-4xl border-4'>
        <h1 className='text-[50px] font-semibold m-6 mb-1 '>Lists</h1>
        <div className="grid grid-cols-4  ">
        <ListCard title='Books'/>
        <ListCard title='Anime'/>
        <ListCard title='Movies'/>
        <ListCard title='Games'/>
        <ListCard title='Movies'/>
        <ListCard title='Games'/>
            
            </div>
        </div>
        
        <div className='bg-[#C3FFAF] rounded-4xl border-4 mt-6'>
        <h1 className='text-[50px] font-semibold mb-6 p-1'> Achivements</h1>
        
        <div className="grid grid-cols-8  p-3 "/>    
        <ListBadge title= '1st addition'/>
        </div>


    </div>

  )
}


export default Profilepage