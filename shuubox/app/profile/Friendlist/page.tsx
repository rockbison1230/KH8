
import React from 'react'
import Sidebars from '@/Components/Sidebara'
import Friendpage from '@/Components/PageBodies/Friendpage'
const page = () => {
  return (
    <div className='flex justify-between'>
      <Sidebars/>
      <Friendpage/>
      </div>
  )
}

export default page