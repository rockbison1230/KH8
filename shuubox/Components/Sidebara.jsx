import React from 'react'

import { BsDiscord,BsPersonFill, BsHouseDoorFill, BsBarChartFill, BsPeopleFill, BsPeaceFill } from "react-icons/bs"

const Sidebars = () => {
  return (
    <div className= 'bg-[#5DE4DA] rounded-2xl w-[20%] h-screen border-4 sticky top-0 ml-[-15]'>
        <img src="/shuubox.svg" alt="" />
        <ul className='text-2xl  pl-5 '>
            <li className=' '><a className='flex items-center gap-x-5 m-4 ' href='/dashboard'><BsHouseDoorFill className='size-10'/>Home</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile'><BsPersonFill className='size-10'/>Profile</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile/Friendlist'><BsPeopleFill className='size-10'/>Friends</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile/Stats'><BsBarChartFill className='size-10'/>Stats</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsDiscord className='size-10'/>Discord</a></li>
  
        </ul>
        <ul className='text-2xl  pl-5 '>
          <li><a className='flex items-center gap-x-5 m-4 mt-70 ' href='#'><img className='size-12' src='/Images/logout.png' alt='Logout'></img>Logout</a></li>
        </ul>
        
    </div>
  )
}
//hover:left-[-1%] left-[-13%] ,

export default Sidebars