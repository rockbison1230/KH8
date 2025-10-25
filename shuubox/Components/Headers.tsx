import React from 'react'
import Shuubox from '@/Icons/shuubox.svg'

function Headers() {
  return (
   
    <div className='w-full'>
      <div className='flex justify-between items-center p-4'>
        <img src= '@/Icons/shuubox.svg'
         alt='logo'/>
      <ul className='flex space-x-4'>
          <li><button type='button' className='text-white
          bg-[#7E7E7E]
        rounded-2xl
        p-1.5
        px-8'
        > Login </button></li>
        <li><button type='button' className='text-white
        bg-[#7E7E7E]
        rounded-2xl
        p-1.5
        px-6'
        > Sign Up </button></li>
      </ul>
      </div>
      
    </div>
  )
}

export default Headers