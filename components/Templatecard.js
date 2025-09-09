import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Templatecard = ({ templateObject, templateID }) => {
  return (
    <Link href={`/templates/${templateID}`} >
      <div className='border-2 border-gray-200 rounded-xl overflow-hidden h-[30vh] w-[21vw] '>
        <div className='demoImage  relative w-full h-[22vh] border-b-2 border-b-gray-200 '>
          <Image className='object-cover' src={'/cardimage.svg'} alt='demo' fill />
        </div>
        <div className='flex items-center justify-between mx-2 mt-1'>
          <h1 className='title font-medium'>{templateObject.title}</h1>
          {templateObject.premium ? <div className='bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md px-2 text-sm '>Premium</div> : <div className='bg-gray-200 rounded-md px-2 text-sm '>Free</div>}
                  
        </div>
        <div className='extra info mx-2 text-gray-400 text-sm flex gap-2 items-center'>
          {templateObject.owner}
          <Image src={'/likes.svg'} alt='likes' height={17} width={17} />
          {templateObject.likes}
        </div>
      </div>
    </Link>
  )
}

export default Templatecard
