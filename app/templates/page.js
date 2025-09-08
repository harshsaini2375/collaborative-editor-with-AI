import React from 'react'
import Templatecard from '@/components/Templatecard'
const page = () => {
  return (
    <div className='templates h-[90vh] w-screen  px-[15vw] bg-[#f7f7f7]'>
      <div className='heading border-2 h-[6vh] w-full '></div>
      <div className='templateGrid rounded-xl h-[80vh] w-full  mt-3 px-4 py-4  bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300'>
            <Templatecard/>
            
        </div>
    </div>
  )
}

export default page
