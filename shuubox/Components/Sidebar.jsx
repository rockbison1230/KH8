import React from 'react'
import { BsDiscord,BsPersonFill, BsHouseDoorFill, BsBarChartFill, BsPeopleFill, BsPeaceFill } from "react-icons/bs"

const Sidebar = () => {
  return (
    <div className='bg-gray-400 rounded-2xl fixed left-[-1%]  top-0 w-[20%] h-full border-4'>
        <h1 className='mt-5 mb-8 text-3xl pl-5'>Shuubox</h1>
        <ul className='text-2xl  pl-5'>
            <li className=' '><a className='flex items-center gap-x-5 m-4 ' href='#'><BsHouseDoorFill/>Home</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsPersonFill/>Profile</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsPeopleFill/>Friends</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsBarChartFill/>Stats</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4' href='#'><BsDiscord/>Discord</a></li>
            <li className=''><a className='flex items-center gap-x-5 m-4 ml-15' href='#'>Logout</a></li>
        </ul>
    </div>
  )
}
//hover:left-[-1%] left-[-13%] ,

export default Sidebar