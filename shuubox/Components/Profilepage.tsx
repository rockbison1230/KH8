import React, { }from 'react'
import Image from "/Images/PFPplaceholder.jpg";
const Profilepage = () => {
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

    function ListCard({ title }: { title: string }) {
      
  return (
    <div className="bg-gray-200 rounded-2xl h-78 w-65 flex items-end justify-center p-4 m-5">
      <span className="font-semibold">{title}</span>
    </div>
  );
}

   function ListBadge({ title }: { title: string }) {
  return (
    <div>
    <div className="bg-gray-200 rounded-full h-40 w-40 flex items-end justify-center p-4">
    </div>
    <span className="font-semibold">{title}</span>
    </div>
  );
}

    

  return (
    <div className='w-[80%] mx-auto, py-8 px-4'>
        <div className='flex  items-center gap-x-5 m-6'>
        <img className= 'w-35 h-35 rounded-full border-4 ' src="/Images/PFPplaceholder.png" alt={data.username} />
        <p className='text-[60px] font-semibold'>{data.username}</p>
        <button type='button' className='border-2 rounded-3xl w-25 size-12 text-[20px}'>Add friend</button>
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
        
        <div className="grid grid-cols-8  p-3"/>    
        <ListBadge title= '1st addition'/>
        </div>


    </div>

  )
}


export default Profilepage