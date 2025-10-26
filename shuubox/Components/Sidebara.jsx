import React from 'react'

import { BsDiscord,BsPersonFill, BsHouseDoorFill, BsBarChartFill, BsPeopleFill, BsPeaceFill } from "react-icons/bs"

const Sidebars = () => {
  return (
    <div className= 'bg-[#5DE4DA] rounded-2xl w-[20%] h-screen border-4 sticky top-0'>
        <h1 className='mt-5 mb-8 text-3xl pl-5'>Shuubox</h1>
        <ul className='text-2xl  pl-5 '>
            <li className=' '><a className='flex items-center gap-x-5 m-4 ' href='/dashboard'><BsHouseDoorFill/>Home</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile'><BsPersonFill/>Profile</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile/Friendlist'><BsPeopleFill/>Friends</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='/profile/Stats'><BsBarChartFill/>Stats</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsDiscord/>Discord</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4 ml-15' href='#'>Logout</a></li>
        </ul>
    </div>
  )
}
//hover:left-[-1%] left-[-13%] ,

export default Sidebars