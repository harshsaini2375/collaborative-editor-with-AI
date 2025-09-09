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
        <div className='templatedemo h-[90vh] w-screen flex justify-center items-center  bg-[#f7f7f7]'>
            {preview && <div className='h-[80vh] w-[80vw] bg-white p-5 flex rounded-xl
                     shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
                     hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]
                     transition-shadow duration-300 '>
                <div className='info w-[40vw] h-full  px-10 '>
                   <Link href={'/templates'}><button className='mb-16 cursor-pointer flex justify-center items-center gap-1 border-2 border-gray-200 text-gray-400 rounded-md pr-2 pl-1 text-xs '><Image className='' src={'/backbutton.svg'} alt='back' height={15} width={15} />Back</button></Link>
                    <h1 className='text-3xl  '>{preview.title}</h1>
                    <div className='extra info py-3 text-gray-400 text-sm flex gap-1 items-center'>By {preview.owner}<Image className='ml-3' src={'/likes.svg'} alt='likes' height={17} width={17} />{preview.likes}
                    </div>
                    <AddDocument templateContent={preview.content && preview.content} buttonName={'Use Template'} />
                    <div className='tagcontainer flex  gap-2 my-3'>
                        {preview.tags && preview.tags.map((element) => (
                        <div key={element} className='tag bg-gray-200 px-2 rounded-md w-fit '>{element}</div>
                        ) )}
                    </div>
                    <h2 className='text-xl mt-5 font-medium'>Description</h2>
                    <p className='description'>{preview.description}</p>
                </div>

                <div className='templateimage relative overflow-hidden  w-[40vw] h-full rounded-xl bg-white'>
                    <Image className='object-cover ' src={'/cardimage.svg'} alt='likes' fill />
                </div>
            </div>
            }
        </div>
    )
}

export default Templatepreview
