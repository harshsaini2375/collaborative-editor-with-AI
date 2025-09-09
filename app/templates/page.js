'use client'
import React, { useEffect } from 'react'
import Templatecard from '@/components/Templatecard'
import { getTemplatesByCategory } from '@/actions/useractions'
import { useState } from 'react'

const page = () => {

  const [businessarray, setbusinessarray] = useState([])
  const [academicarray, setacademicarray] = useState([])
  const [technicalarray, settechnicalarray] = useState([])
  const [creativearray, setcreativearray] = useState([])

  useEffect(() => {
    assigncategories();
  }, [])


  const assigncategories = async () => {
    const businessresult = await getTemplatesByCategory('Business');
    setbusinessarray(businessresult);
    const academicresult = await getTemplatesByCategory('Academic');
    setacademicarray(academicresult)
    const technicalresult = await getTemplatesByCategory('Technical');
    settechnicalarray(technicalresult)
    const creativeresult = await getTemplatesByCategory('Creative');
    setcreativearray(creativeresult)
  }


  return (
    <div className='templates h-[90vh] w-screen  px-[15vw] bg-[#f7f7f7]'>
      <div className='heading border-2 h-[6vh] w-full '></div>
      <div className='templateGrid rounded-xl h-[80vh] w-full overflow-auto no-scrollbar mt-3 px-4 py-4  bg-white
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
        transition-shadow duration-300'>

        <h1 className='category'>Business</h1>
        <div className='categoryTemplates mb-10 flex  justify-between w-full h-[30vh] '>
          {businessarray.length > 0 && businessarray.map((element) => (
            <Templatecard key={element._id} templateID={element.id} templateObject={element} />
          ))}
        </div>
        <h1 className='category'>Academic</h1>
        <div className='categoryTemplates mb-10 flex  justify-between w-full h-[30vh] '>
          {academicarray.length > 0 && academicarray.map((element) => (
            <Templatecard key={element._id} templateID={element.id} templateObject={element} />
          ))}
        </div>
        <h1 className='category'>Technical</h1>
        <div className='categoryTemplates mb-10 flex  justify-between w-full h-[30vh] '>
          {technicalarray.length > 0 && technicalarray.map((element) => (
            <Templatecard key={element._id} templateID={element.id} templateObject={element} />
          ))}
        </div>
        <h1 className='category'>Creative</h1>
        <div className='categoryTemplates mb-10 flex  justify-between w-full h-[30vh] '>
          {creativearray.length > 0 && creativearray.map((element) => (
            <Templatecard key={element._id} templateID={element.id} templateObject={element} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default page
