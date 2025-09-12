'use client'
import React from 'react'
import Image from 'next/image'
import { getTemplateObject } from '@/actions/useractions'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AddDocument from './AddDocument'

const Templatepreview = ({ templateID }) => {

    const [preview, setpreview] = useState()

    useEffect(() => {
        getdata();
    }, [])

    const getdata = async () => {
        const data = await getTemplateObject(templateID);
        setpreview(data);
    }

    return (
        <div className='templatedemo h-[93vh] md:h-[90vh] w-screen flex justify-center items-center px-2 md:px-0  bg-[#f7f7f7]'>
            {preview && <div className=' h-[90vh] md:h-[80vh] overflow-auto no-scrollbar w-full md:w-[80vw] bg-white p-2 md:p-5 md:flex-row flex-col flex rounded-xl
                     shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
                     hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
                     transition-shadow duration-300 '>
                <div className='info  w-full md:w-[40vw] h-fit md:h-full px-2 md:px-10 '>
                   <Link className='hidden md:block ' href={'/templates'}><button className='mb-16 cursor-pointer flex justify-center items-center gap-1 border-2 border-gray-200 text-gray-400 rounded-md pr-2 pl-1 text-xs '><Image className='' src={'/backbutton.svg'} alt='back' height={15} width={15} />Back</button></Link>
                    <h1 className='md:text-3xl text-lg '>{preview.title}</h1>
                    <div className='extra info pb-1 md:pb-3 md:py-3 text-gray-400 text-xs md:text-sm flex gap-1 items-center'>By {preview.owner}<Image className='ml-3' src={'/likes.svg'} alt='likes' height={17} width={17} />{preview.likes}
                    </div>
                    <AddDocument templateContent={preview.content && preview.content} buttonName={'Use  Template'} />
                    <div className='tagcontainer flex flex-wrap gap-2 my-3'>
                        {preview.tags && preview.tags.map((element) => (
                        <div key={element} className='tag bg-gray-200 px-2 rounded-md w-fit '>{element}</div>
                        ) )}
                    </div>
                    <h2 className='md:text-xl text-base mt-5 font-medium'>Description</h2>
                    <p className='description md:text-base text-xs'>{preview.description}</p>
                    {preview.features && <> <h2 className='text-xl mt-5 font-medium'>Features</h2>
                    <div className='featuresArray mt-1  flex flex-wrap gap-2'>
                       {preview.features.map((element)=>(
                        <div key={element} className='border-2 border-gray-200 rounded-md w-fit px-2 text-sm text-gray-400 '>{element}</div>
                       ))} 
                    </div> </>}
                    
                    
                </div>

                <div className='templateimage mt-5 md:mt-0 relative overflow-hidden border-2 border-gray-200 w-full md:w-[40vw] min-h-[45vh] md:h-full rounded-xl bg-white'>
                    <Image className='object-contain ' src={`/${preview.preview}.png`} alt='likes' fill />
                </div>
            </div>
            }
        </div>
    )
}

export default Templatepreview
