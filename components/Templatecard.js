import React from 'react'
import Image from 'next/image'
const Templatecard = () => {
  return (
    <div className='border-2 border-gray-200 rounded-xl overflow-hidden h-[30vh] w-[22vw] '>
        <div className='demoImage  relative w-full h-[22vh] border-b-2 border-b-gray-200 '>
            <Image className='object-cover' src={'/cardimage.svg'} alt='likes' fill />
        </div>
           <div className='flex items-center justify-between mx-2 mt-1'>
            <h1 className='title font-medium'>Business Report</h1>
            <div className='bg-gray-200 rounded-md px-2 text-sm '>Free</div>
            </div> 
            <div className='extra info mx-2 text-gray-400 text-sm flex gap-2 items-center'>
                by david
                <Image src={'/likes.svg'} alt='likes' height={17} width={17} />
                10.2K
                </div>
    </div>
  )
}

export default Templatecard
